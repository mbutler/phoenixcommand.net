import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import * as User from './user'

export function navList(user) {
  let adminQuery = firebase.database().ref("users/" + user.uid + "/adminOf").orderByKey()
  let memberQuery = firebase.database().ref("users/" + user.uid + "/memberOf").orderByKey()

  adminQuery.once("value").then(snapshot => {
    snapshot.forEach(childSnapshot => {
      let gameId = childSnapshot.key
      let game = childSnapshot.val()
      $("#game-dropdown").append(`<a class="dropdown-item" href="#" onclick="selectGame('${user.uid}', '${gameId}')">${game}</a>`)
    })
  })

  memberQuery.once("value").then(snapshot => {
    $("#game-dropdown").append(`<div class="dropdown-divider"></div>`)
    snapshot.forEach(childSnapshot => {
      let gameId = childSnapshot.key
      let game = childSnapshot.val()
      $("#game-dropdown").append(`<a class="dropdown-item" href="#" onclick="selectGame('${user.uid}', '${gameId}')">${game}</a>`)
    })
  })
}

function addPlayers(user, gameId, players) {
  let playerList = _.split(players, ',')
  let ref = firebase.database().ref("userIds")
  ref.once("value").then(snapshot => {
    let users = snapshot.val()
    _.forEach(playerList, player => {
      let person = _.trim(player)
      if (snapshot.hasChild(person) === true) {
        firebase.database().ref("users/" + user.uid + "/games/" + gameId + "/users/" + person).set(users[person])
      } else {
        alert("No user " + person)
      }
    })
    window.location.href = "game.html"   
  })
}

export function addCharacter(user, character) {
  let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
  ref.on("value", snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref("users/" + user.uid + "/games/" + gameId)
      gameRef.on("value", data => {
        let game = data.val()
        firebase.database().ref("users/" + user.uid + "/games/" + gameId + "/content/characters").push(users[person])
      })
  })
}

export function createNew(user, gameName, players) {
  let date = new Date()
  let ref = firebase.database().ref("users/" + user.uid + "/games")
  let gameId, newRef
  let newGame = {
    metadata: {
      title: gameName,
      created: date.getTime(),
      createdby: user.displayName
    },
    users: {},
    content: {
      characters: {},
      time: {phase: 1, impulse: 1},
      messages: {}
    }
  }
  newRef = ref.push(newGame)
  gameId = newRef.key
  setCurrent(user.uid, gameId)
  addPlayers(user, gameId, players)
  firebase.database().ref("users/" + user.uid + "/games/" + gameId + "/metadata/gameId/").set(gameId)
  firebase.database().ref("users/" + user.uid + "/games/" + gameId + "/users/" + user.uid).set(user.displayName)
  firebase.database().ref("users/" + user.uid + "/adminOf/" + gameId).set(gameName)
}

export async function getCurrent(user) {
  let currentGame = firebase.database().ref("users/" + user.uid + "/currentGame").once('value')
  let value = await Promise.all([currentGame])
  let gameId = value[0].val()
  return gameId
}

//Game.all(user, '-LU8-PVRfdNiufs0kDOC').then(game => {console.log(game)})
export async function all(user, gameId) {
  let gameRef = firebase.database().ref("users/" + user.uid + "/games/" + gameId).once('value')
  let value = await Promise.all([gameRef])
  let game = value[0].val()
  return game
}

function setCurrent(uid, gameId) {
  firebase.database().ref("users/" + uid + "/currentGame/").set(gameId)
}

export function select(uid, gameId) {
  setCurrent(uid, gameId)
  window.location.href = "game.html"
}