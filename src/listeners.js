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

$('#login').on('click', '#signout', e => {
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
  let weapon= pf.getWeaponByName(result)
  if (weapon.Type === 'Explosive') { $('#target-size').val(6)}
  Utils.setShotType(weapon)
  $(`#weapon-button .dropdown-toggle`).empty().append(result)
  let snap = Database.currentCharacter()
  snap.then(character => {
    $('#ammo-type').val(character['ammo'][result]['type'])
  })  
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
        $('#calc-sal').val(player.sal)
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

$("#timer-character-name").on('click', '.dropdown-timer', e => {
  $('#timer-character-name .dropdown-toggle').empty()
  e.preventDefault()
  let targetId = $(e.target.parentElement.parentElement).attr('id')
  let result = e.target.innerText
  $(`#${targetId} .dropdown-toggle`).empty().append(result)
  let snap = Database.currentGame()
  snap.then(game => {
    _.forEach(game.content.characters, player => {                
      if (player.name === result) {
        window.localStorage.setItem('firebird-command-current-character', 'users/' + game.metadata.gameId + '/content/characters/' + User.getCharacterId(game, result))
        $('#impulse1').html(player.capi['1'])
        $('#impulse2').html(player.capi['2'])
        $('#impulse3').html(player.capi['3'])
        $('#impulse4').html(player.capi['4'])
      }
    })
  })   
})

$('#timer-combat-action-button').click(e => {
  if ($('#timer-character-name .dropdown-toggle').html() !== "Import Character") {
    e.preventDefault()  
    let capi = {}
    capi['1'] = _.toNumber($('#impulse1').html())
    capi['2'] = _.toNumber($('#impulse2').html())
    capi['3'] = _.toNumber($('#impulse3').html())
    capi['4'] = _.toNumber($('#impulse4').html())
    let msg = $('#timer-combat-action-message').val()
    let ca  = _.toNumber($('#timer-combat-actions').val())
  
    let snap = Database.currentGame()
    snap.then(game => {    
      let action = Timer.actionTemplate()
      action.runTime = pf.calculateActionTime(ca, capi, game.content.time, 0)   
      action.setTime = game.content.time
      action.gameId = game.metadata.gameId
      action.message = msg
      action.function = ''
      action.parameters = []
      action.userList = []
      Timer.add(action)
      if (ca > capi[game.content.time.impulse]) {
        Utils.modal('Phoenix Command', `Timer set for Phase: ${action.runTime.time.phase}, Impulse: ${action.runTime.time.impulse}`)
      }      
      Timer.run(game.metadata.gameId)
    })
  } else {
    Utils.modal("Phoenix Command", "Please Import a character")
  }
})

$('#timer-time-button').click(e => {
  e.preventDefault()  
  let msg = $('#timer-time-message').val()
  let phase = $('#timer-phase-input').val()
  phase = _.toNumber(phase)
  let impulse = $('#timer-impulse-input').val()
  impulse = _.toNumber(impulse)
  let snap = Database.currentGame()
  snap.then(game => {    
    let action = Timer.actionTemplate()
    action.runTime = {time: {"phase": phase, "impulse": impulse}, "remainder": 0}   
    action.setTime = game.content.time
    action.gameId = game.metadata.gameId
    action.message = msg
    Timer.add(action)
    Utils.modal('Phoenix Command', `Timer set for Phase: ${phase}, Impulse: ${impulse}`)
    Timer.run(game.metadata.gameId)
  })
})

$('#timer-impulse-input').change(e => {
  let impulse = $('#timer-impulse-input').val()
  impulse = _.toNumber(impulse)
  impulse = _.clamp(impulse, 1, 4)
  $('#timer-impulse-input').val(impulse)
})

$('#timer-duration-button').click(e => {
  e.preventDefault()  
  let msg = $('#timer-duration-message').val()
  let phases = $('#timer-duration-phases').val()
  phases = _.toNumber(phases)
  let snap = Database.currentGame()
  snap.then(game => { 
    let futurePhase = game.content.time.phase + phases
    let impulse = game.content.time.impulse
    let action = Timer.actionTemplate()
    action.runTime = {time: {"phase": futurePhase, "impulse": impulse}, "remainder": 0}   
    action.setTime = game.content.time
    action.gameId = game.metadata.gameId
    action.message = msg
    Timer.add(action)
    Utils.modal('Phoenix Command', `Timer set for Phase: ${futurePhase}, Impulse: ${impulse}`)
  })
})

$('#timer-duration-incapacitation-time').change(e => {
  let incapTime = $('#timer-duration-incapacitation-time').val()
  let convertedPhases = pf.incapacitationTimeToPhases(incapTime)
  convertedPhases = _.toNumber(convertedPhases)
  $('#timer-duration-phases').val(convertedPhases)
})

$('.actions-set-timer').click(e => {
  e.preventDefault()
  let msg = $(e.currentTarget).parent().parent().children().eq(1).html()
  let ca = _.toNumber(e.currentTarget.innerText)
  let path = window.localStorage.getItem('firebird-command-current-character')
  let ref = Database.currentCharacter(path)
  ref.then(character => {
    let capi = {}
    capi['1'] = _.toNumber(character.capi[1])
    capi['2'] = _.toNumber(character.capi[2])
    capi['3'] = _.toNumber(character.capi[3])
    capi['4'] = _.toNumber(character.capi[4])

    let snap = Database.currentGame()
    snap.then(game => {    
      let action = Timer.actionTemplate()
      action.runTime = pf.calculateActionTime(ca, capi, game.content.time, 0)   
      action.setTime = game.content.time
      action.gameId = game.metadata.gameId
      action.message = msg
      Timer.add(action)
      if (ca > capi[game.content.time.impulse]) {
        Utils.modal('Phoenix Command', `Timer set for Phase: ${action.runTime.time.phase}, Impulse: ${action.runTime.time.impulse}`)
      }      
      Timer.run(game.metadata.gameId)
    })
  })
})

//testing
$(window).keypress((e) => {
  if (e.which === 13) {

  //Timer.actionTemplate()
  //console.log(added)

  //Timer.run('tFZn6Q7yIaSHwcOiCyNV3NlZERj2/games/-LVymInNePcFZE5Kz6Ba')  
  }
})