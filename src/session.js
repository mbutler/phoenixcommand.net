import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import * as Game from './game'
import * as User from './user'

export function init(user) {
  let page = location.href.split("/").slice(-1)
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
  let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
  ref.on("value", snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref("users/" + gameId)
      gameRef.on("value", data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)      

        _.forEach(User.getUserCharacters(game), player => {
          let link = ''                  
          if (user.uid === player.userId) {
            link = `<a href="character.html?c=${player.characterName}">${player.characterName}</a>`
          } else {
            link = `${player.characterName}`
          }
          $('#user-table tbody').append(`<tr><td>${link}</td><td>${player.userName}</td></tr>`)
        })
      })
  })
}

function displayCharacterSheet(user, characterName) {
  let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
  ref.on("value", snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref("users/" + gameId)
      gameRef.on("value", data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)        
        let character = User.getCharacterSheet(game, characterName)
        console.log(character)
        $('#character-name').append(`<h2>${character.characterName}</h2>`)
      })
  })
}

function displayNewCharacter(user) {
  let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
  ref.on("value", snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref("users/" + gameId)
      gameRef.on("value", data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)
      })
  })
}

