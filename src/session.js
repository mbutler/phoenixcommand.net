import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import * as Game from './game'

export function init(user) {
  let page = location.href.split("/").slice(-1)

  if (page[0] === 'game.html') {
    displayGame(user)
  }

  if (page[0] === 'character.html') {
    displayCharacterSheet(user)
  }
}

function displayGame(user) {
  let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
  ref.on("value", snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref("users/" + user.uid + "/games/" + gameId)
      gameRef.on("value", data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)      

        _.forEach(getUserCharacters(game), player => {
          let link = ''                  
          if (user.uid === player.userId) {
            link = `<a href="character.html">${player.characterName}</a>`
          } else {
            link = `${player.characterName}`
          }
          $('#user-table tbody').append(`<tr><td>${link}</td><td>${player.userName}</td></tr>`)
        })
      })
  })
}

function displayCharacterSheet(user) {
  let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
  ref.on("value", snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref("users/" + user.uid + "/games/" + gameId)
      gameRef.on("value", data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)        
        let character = getCharacterSheet(user, game)
        $('#character-name').append(`<h2>${character.characterName}</h2>`)
      })
  })
}

function getUserCharacters(game) {
  let list = []
  let users = game.users
  let characters = game.content.characters
  let characterIdList = []
  _.forEach(characters, c => {characterIdList.push(c.user)})
  _.forEach(users, u => {
    let userId = _.findKey(users, o => { return o === u })
    if (_.includes(characterIdList, userId ) === false) {
      let guy = {}    
      guy.userId = userId
      guy.characterId = ''
      guy.characterName = '[empty slot]'
      guy.userName = users[userId]
      guy.gameId = game.metadata.gameId
      list.push(guy)
    }
  })

  _.forEach(characters, character => {
    let guy = {}    
    guy.userId = character.user 
    guy.characterId = _.findKey(characters, o => { return o.name === character.name })
    guy.characterName = character.name
    guy.userName = users[character.user]
    guy.gameId = game.metadata.gameId
    list.push(guy)
  })

  return list
}

function getCharacterSheet(user, game) {
  let userCharacters = getUserCharacters(game)
  let character = _.find(userCharacters, player => {return player.userId === user.uid})
  return character
}