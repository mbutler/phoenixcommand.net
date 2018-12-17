import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'
import * as _ from 'lodash'
import * as pf from 'phoenix-functions'
import { codenames } from './codenames'
import { mission } from './operations'

let me

window.formSubmit = formSubmit
window.newGameSubmit = newGameSubmit
window.randomize = randomize
window.operationName = operationName
//don't reload the page when form is submitted
$('#character-form').on('submit', (e) => {
    e.preventDefault()
})

let config = {
    gameID: '-L6D8cz625nLzyargSEO',
    firebase: {
      apiKey: 'AIzaSyBKxAP8VRE18XIqhkZlI6z3xbCgaPCwVc0',
      authDomain: 'firebird-f30dc.firebaseapp.com',
      databaseURL: 'https://firebird-f30dc.firebaseio.com',
      projectId: 'firebird-f30dc',
      storageBucket: 'firebird-f30dc.appspot.com',
      messagingSenderId: '274623842874'
    }
  }

  firebase.initializeApp(config.firebase)

  // FirebaseUI config.
  let uiConfig = {
    signInSuccessUrl: window.location.href,
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  }

  function addNewUser(user) {
    let ref = firebase.database().ref("userIds")
    ref.once('value').then((snapshot) => {
        if (snapshot.hasChild(user.uid) === false) {
            firebase.database().ref("users/" + user.uid).set({name: user.displayName, email: user.email})
            firebase.database().ref("userIds/" + user.uid).set(true)
        }
    })
  }

  function createNewGame(user, gameName) {
      let date = Date()
      let ref = firebase.database().ref("users/" + user.uid + "/games")
      let gameId, newRef
      let newGame = {
          "metadata": {
              "title": gameName,
              "created": date,
              "created by": user.displayName
          },
          "users": {},
          "content": {
              "characters": {},
              "time": {"phase": 1, "impulse": 1},
              "messages": {}
          }
      }
    newRef = ref.push(newGame)
    gameId = newRef.key
    firebase.database().ref("users/" + user.uid + "/games/" + gameId + "/users/" + user.uid).set(true)
    if (gameId) {
        $('#newgameModal').modal()
    }
  }

  // Initialize the FirebaseUI Widget using Firebase.
  let ui = new firebaseui.auth.AuthUI(firebase.auth())
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig)

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        me = user
        $('#signin').hide()
        $('#signout').show()
        console.log(user)
        //addNewUser(user)
        //createNewGame(user, "test game")
    } else {
        $('#signout').hide()
        $('#signin').show()
        console.log('User logged out.')
    }
})

$('#signout').on('mousedown touchstart', () => {
    firebase.auth().signOut().then(() => {
        $('#signoutModal').modal()
        me = undefined
    }).catch((error) => {
        console.log('Sign out error.')
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

function operationName() {
    $('#gamename').val(mission())
}

function formSubmit() {
    let codename = $('#codename').val()
    let skillLevel = _.clamp(_.toNumber($('#skill-level').val()), 3, 18)
    let strength = _.clamp(_.toNumber($('#strength').val()), 3, 18)
    let intelligence = _.clamp(_.toNumber($('#intelligence').val()), 3, 18)
    let will = _.clamp(_.toNumber($('#will').val()), 3, 18)
    let health = _.clamp(_.toNumber($('#health').val()), 3, 18)
    let agility = _.clamp(_.toNumber($('#agility').val()), 3, 18)
    let armor = $('#armor').val()
    let weapons = selectedCheckboxes($('[name="weapon"]'))
    let equipment = selectedCheckboxes($('[name="equipment"]'))
    equipment.push(armor)
    let encumbrance = pf.encumbranceCalculator(equipment, weapons)
    let kv = pf.knockoutValue(will, skillLevel)
    let speed = pf.movementSpeed(strength, agility, encumbrance)
    let capi = pf.combatActionsPerImpulse(strength, agility, intelligence, skillLevel, encumbrance)

    console.log(capi)
}

function newGameSubmit() {
    let name = $('#gamename').val()
    if (me) {
        createNewGame(me, name)
    } else {
        $('#signinModal').modal()
    }
}

