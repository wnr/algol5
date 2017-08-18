/*
The public methods of the Algol system.
Meant to be consumed by an app.
*/

import engine from './engine'

import games from '../games/temp/ALLGAMES'

let sessions = {}

let api = {
    /*
    Start a new session for a given game with the given players
    */
    startGameSession(gameId,plr1,plr2){
        let session = engine.newSession(gameId,plr1,plr2);
        sessions[session.id] = session;
        return engine.getSessionUI(session, session.step);
    },
    /*
    Make a mark, do a command, etc. Perform an action in a session!
    */
    makeSessionAction(sessionId,action){
        let session = sessions[sessionId];
        //console.log('Gonna do',action,'in session',sessionId,'which has state',session);
        session = engine.makeSessionAction(session,action);
        return engine.getSessionUI(session, session.step);
    },
    /*
    Returns array of best moves for finishing current turn according to named brain.
    */
    findBestOption(sessionId,brain){
        let {game,turn} = sessions[sessionId]
        let func = game['brain_'+brain+'_'+turn.player],
            winners = [], highscore = -1000000
        if (turn.ends.win.length){
            winners = turn.ends.win.map(winId => turn.steps[winId].path);
        } else {
            for(var stepid in turn.next){
                var stepscore = func(turn.steps[stepid])
                if (stepscore > highscore){
                    winners = [turn.steps[stepid].path]
                    highscore = stepscore
                } else if (stepscore === highscore) {
                    winners.push(turn.steps[stepid].path)
                }
            }
        }
        return winners;
    },
    /*
    Not in use yet.
    a save is = [turnnbr,moves]
    */
    inflateFromSave(gameId,save){
        let [turnnbr,moves] = save
        let game = games[gameId]
        let turn = engine.hydrateTurn(game, game.newGame())
        let stepid = 'root'
        while(turn.turn < turnnbr){
            let action, available = Object.keys(turn.links[stepid]).sort()
            if (available.length === 1){
                action = available[0]
            } else if (available.length > 1){
                if (!moves.length){ throw "Many available but no save index left!" }
                action = available[moves.shift()]
            } else {
                throw "No available actions!"
            }
            let func = turn.links[stepid][action]
            if (action === 'endturn'){
                turn = engine.hydrateTurn(game,turn.next[stepid])
                stepid = 'root'
            } else {
                stepid = stepid+'-'+[action]
            } // TODO endgame funcs too!
            console.log(action,available.length === 1)
        }
        return turn // TODO return session instead? Rather, session id? Or UI, even?
    }
}

export default api