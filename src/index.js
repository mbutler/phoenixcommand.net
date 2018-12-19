import * as firebase from "firebase"
import * as firebaseui from "firebaseui"
import * as _ from "lodash"
import * as pf from "phoenix-functions"
import {codenames} from "./codenames"
import {mission} from "./operations"

let me

window.characterSubmit = characterSubmit
window.newGameSubmit = newGameSubmit
window.randomize = randomize
window.operationName = operationName
window.selectGame = selectGame

//don't reload the page when form is submitted
$(".submission-form").on("submit", e => {
  e.preventDefault()
})

let config = {
  apiKey: "AIzaSyBKxAP8VRE18XIqhkZlI6z3xbCgaPCwVc0",
  authDomain: "firebird-f30dc.firebaseapp.com",
  databaseURL: "https://firebird-f30dc.firebaseio.com",
  projectId: "firebird-f30dc",
  storageBucket: "firebird-f30dc.appspot.com",
  messagingSenderId: "274623842874"
}

firebase.initializeApp(config)

// FirebaseUI config.
let uiConfig = {
  signInSuccessUrl: window.location.href,
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
}

// Initialize the FirebaseUI Widget using Firebase.
let ui = new firebaseui.auth.AuthUI(firebase.auth())

// The start method will wait until the DOM is loaded.
ui.start("#firebaseui-auth-container", uiConfig)

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    me = user
    $("#signin").hide()
    $("#signout").show()
    addNewUser(user)
    displayAccount(user)
    gameList(user)
  } else {
    $("#signout").hide()
    $("#signin").show()
    clearUserDisplay()
    console.log("User logged out.")
  }
})

function selectGame(gameId) {
    setCurrentGame(me, gameId)
    window.location.href = "game.html"
}

function addNewUser(user) {
  let date = new Date()
  let ref = firebase.database().ref("userIds")
  ref.once("value").then(snapshot => {
    if (snapshot.hasChild(user.uid) === false) {
      firebase.database().ref("users/" + user.uid).set({
          name: user.displayName,
          email: user.email,
          created: date.getTime()
        })
      firebase.database().ref("userIds/" + user.uid).set(true)
    }
  })
}

function addPlayersToGame(user, gameId, players) {
    let playerList = _.split(players, ',')
    let ref = firebase.database().ref("userIds")

    _.forEach(playerList, player => {
        let person = _.trim(player)
        firebase.database().ref("users/" + user.uid + "/games/" + gameId + "/users/" + person).set(true)
    })
}

function createNewGame(user, gameName, players) {
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
  addPlayersToGame(user, gameId, players)

  if (gameId) {
    $("#newgameModal").modal()
  }
}

function setCurrentGame(user, gameId) {
    firebase.database().ref("users/" + user.uid + "/currentGame/").set(gameId)
}

function getCurrentGame(user) {
    let gameId
    let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
    ref.on("value", snapshot => {
        gameId = snapshot.val()
        console.log(gameId)
    })
    return gameId
}

function gameList(user) {
  let adminQuery = firebase.database().ref("users/" + user.uid + "/adminOf").orderByKey()
  let memberQuery = firebase.database().ref("users/" + user.uid + "/memberOf").orderByKey()

  adminQuery.once("value").then(snapshot => {
    snapshot.forEach(childSnapshot => {
      let gameId = childSnapshot.key
      let game = childSnapshot.val()
      $("#game-dropdown").append(`<a class="dropdown-item" href="#" onclick="selectGame('${gameId}')">${game}</a>`)
    })
  })

  memberQuery.once("value").then(snapshot => {
    $("#game-dropdown").append(`<div class="dropdown-divider"></div>`)
    snapshot.forEach(childSnapshot => {
      let gameId = childSnapshot.key
      let game = childSnapshot.val()
      $("#game-dropdown").append(`<a class="dropdown-item" href="#" onclick="selectGame('${gameId}')">${game}</a>`)
    })
  })
}

function displayAccount(user) {
  $("#account-name").text(user.displayName)
  $("#account-id").text(user.uid)
  $("#account-email").text(user.email)
}

function clearUserDisplay() {
  $("#game-dropdown").empty()
  $("#account-name").text('Account Name')
  $("#account-id").empty()
  $("#account-email").empty()
}

$("#signout").on("mousedown touchstart", () => {
  firebase.auth().signOut().then(() => {
      $("#signoutModal").modal()
      clearUserDisplay()
      me = undefined
    }).catch(error => {
      console.log("Sign out error.")
    })
})

function selectedCheckboxes(boxes) {
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

function randomize() {
  let name = _.sample(codenames)
  let skill = _.random(1, 6)
  $("#skill-level").val(skill)
  $("#codename").val(name)
  let str = threeD6()
  $("#strength").val(str)
  let int = threeD6()
  $("#intelligence").val(int)
  let will = threeD6()
  $("#will").val(will)
  let health = threeD6()
  $("#health").val(health)
  let agi = threeD6()
  $("#agility").val(agi)
}

function operationName() {
  $("#gamename").val(mission())
}

function characterSubmit() {
  let codename = $("#codename").val()
  let skillLevel = _.clamp(_.toNumber($("#skill-level").val()), 3, 18)
  let strength = _.clamp(_.toNumber($("#strength").val()), 3, 18)
  let intelligence = _.clamp(_.toNumber($("#intelligence").val()), 3, 18)
  let will = _.clamp(_.toNumber($("#will").val()), 3, 18)
  let health = _.clamp(_.toNumber($("#health").val()), 3, 18)
  let agility = _.clamp(_.toNumber($("#agility").val()), 3, 18)
  let armor = $("#armor").val()
  let weapons = selectedCheckboxes($('[name="weapon"]'))
  let equipment = selectedCheckboxes($('[name="equipment"]'))
  equipment.push(armor)
  let encumbrance = pf.encumbranceCalculator(equipment, weapons)
  let kv = pf.knockoutValue(will, skillLevel)
  let speed = pf.movementSpeed(strength, agility, encumbrance)
  let capi = pf.combatActionsPerImpulse(
    strength,
    agility,
    intelligence,
    skillLevel,
    encumbrance
  )

  console.log(capi)
}

function newGameSubmit() {
  let name = $("#gamename").val()
  let players = $("#invite-players").val()

  if (me) {
    createNewGame(me, name, players)
  } else {
    $("#signinModal").modal()
  }
}
