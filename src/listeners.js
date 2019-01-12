import * as Utils from './utils'
import * as User from './user'
import * as Character from './character'
import * as Calc from './calc'
import * as Game from './game'
import * as Database from './database'

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
  $(`#weapon-button .dropdown-toggle`).empty().append(result)
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
      let dude = Database.currentCharacter()
      dude.then(data => {
        console.log(dude)
      })
  }
})