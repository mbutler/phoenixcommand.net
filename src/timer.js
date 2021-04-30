
/**
 * This module handles timer functionality
 * @module Timer
 * @namespace
 */

import * as Database from './database'
import * as User from './user'
import * as Utils from './utils'
import * as pf from 'phoenix-functions'

/**
 * Sets the User's characters in Timer dropdowns
 *
 * @param {object} user - A Firebase auth user
 * @memberof Timer
 * @return {undefined} - Modifies the DOM
 */
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

/**
 * Runs any action in the actionList for the current game time
 *
 * @param {string} gameId - A game id in the format "{user.uid}/games/{games object id}"
 * @memberof Timer
 * @return {undefined} - Modifies the database
 */
export function run(gameId) {
    let path = 'users/' + gameId + '/content/actionList/'
    let snap = Database.actionList(gameId)
    snap.then(actions => {
        let keys = _.keys(actions.list)
        _.forEach(keys, key => {
            let action = actions.list[key]
            if (_.isEqual(action.runTime.time, actions.time)) {
                let ref = Database.ref(action.characterPath)
                ref.on('value', snapshot => {
                    let userId = window.localStorage.getItem('firebird-command-user-id')
                    let character = snapshot.val()
                    Utils.log(`${character.name}: ${action.message}`)
                    if (action.setBy == userId) {
                        Utils.modal(`${character.name}'s Reminder:`, action.message)
                    }                    
                    Database.remove(path, key)
                })                
            }
        })
    })
}

/**
 * Adds an action object to a game's actionList
 *
 * @param {object} action - A Phoenix Command action object
 * @memberof Timer
 * @return {undefined} - Modifies the database
 */
export function add(action) {
    let path = 'users/' + action.gameId + '/content/actionList'
    Database.push(path, action)
}

/**
 * An action object template with pre-filled values for userId and currentCharacter
 *
 * @memberof Timer
 * @return {object} - An empty Phoenix Command action object
 */
export function actionTemplate() {
    let currentCharacter = window.localStorage.getItem('firebird-command-current-character')
    let userId = window.localStorage.getItem('firebird-command-user-id')
    let current = _.split(currentCharacter, '/')
    let action = {}
    action.runTime = {}    
    action.setTime = {}
    action.message = ''
    action.function = ''
    action.parameters = []
    action.setBy = userId
    action.characterPath = currentCharacter
    action.userList = []
    return action
}

/**
 * Allows the user to arbitrarily set the game clock 
 *
 * @param {object} user - A Firebase auth user
 * @memberof Timer
 * @return {undefined} - Modifies the DOM and database
 */
export function clock(user) {
    let snapshot = Database.currentGame(user.uid)
    snapshot.then(game => {
        let path = game.metadata.gameId
        $('.game-title').text(game.metadata.title)
        if (_.split(game.metadata.gameId,'/')[0] === user.uid) {
            $('#set-clock').append('<button id="clock-time-button" class="btn btn-primary btn-sm">Set Clock</button>')
            $('#set-advance-clock').append('<button id="clock-advance-button" class="btn btn-primary btn-sm">Advance Clock</button>')
        }
        $('#clock-impulse-input').change(e => {
            let impulse = _.toNumber($('#clock-impulse-input').val())
            if (impulse > 4) {$('#clock-impulse-input').val(4)}
            if (impulse < 1) {$('#clock-impulse-input').val(1)}
        })
        $('#clock-time-button').click(e => {
            let phase = _.toNumber($('#clock-phase-input').val())
            let impulse = _.toNumber($('#clock-impulse-input').val())
            let time = {"phase": phase, "impulse": impulse}
            Database.set('users/' + path + '/content/time', time)
            Utils.modal('Clock', 'Time Changed')
        })
        $('#clock-advance-button').click(e => {
            let phase = _.toNumber($('#clock-phase-input').val())
            let impulse = _.toNumber($('#clock-impulse-input').val())
            let time = {"phase": phase, "impulse": impulse}
            let hour = $('#clock-hour-input').val()
            let minute = $('#clock-minute-input').val()
            hour = hour + 'h'
            minute = minute + 'm'
            let hourPhases = pf.incapacitationTimeToPhases(hour)
            let minutePhases = pf.incapacitationTimeToPhases(minute)
            let total = hourPhases + minutePhases
            let newTime = pf.phasesToTime(total, time)
            Database.set('users/' + path + '/content/time', newTime)
            Utils.modal('Clock', 'Time Changed')
        })
    })
}



/*
{
    action.runTime = {"phase": 5, "impulse": 3}    
    action.setTime = {"phase": 2, "impulse": 3}
    action.message = 'Reloading Uzi'
    action.function = 'reload'
    action.parameters = ['doo', 'dah']
    action.setBy = 'tFZn6Q7yIaSHwcOiCyNV3NlZERj2'
    action.characterPath = 'users/tFZn6Q7yIaSHwcOiCyNV3NlZERj2/games/-LVymInNe…FZE5Kz6Ba/content/characters/-LVynbcLBx3I71LXFiIt'
    action.gameId = 'tFZn6Q7yIaSHwcOiCyNV3NlZERj2/games/-LVymInNePcFZE5Kz6Ba'
    action.userList = ['tFZn6Q7yIaSHwcOiCyNV3NlZERj2']
}
*/