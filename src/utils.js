import {codenames} from './codenames'
import {mission} from './operations'

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
    $('#signin').hide()
    $('#signout').show()
  } else {
    $('#signout').hide()
    $('#signin').show()
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

export function modal(title, msg, buttons) {
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