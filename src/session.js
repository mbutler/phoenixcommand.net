import firebase from 'firebase/app'
import 'firebase/database'
import * as Game from './game'
import * as User from './user'
import * as Utils from './utils'

export function init(user) {
  let page = location.href.split('/').slice(-1)
  page = _.split(page, '?c=')

  if (page[0] === 'game.html') {
    displayGame(user)
  }

  if (page[0] === 'character.html') {
    let characterName = _.replace(page[1], '%20', ' ')
    displayCharacterSheet(user, characterName)
  }

  if (page[0] === 'newcharacter.html') {
    displayNewCharacter(user)
  }
}

function displayGame(user) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref('users/' + gameId)
      gameRef.on('value', data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)      

        _.forEach(User.getUserCharacters(game), player => {
          let link = ''                  
          if (user.uid === player.userId) {
            link = `<a href='character.html?c=${player.characterName}'>${player.characterName}</a>`
          } else {
            link = `${player.characterName}`
          }
          $('#user-table tbody').append(`<tr><td>${link}</td><td>${player.userName}</td></tr>`)
        })
      })
  })
}

function displayCharacterSheet(user, characterName) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref('users/' + gameId)
      gameRef.on('value', data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)        
        let character = User.getCharacterSheet(game, characterName)
        $('#character-name').append(`<h3><strong>${character.characterName}</strong></h3>`)
        $('#strength').append(character.strength)
        $('#intelligence').append(character.intelligence)
        $('#agility').append(character.agility)
        $('#will').append(character.will)
        $('#health').append(character.health)
        $('#movement').append(character.speed)
        $('#physical-damage').append(character.pd)
        $('#total-damage').append(character.td)
        $('#status').append(character.status)
        $('#cover').append(character.cover)
        $('#position').append(character.position)
        $('#impulse1').append(character.capi['1'])
        $('#impulse2').append(character.capi['2'])
        $('#impulse3').append(character.capi['3'])
        $('#impulse4').append(character.capi['4'])
        $('#knockout-value').append(character.kv)
        $('#disabling-injuries').attr('data-content', character.injuries)

        if (character.stance === true) {
          $('#stance').append('True')
        } else {
          $('#stance').append('False')
        }
        $('#weapons').append(character.weapons[0])

        console.log(Utils.getWeapons(character.weapons))
      })
  })
}

function displayNewCharacter(user) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref('users/' + gameId)
      gameRef.on('value', data => {
        let game = data.val()
        $('.game-title').append(`<a href='game.html'>${game.metadata.title}</a>`)
      })
  })
}

