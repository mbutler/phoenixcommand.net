import * as Utils from './utils'
import * as User from './user'
import * as Character from './character'
import * as Calc from './calc'
import * as Game from './game'
import * as Database from './database'
import * as Timer from './timer'
import * as pf from 'phoenix-functions'

$('#randomize-character').click(e => {
  Utils.randomize()
})

$('.submission-form').on('submit', e => {
  e.preventDefault()
})

$('#character-submit-button').click(e => {
  Character.submitCharacter()
})

$('#new-game-submit-button').click(e => {
  Game.newGameSubmit()
})

$('#operation-name-button').click(e => {
  Utils.operationName()
})

$('#signout').on('mousedown touchstart', () => {
  Database.auth().signOut().then(() => {
      $('#signoutModal').modal()
      Utils.clearUserDisplay()
    }).catch(error => {
      console.log('Sign out error.')
    })
})

$('#eal-button').click(e => {
  e.preventDefault()
  Calc.eal()
})

$('.dropdown-eal').click(e => {
  e.preventDefault()
  let targetId = $(e.target.parentElement.parentElement).attr('id')
  let result = e.delegateTarget.innerText
  $(`#${targetId} .dropdown-toggle`).empty().append(result)
})

$('#weapon-button').on('click', '.dropdown-eal', e => {
  $('#weapon-button .dropdown-toggle').empty()
  e.preventDefault()
  let result = e.target.innerText
  let weaponType = pf.getWeaponByName(result).Type
  Utils.setShotType(weaponType)
  $(`#weapon-button .dropdown-toggle`).empty().append(result)
})

$('#game-dropdown').on('click', '.dropdown-item', e => {
  let uid = $(e.target).data('uid')
  let gameId = $(e.target).data('gameid')
  Game.select(uid, gameId)
})

$("#calc-character-name").on('click', '.dropdown-eal', e => {
  $('#calc-character-name .dropdown-toggle').empty()
  e.preventDefault()
  let targetId = $(e.target.parentElement.parentElement).attr('id')
  let result = e.target.innerText
  $(`#${targetId} .dropdown-toggle`).empty().append(result)
  let snap = Database.currentGame()
  snap.then(game => {
    _.forEach(game.content.characters, player => {                
      if (player.name === result) {
        window.localStorage.setItem('firebird-command-current-character', 'users/' + game.metadata.gameId + '/content/characters/' + User.getCharacterId(game, result))
        $('#sal').val(player.sal)
        $(`#firing-stance-button .dropdown-toggle`).empty().append(player.stance)
        $(`#position-button .dropdown-toggle`).empty().append(player.position)
        $('#weapon-button .col .dropdown-menu').empty()
        _.forEach(player.weapons, gun => {
            $('#weapon-button .col .dropdown-menu').append(`<span class="dropdown-item dropdown-eal">${gun}</span>`)
        })
      }
    })
  })   
})

//testing
$(window).keypress((e) => {
  if (e.which === 13) {
    let action = {}
    action.runTime = {"phase": 5, "impulse": 3}    
    action.setTime = {"phase": 2, "impulse": 3}
    action.message = 'Reloading Uzi'
    action.function = 'reload'
    action.parameters = ['doo', 'dah']
    action.setBy = 'tFZn6Q7yIaSHwcOiCyNV3NlZERj2'
    action.characterPath = 'users/tFZn6Q7yIaSHwcOiCyNV3NlZERj2/games/-LVymInNe…FZE5Kz6Ba/content/characters/-LVynbcLBx3I71LXFiIt'
    action.gameId = 'tFZn6Q7yIaSHwcOiCyNV3NlZERj2/games/-LVymInNePcFZE5Kz6Ba'
    action.userList = ['tFZn6Q7yIaSHwcOiCyNV3NlZERj2']
  Timer.add(action)
  //console.log(added)

  //Timer.run('tFZn6Q7yIaSHwcOiCyNV3NlZERj2/games/-LVymInNePcFZE5Kz6Ba')  
  }
})