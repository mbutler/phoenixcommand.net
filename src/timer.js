import * as pf from 'phoenix-functions'
import * as Database from './database'
import * as Utils from './utils'

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