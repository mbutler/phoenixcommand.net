/**
 * This module handles various utility functionality
 * @module Utils
 * @namespace
 */

import {codenames} from './codenames'
import {mission} from './operations'
import * as Database from './database'
import _ from 'lodash'

/**
 * Finds all selected checkboxes
 *
 * @param {array} boxes - A list of input checkboxes
 * @memberof Utils
 * @return {array} - List of all checkboxes that are selected
 */
export function selectedCheckboxes(boxes) {
  let selected = []
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      selected.push(boxes[i].defaultValue)
    }
  }
  return selected
}

/**
 * Rolls 3d6
 *
 * @memberof Utils
 * @return {number} - The result of rolling 3d6
 */
function threeD6() {
  return _.random(1, 6) + _.random(1, 6) + _.random(1, 6)
}

/**
 * Adds a message to the game's log
 *
 * @param {string} msg - A text message to be logged
 * @memberof Utils
 * @return {undefined} - Modifies the database
 */
export function log(msg) {
  let snap = Database.currentGame()
  snap.then(game => {
    let entry = {}
    entry.time = game.content.time
    entry.message = msg
      Database.push('users/' + game.metadata.gameId + '/metadata/log/', entry)
  })
}

/**
 * Displays the contents of a game's log
 *
 * @param {object} user - A Firebase auth user
 * @memberof Utils
 * @return {undefined} - Modifies the DOM
 */
export function displayLog(user) {
  let snapshot = Database.currentGame(user.uid)
  snapshot.then(game => {
    $('.game-title').text(game.metadata.title)
    if (_.split(game.metadata.gameId,'/')[0] === user.uid) {
      $('#log-table').parent().append('<button id="empty-log" class="btn btn-danger btn-sm">Empty Log</button>')
    }    
    let log = game.metadata.log
    _.forOwnRight(log, value => {
      let div = `<tr><td>${value.time.phase}</td><td>${value.time.impulse}</td><td>${value.message}</td></tr>`
      $('#log-table tbody').append(div)
    })
    if (log === undefined) {
      $('#log-table tbody').append(`<tr><td></td><td></td><td>No log entries found.</td></tr>`)
    }
    $('#empty-log').click(e => {
      let path = `users/${game.metadata.gameId}/metadata/log/`
      let ref = Database.ref(path)
      ref.remove()
      $('#log-table tbody').empty()
      $('#log-table tbody').append(`<tr><td></td><td></td><td>No log entries found.</td></tr>`)
    })
  })
}

/**
 * Displays the action list
 *
 * @param {object} user - A Firebase auth user
 * @memberof Utils
 * @return {undefined} - Modifies the DOM and database
 */
export function displaySetActions(user) {
  let snapshot = Database.currentGame(user.uid)
  snapshot.then(game => {
    $('.game-title').text(game.metadata.title)
    let actionList = game.content.actionList
    _.forOwn(actionList, (value, key) => {
      let ref = Database.ref(value.characterPath)
      ref.once('value', data => {
        let character = data.val()
        let trash = ''
        if (user.uid === value.setBy) {
          trash = `<i id="0${key}" class="fa fa-trash" data-actionpath="users/${value.gameId}/content/actionList/" data-actionid="${key}" aria-hidden="true"></i>`
        }
        let div = `<tr><td>${value.runTime.time.phase}</td><td>${value.runTime.time.impulse}</td><td>${character.name}: ${value.message}</td><td>${trash}</td></tr>`
        $('#actions-table tbody').append(div)
        $(`#0${key}`).click(e => {
          let actionPath = $(e.target).data('actionpath')
          let actionKey = $(e.target).data('actionid')
          deleteModal('Delete Action', "Delete this action?", actionPath, actionKey)
        })
      })      
    })
    if (actionList === undefined) {
      $('#actions-table tbody').append(`<tr><td></td><td></td><td>No action entries found.</td></tr>`)
    }
  })
}

/**
 * Creates display text for a phoenix-functions hit result object
 *
 * @param {object} result - A phoenix-functions hit result object
 * @memberof Utils
 * @return {string} - Properly parsed and formatted text for hit result
 */
export function parseHitResult(result) {
  let response = ""
  _.forOwn(result, (value, key) => {
      if (value.hit === true) {
          response += `${key} hit ${value.bullets} time(s). `
      } else {
          response += `Missed ${key}`
      }        
  })
  return response
}

/**
 * Generates random attributes for a character
 *
 * @memberof Utils
 * @return {undefined} - Modifies the DOM
 */
export function randomize() {
  let name = _.sample(codenames)
  let skill = _.random(1, 6)
  $('#skill-level').val(skill)
  $('#codename').val(name)
  let str = threeD6()
  $('#strength').val(str)
  let int = threeD6()
  $('#intelligence').val(int)
  let will = threeD6()
  $('#will').val(will)
  let health = threeD6()
  $('#health').val(health)
  let agi = threeD6()
  $('#agility').val(agi)
}

/**
 * Toggles sign out/sign in display based on auth state of user
 *
 * @param {object} user - A Firebase auth user
 * @memberof Utils
 * @return {undefined} - Modifies the DOM
 */
export function toggleSignInLink(user) {
  if (user) {
    $('#login').empty().append(`<a href="#" style="color: black;" id="signout" class="nav-link"><i class="material-icons">account_circle</i> Sign Out</a>`)
  } else {
    $('#login').empty().append(`<a href="#" style="color: black;" id="signin" class="nav-link" data-toggle="modal" data-target="#signinModal"><i class="material-icons">account_circle</i> Sign In</a>`)
  }
}

/**
 * Changes the shot type dropdown based on the weapon
 *
 * @param {object} gun - A phoenix-functions gun object
 * @memberof Utils
 * @return {undefined} - Modifies the DOM
 */
export function setShotType(gun) {
  if (gun.Type === 'Pistol') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Single Shot')
    $('#burst-eal').hide()
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }

  if (gun.Type === 'Sub-Machinegun') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Burst')
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }

  if (gun.Type === 'Assault Rifle') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Burst')
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }

  if (gun.Type === 'Machine Gun') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Burst')
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }

  if (gun.Type === 'Shotgun') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Shotgun')
    $('#single-shot-eal').hide()
    $('#explosive-eal').hide()
    $('#burst-eal').hide()     
  }

  if (gun.Type === 'Explosive') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Explosive')
    $('#single-shot-eal').hide()
    $('#burst-eal').hide()
    $('#shotgun-eal').hide()    
  }

  if (gun.Type === 'Assault Rifle' && gun.ROF === 1) {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Single Shot')
    $('#burst-eal').hide()
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }
}

/**
 * Displays the generated mission name for the game
 *
 * @memberof Utils
 * @return {undefined} - Modifies the DOM
 */
export function operationName() {
  $('#gamename').val(mission())
}

/**
 * Displays a user's account information
 *
 * @param {object} user - A Firebase auth user
 * @memberof Utils
 * @return {undefined} - Modifies the DOM
 */
export function displayAccount(user) {
  $('#account-name').text(user.displayName)
  $('#account-id').text(user.uid)
  $('#account-email').text(user.email)
}

/**
 * Displays default text for empty user
 *
 * @memberof Utils
 * @return {undefined} - Modifies the DOM
 */
export function clearUserDisplay() {
  $('#game-dropdown').empty()
  $('#account-name').text('Account Name')
  $('#account-id').empty()
  $('#account-email').empty()
}

/**
 * Gets the game path from localstorage in the format of "users/{user.uid}/games/{games object id}
 *
 * @memberof Utils
 * @return {string} - The game path
 */
export function getGamePath() {
  let path = window.localStorage.getItem('firebird-command-current-character')
  let pathArr = _.split(path, '/', 4)
  let gamePath = _.join(pathArr, '/')
  return gamePath
}

/**
 * Displays a modal with custom title and message
 *
 * @param {string} title - Text for the title area
 * @param {string} msg - Text for the content
 * @memberof Utils
 * @return {undefined} - Modifies the DOM
 */
export function modal(title, msg) {
  $('.modal').modal('hide')
  let rand = Math.random().toString(36).substring(7)
  let div = `<div class="modal fade" id="${rand}" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="">${title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="" class="modal-body">
                <h3>${msg}</h3>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
  </div>`
  
  $('#modal-holder').append(div)
  $(`#${rand}`).modal()
}

/**
 * Displays a confirmation modal for database deletion
 *
 * @param {string} title - Text for the title area
 * @param {string} msg - Text for the content
 * @param {string} path - Path to the database resource
 * @param {string} key - ID of object to delete
 * @memberof Utils
 * @return {undefined} - Modifies the DOM and database
 */
export function deleteModal(title, msg, path, key) {
  $('.modal').modal('hide')
  let rand = Math.random().toString(36).substring(7)
  let div = `<div class="modal fade" id="${rand}" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="">${title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="" class="modal-body">
                <h3>${msg}</h3>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal">Yes</button>
            </div>
        </div>
    </div>
  </div>`
  
  $('#modal-holder').append(div)
  $(`#${rand}`).modal()

  $('.btn-primary').click(e => {
    Database.remove(path, key)
    $(`#0${key}`).parent().parent().remove()
  })
}

/**
 * Displays a confirmation modal for game object and nav reference deletion
 *
 * @param {string} title - Text for the title area
 * @param {string} msg - Text for the content
 * @param {string} path - Path to the database resource
 * @param {string} key - ID of object to delete
 * @memberof Utils
 * @return {undefined} - Modifies the DOM and database
 */
export function deleteGameModal(title, msg, path, key) {
  $('.modal').modal('hide')
  let userPath = _.split(path, '/')
  let gamePath = userPath[1] + '/games/' + key
  //let userRef = Database.ref(userPath[0] + '/' + userPath[1])
  let adminRef = Database.ref('users/' + userPath[1] + '/adminOf')
  let rand = Math.random().toString(36).substring(7)
  let div = `<div class="modal fade" id="${rand}" tabindex="-1" role="dialog" aria-labelledby="" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="">${title}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div id="" class="modal-body">
                <h3>${msg}</h3>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal">Yes</button>
            </div>
        </div>
    </div>
  </div>`
  
  $('#modal-holder').append(div)
  $(`#${rand}`).modal()

  $('.btn-primary').click(e => {
    Database.set('users/' + userPath[1] + '/currentGame/', "none") 
    adminRef.once('value').then(snapshot => { 
      snapshot.forEach(childSnapshot => {
        let game = childSnapshot.val()
        if (gamePath === game.gameId) {
          Database.remove('users/' + userPath[1] + '/adminOf/', childSnapshot.key)
          Database.remove('users/' + userPath[1] + '/games/', key) 
          window.location = "http://phoenixcommand.net/account.html"
        }
      })
    })
  })
}