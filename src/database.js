/**
 * This module handles various database functionality and Firebase authentication.
 * @module Database
 * @namespace
 */

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseui from 'firebaseui'
import { config } from './config'

/**
 * Initializes Firebase application with the given configuration.
 */
firebase.initializeApp(config)

/**
 * Firebase UI configuration for authentication.
 */
const uiConfig = {
  signInSuccessUrl: window.location.href,
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
}

/**
 * Initializes Firebase UI authentication.
 */
const ui = new firebaseui.auth.AuthUI(firebase.auth())
ui.start('#firebaseui-auth-container', uiConfig)

/**
 * Handles the Firebase authentication state change.
 */
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in:', user)
  } else {
    console.log('No user is signed in.')
  }
})

/**
 * Handles the result of the redirect authentication.
 */
firebase.auth().getRedirectResult().then((result) => {
  if (result.user) {
    console.log('User signed in:', result.user)
  }
}).catch((error) => {
  console.error('Error during sign-in:', error)
})

/**
 * Async function to get a user by Firebase user ID, either passed in or from local storage.
 *
 * @param {string} [userId] - A Firebase user ID
 * @memberof Database
 * @returns {Promise<object>} - Firebase user object
 */
export async function user(userId) {
  if (userId === undefined) {
    userId = window.localStorage.getItem('phoenix-command-user-id')
  }
  let userRef = firebase.database().ref('users/' + userId).once('value')
  let user = await Promise.all([userRef])
  return user[0].val()
}

/**
 * Async function to get a game by Firebase user ID, either passed in or from local storage.
 *
 * @param {string} [userId] - A Firebase user ID
 * @memberof Database
 * @returns {Promise<object>} - Firebase game object
 */
export async function currentGame(userId) {
  if (userId === undefined) {
    userId = window.localStorage.getItem('phoenix-command-user-id')
  }
  let userRef = firebase.database().ref('users/' + userId).once('value')
  let user = await Promise.all([userRef])
  let currentGamePath = user[0].val().currentGame
  let currentGameRef = firebase.database().ref('users/' + currentGamePath).once('value')
  let currentGame = await Promise.all([currentGameRef])
  return currentGame[0].val()
}

/**
 * Async function to get a game's action list and game time by Firebase game ID.
 *
 * @param {string} gameId - A Firebase game ID
 * @memberof Database
 * @returns {Promise<object>} - Firebase action list object with game time attached
 */
export async function actionList(gameId) {
  let result = {}
  let id = 'users/' + gameId
  let currentGameRef = firebase.database().ref(id).once('value')
  let game = await Promise.all([currentGameRef])
  result.list = game[0].val().content.actionList
  result.time = game[0].val().content.time
  return result
}

/**
 * Async function to get a user's currently selected character.
 *
 * @param {string} [characterPath] - Path to the character in the format of "users/{userid}/games/{gameid}/content/characters/{characterid}"
 * @memberof Database
 * @returns {Promise<object>} - Firebase character object
 */
export async function currentCharacter(characterPath) {
  if (characterPath === undefined) {
    characterPath = window.localStorage.getItem('phoenix-command-current-character')
  }
  let characterRef = firebase.database().ref(characterPath).once('value')
  let character = await Promise.all([characterRef])
  return character[0].val()
}

/**
 * Gets a database reference.
 *
 * @param {string} path - Path to the resource
 * @memberof Database
 * @returns {object} - Firebase database reference
 */
export function ref(path) {
  return firebase.database().ref(path)
}

/**
 * Sets a database reference.
 *
 * @param {string} path - Path to the resource
 * @param {any} value - Value to set
 * @memberof Database
 */
export function set(path, value) {
  firebase.database().ref(path).set(value)
}

/**
 * Pushes a value to a database location.
 *
 * @param {string} path - Path to the resource
 * @param {any} value - Value to set
 * @memberof Database
 */
export function push(path, value) {
  firebase.database().ref(path).push(value)
}

/**
 * Deletes a value in the database.
 *
 * @param {string} path - Path to the resource
 * @param {string} key - Key of the resource
 * @memberof Database
 */
export function remove(path, key) {
  let ref = firebase.database().ref(path + key)
  ref.remove()
}

/**
 * Gets a reference to Firebase auth.
 *
 * @memberof Database
 * @returns {object} - Firebase auth object
 */
export function auth() {
  let auth = firebase.auth()
  return auth
}
