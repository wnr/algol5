import isObject from 'lodash/lang/isObject'
import isArray from 'lodash/lang/isArray'
import isEqual from 'lodash/lang/isEqual'
import isString from 'lodash/lang/isString'
import invert from 'lodash/object/invert'
import some from 'lodash/collection/some'
import reduce from 'lodash/collection/reduce'
import filter from 'lodash/collection/filter'
import range from 'lodash/utility/range'
import indexOf from 'lodash/array/indexOf'
import uniq from 'lodash/array/uniq'

const colnametonumber = reduce("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXYZ".split(""),(mem,char,n)=> {
	mem[char] = n+1;
	return mem;
},{});

const colnumbertoname = invert(colnametonumber)


/*
Helper functions which all returns actual values, not stringified
*/

export default U => Object.assign(U,{

	needLevel: (O,expr)=>
		U.contains(expr,['dir']) ? 'loop' :
		U.contains(expr,['start']) ? 'dir' : 
		'start',

	needsWalkPath: (O,def)=> !U.drawDuringWhile(O,def) || U.needsWalkLength(O,def),

	needsWalkLength: (O,def)=> def.draw.last || U.contains(def.draw,['walklength']),

	drawDuringWhile: (O,def)=> (
		def && def.draw && 
		!U.contains([def.draw.steps,def.draw.all],['totalcount']) && 
		!U.contains([def.draw.steps,def.draw.all],['walklength'])
	),

	needsStopreason: (O,actiondef)=> actiondef.draw.blocks || U.contains(actiondef,['stopreason']),

	/*
	Calculate all Artifact layers affected by an action
	*/
	actionLayers: (O,actiondef)=>  Object.keys((actiondef.runGenerators||[]).concat(actiondef.runGenerator ? [actiondef.runGenerator] : []).reduce((mem,gen)=> {
		let gens = U.possibilities(gen)
		gens.forEach(gen=>{
			mem = Object.assign(mem,U.generatorLayers(O.rules.generators[gen]))
		})
		return mem
	},{})),

  /*
  Calculates all layers used by a generator
  */
  generatorLayers: (gendef)=> reduce(gendef.draw,(mem2,drawdef)=> {
    return reduce(U.possibilities(drawdef.tolayer),(mem3,l)=> {
      const list = drawdef.include && drawdef.include.hasOwnProperty("owner") ? [l,"my"+l,"opp"+l,"neutral"+l] : [l]
      return reduce(list, (mem4,l)=> ({...mem4, [l]:{} }), mem3)
    },mem2)
  },{}),

	usesTurnVars: (O)=> {
		O = O || {}
		O.rules = O.rules || {}
		O.rules.commands = O.rules.commands || {}
		O.rules.marks = O.rules.marks || {}
		let search = O.cmndname ? O.rules.commands[O.cmndname] : O.markname ? O.rules.marks[O.markname] : O.rules;
		return U.contains(search,'turnvar') || U.contains(search,'turnpos') || U.contains(search,'setturnvar') || U.contains(search,'setturnpos');
	},

	markGenerates: (O)=> U.markRules(O).runGenerator || U.markRules(O).runGenerators,

	startRules: (O)=> O && O.rules && O.rules.startTurn || {},

	markRules: (O)=> O && O.rules && O.rules.marks && O.rules.marks[O.markname] || {},

	cmndRules: (O)=> O && O.rules && O.rules.commands && O.rules.commands[O.cmndname] || {},

	boardPositions: (board)=> reduce(
		range(1,board.height+1),
		(mem,y)=> reduce(
			range(1,board.width+1),
			(innermem,x)=> innermem.concat(U.coords2pos({x,y})),
			mem
		),
		[]
	).sort(),


	convertToEntities: (def)=> {
		switch(def[0]){
			case "pos": // ["pos",list,blueprint]
				return def[1].map( pos=> Object.assign({pos:pos},def[2]) )
			case "rect": // ["rect",bottomleft,topright,blueprint]
			case "holerect": // ["holerect",bottomleft,topright,holes,blueprint]
				let bottomleft = U.pos2coords(def[1]),
					topright = U.pos2coords(def[2]),
					blueprint = def[3]
				let positions = reduce(range(bottomleft.y,topright.y+1),(mem,y)=>{
					return reduce(range(bottomleft.x,topright.x+1),(innermem,x)=>{
						return innermem.concat(U.coords2pos({x,y}))
					},mem)
				},[])
				if (def[0]==="holerect"){
					blueprint = def[4]
					positions = filter(positions,p=>indexOf(def[3],p)===-1)
				}
				return positions.map( pos=> Object.assign({pos:pos},blueprint) )
			default: 
				if (isString(def)){
					return [{pos:def}]
				} else if (isObject(def)){
					return [def]
				} else {
					throw "Unknown def: "+def
				}
		}
	},

	offsetPos: (pos,dir,forward,right,board)=> {
		let forwardmods = [[0,1],[1,1],[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1]], // x,y
			rightmods =   [[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]],
			n = dir-1,
			coords = U.pos2coords(pos),
			newx = coords.x + forwardmods[n][0]*forward + rightmods[n][0]*right,
			newy = coords.y + forwardmods[n][1]*forward + rightmods[n][1]*right,
			withinbounds =  newx>0 && newx<=board.width && newy>0 && newy<=board.height;
		return withinbounds && U.coords2pos({x:newx,y:newy})
	},

	posConnections: (pos,board)=> {
		return [1,2,3,4,5,6,7,8].reduce((mem,dir)=>{
			let newpos = U.offsetPos(pos,dir,1,0,board)
			if (newpos){
				mem[dir] = newpos
			}
			return (board.offsets||[]).reduce((innermem,[forward,right])=>{
				let newpos = U.offsetPos(pos,dir,forward,right,board)
				if (newpos){
					innermem['o'+dir+'_'+forward+'_'+right] = newpos
				}
				return innermem;
			},mem);
		},{})
	},

	pos2coords: (pos)=> ({
		x: colnametonumber[pos[0]],
		y: parseInt(pos.substr(1))
	}),

	coords2pos: (coords)=> colnumbertoname[coords.x]+coords.y,

	contains: (haystack,needle)=> {
		if (isEqual(needle,haystack)){
			return true
		} else if (isArray(haystack) || isObject(haystack)){
			return some(haystack,child=> U.contains(child,needle))
		} else {
			return false
		}
	},

	possibilities: def=>
		def[0] === 'ifelse' ? U.possibilities(def[2]).concat(U.possibilities(def[3]))
		: def[0] === 'playercase' ? U.possibilities(def[1]).concat(U.possibilities(def[2]))
		: def[0] === 'if' ? U.possibilities(def[2])
		: [def],

	listlength: def=> {
		if (def[0] === 'list'){
			return U.listlength(def[1]);
		} else if (def[0] === 'playercase'){
			let len1 = U.listlength(def[1])
			let len2 = U.listlength(def[2])
			return len1 && len2 && len1 === len2 ? len1 : undefined;
		} else if (def[0] === 'ifelse'){
			let len1 = U.listlength(def[2])
			let len2 = U.listlength(def[3])
			return len1 && len2 && len1 === len2 ? len1 : undefined;
		} else {
			return def.length;
		}
	},

	/*
	Parses command data to find all potential groups created by commands like spawn.
	Used in deduceUnitLayers
	*/
	deduceDynamicGroups: (data)=> uniq(
		data[0] === "spawn" ? U.possibilities(data[2])
		: {setat:1,setid:1,setin:1}[data[0]] && U.contains(U.possibilities(data[2]),'group') ? U.possibilities(data[3])
		: isArray(data) || isObject(data) ? reduce(data,(mem,def)=>mem.concat(U.deduceDynamicGroups(def)),[])
		: []
	).sort()
});
