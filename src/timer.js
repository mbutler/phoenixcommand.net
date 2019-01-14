import * as pf from 'phoenix-functions'
import * as Database from './database'
import * as User from './user'
import * as Utils from './utils'

export function setUser(user) {
    let snap = Database.currentGame(user.uid)
    snap.then(game => {
        $('.game-title').text(game.metadata.title)
        let userCharacters = User.getUserCharacters(game)
        _.forEach(userCharacters, player => {
            if (user.uid === player.userId) {
                $('#timer-character-name .dropdown-menu').append(`<span class="dropdown-item dropdown-timer">${player.characterName}</span>`)                 
            }
        })
    })    
}

export function run(gameId) {
    let path = 'users/' + gameId + '/content/actionList/'
    let snap = Database.actionList(gameId)
    snap.then(actions => {
        let keys = _.keys(actions.list)
        _.forEach(keys, key => {
            let action = actions.list[key]
            if (_.isEqual(action.runTime, actions.time)) {
                //do stuff with the action
                Utils.modal('Phoenix Command', action.message)
                Database.remove(path, key)
            }
        })
    })
}

export function add(action) {
    let path = 'users/' + action.gameId + '/content/actionList'
    Database.push(path, action)
}



/*
{
    "setTime": {},
    "runTime": {},
    "setBy": "",
    "message": "",
    "action": "",
    "userList": [],
    "function": function(){},
    "gameId": ""
}
*/