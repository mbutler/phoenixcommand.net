import {codenames} from './codenames'
import {mission} from './operations'
import * as Database from './database'

export function selectedCheckboxes(boxes) {
  let selected = []
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      selected.push(boxes[i].defaultValue)
    }
  }
  return selected
}

function threeD6() {
  return _.random(1, 6) + _.random(1, 6) + _.random(1, 6)
}

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

export function toggleSignInLink(user) {
  if (user) {
    $('#login').empty().append(`<a href="#" style="color: black;" id="signout" class="nav-link"><i class="material-icons">account_circle</i> Sign Out</a>`)
  } else {
    $('#login').empty().append(`<a href="#" style="color: black;" id="signin" class="nav-link" data-toggle="modal" data-target="#signinModal"><i class="material-icons">account_circle</i> Sign In</a>`)
  }
}

export function setShotType(gunType) {
  if (gunType === 'Pistol') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Single Shot')
    $('#burst-eal').hide()
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }

  if (gunType === 'Sub-Machinegun') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Burst')
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }

  if (gunType === 'Assault Rifle') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Burst')
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }

  if (gunType === 'Machine Gun') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Burst')
    $('#shotgun-eal').hide()
    $('#explosive-eal').hide()      
  }

  if (gunType === 'Shotgun') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Shotgun')
    $('#single-shot-eal').hide()
    $('#explosive-eal').hide()
    $('#burst-eal').hide()     
  }

  if (gunType === 'Explosive') {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Explosive')
    $('#single-shot-eal').hide()
    $('#burst-eal').hide()
    $('#shotgun-eal').hide()    
  }
}

export function operationName() {
  $('#gamename').val(mission())
}

export function displayAccount(user) {
  $('#account-name').text(user.displayName)
  $('#account-id').text(user.uid)
  $('#account-email').text(user.email)
}

export function clearUserDisplay() {
  $('#game-dropdown').empty()
  $('#account-name').text('Account Name')
  $('#account-id').empty()
  $('#account-email').empty()
}

export function getGamePath() {
  let path = window.localStorage.getItem('firebird-command-current-character')
  let pathArr = _.split(path, '/', 4)
  let gamePath = _.join(pathArr, '/')
  return gamePath
}

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
    $(`#${key}-row`).remove()
  })
}

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