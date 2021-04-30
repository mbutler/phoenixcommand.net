/**
 * This module handles various database functionality
 * @module Database
 * @namespace
 */

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseui from 'firebaseui'
import { config } from './config'

firebase.initializeApp(config)

const uiConfig = {
  signInSuccessUrl: window.location.href,
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
}

const ui = new firebaseui.auth.AuthUI(firebase.auth())
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig)

/**
 * async. Gets a user by Firebase user id, either passed in or from localstorage
 *
 * @param {string} userId - A Firebase user id 
 * @memberof Database
 * @return {object} - Firebase user object
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
 * async. Gets a game by Firebase user id, either passed in or from localstorage
 *
 * @param {string} userId - A Firebase user id 
 * @memberof Database
 * @return {object} - Firebase game object
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
 * async. Gets a game's actionList and game time by Firebase game id
 *
 * @param {string} userId - A Firebase user id
 * @memberof Database
 * @return {object} - Firebase actionList object with game time attached
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
 * async. Gets a user's currently selected character
 *
 * @param {string} characterPath - Path to the character in the format of "users/{userid}/games/{gameid}/content/characters/{characterid}"
 * @memberof Database
 * @return {object} - Firebase character object
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
 * Gets a database reference
 *
 * @param {string} path - Path to the resource
 * @memberof Database
 * @return {object} - Firebase database reference
 */
export function ref(path) {
    return firebase.database().ref(path)
}

/**
 * Sets a database reference
 *
 * @param {string} path - Path to the resource
 * @param {any} value - Value to set
 * @memberof Database
 * @return {undefined} - Modifies the database
 */
export function set(path, value) {
    firebase.database().ref(path).set(value)
}

/**
 * Pushes a value to a database location
 *
 * @param {string} path - Path to the resource
 * @param {any} value - Value to set
 * @memberof Database
 * @return {undefined} - Modifies the database
 */
export function push(path, value) {
    firebase.database().ref(path).push(value)
}

/**
 * Deletes a value in the database
 *
 * @param {string} path - Path to the resource
 * @param {string} key - Key of the resource
 * @memberof Database
 * @return {undefined} - Modifies the database
 */
export function remove(path, key) {
    let ref = firebase.database().ref(path + key)
    ref.remove()
}

/**
 * Gets a reference to Firebase auth
 *
 * @memberof Database
 * @return {object} - Firebase auth object
 */
export function auth() {
    let auth = firebase.auth()
    return auth
}