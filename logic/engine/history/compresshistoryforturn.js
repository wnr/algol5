/*
WIP?
Returns array of UI objects for given turn, with adjusted marks
*/

import getSessionUI from '../session/getsessionui';
import lib from '../../games/logic';

export default function compressedHistoryForTurn(session,turn){
    return session.step.path.reduce((mem,action)=>{
        mem.id += '-' + action
        if (session.game.commands[action]){
            let UI = getSessionUI(session, turn.steps[mem.id]);
            UI.potentialMarks = {};
            UI.activeMarks = mem.marks.map(pos=>({pos, coords: lib.pos2coords(pos)}));
            UI.description = action + '(' + mem.marks.join(',') + ')';
            mem.UIs.push(UI);
            mem.marks = [];
        } else {
            mem.marks.push(action);
        }
        return mem;
    },{marks:[], UIs: [], id: 'root'}).UIs;
}