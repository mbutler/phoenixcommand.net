import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseui from 'firebaseui'
import * as _ from 'lodash'
import * as pf from 'phoenix-functions'
import * as Utils from './utils'
import * as Game from './game'
import * as User from './user'
import * as Session from './session'

let me

//expose onClick functions to the window object
window.characterSubmit = characterSubmit
window.newGameSubmit = newGameSubmit
window.randomize = Utils.randomize
window.operationName = Utils.operationName
window.selectGame = Game.select

function characterSubmit() {
  let c = {}
  let name = $('#codename').val()
  let skillLevel = _.clamp(_.toNumber($('#skill-level').val()), 3, 18)
  let strength = _.clamp(_.toNumber($('#strength').val()), 3, 18)
  let intelligence = _.clamp(_.toNumber($('#intelligence').val()), 3, 18)
  let will = _.clamp(_.toNumber($('#will').val()), 3, 18)
  let health = _.clamp(_.toNumber($('#health').val()), 3, 18)
  let agility = _.clamp(_.toNumber($('#agility').val()), 3, 18)
  let armor = $('#armor').val()
  let weapons = Utils.selectedCheckboxes($('[name="weapon"]'))
  let equipment = Utils.selectedCheckboxes($('[name="equipment"]'))
  equipment.push(armor)
  let sal = pf.skillAccuracyLevel(skillLevel)
  let encumbrance = pf.encumbranceCalculator(equipment, weapons)
  let kv = pf.knockoutValue(will, skillLevel)
  let speed = pf.movementSpeed(strength, agility, encumbrance)
  let capi = pf.combatActionsPerImpulse(strength, agility, intelligence, skillLevel, encumbrance)

  c.name = name, c.skillLevel = skillLevel, c.strength = strength, c.intelligence = intelligence, c.will = will, c.health = health, c.agility = agility
  c.armor = armor, c.equipment = equipment, c.weapons = weapons, c.encumbrance = encumbrance, c.sal = sal, c.kv = kv, c.speed = speed, c.capi = capi

  c.pd = 0 //physical damage
  c.td = 0 //total damage
  c.status = 'Alive'
  c.injuries = 'None'
  c.cover = 'Standing Exposed' //table 4E positions
  c.position = 'Standing' //4B - Standing, Standing & Braced, Kneeling, Kneeling & Braced, Prone, Prone & Braced
  c.stance = false
  c.actions = {}

  c.user = me.uid

  Game.addCharacter(me, c)
}
  
function newGameSubmit() {
  let name = $('#gamename').val()
  let players = $('#invite-players').val()

  if (me) {
      Game.createNew(me, name, players)
  } else {
      $('#signinModal').modal()
  }
}

let config = {
  apiKey: 'AIzaSyBKxAP8VRE18XIqhkZlI6z3xbCgaPCwVc0',
  authDomain: 'firebird-f30dc.firebaseapp.com',
  databaseURL: 'https://firebird-f30dc.firebaseio.com',
  projectId: 'firebird-f30dc',
  storageBucket: 'firebird-f30dc.appspot.com',
  messagingSenderId: '274623842874'
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
ui.start('#firebaseui-auth-container', uiConfig)

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    me = user
    $('#signin').hide()
    $('#signout').show()
    User.addNew(user)
    Utils.displayAccount(user)
    Game.navList(user)
    Session.init(user)
  } else {
    $('#signout').hide()
    $('#signin').show()
    Utils.clearUserDisplay()
    console.log('User logged out.')
  }
})

$('#signout').on('mousedown touchstart', () => {
  firebase.auth().signOut().then(() => {
      $('#signoutModal').modal()
      Utils.clearUserDisplay()
      me = undefined
    }).catch(error => {
      console.log('Sign out error.')
    })
})

//don't reload the page when form is submitted
$('.submission-form').on('submit', e => {
    e.preventDefault()
})
