import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export function list(user) {
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

  _.forEach(playerList, player => {
      let person = _.trim(player)
      firebase.database().ref("users/" + user.uid + "/games/" + gameId + "/users/" + person).set(true)
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
      "created by": user.displayName
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
  firebase.database().ref("users/" + user.uid + "/games/" + gameId + "/users/" + user.uid).set(true)
  firebase.database().ref("users/" + user.uid + "/adminOf/" + gameId).set(gameName)
  addPlayers(user, gameId, players)

  if (gameId) {
    $("#newgameModal").modal()
  }
}

//doesn't work because of callback
function getCurrent(user) {
  let gameId
  let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
  ref.on("value", snapshot => {
      gameId = snapshot.val()
      console.log(gameId)
  })
  return gameId
}

function setCurrent(uid, gameId) {
  firebase.database().ref("users/" + uid + "/currentGame/").set(gameId)
}

export function select(uid, gameId) {
  setCurrent(uid, gameId)
  window.location.href = "game.html"
}