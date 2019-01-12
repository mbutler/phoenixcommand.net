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

export async function user(userId) {
    if (userId === undefined) {
        userId = window.localStorage.getItem('firebird-command-user-id')
    }
    let userRef = firebase.database().ref('users/' + userId).once('value')
    let user = await Promise.all([userRef])
    return user[0].val()
}

export async function currentGame(userId) {
    if (userId === undefined) {
        userId = window.localStorage.getItem('firebird-command-user-id')
    }
    let userRef = firebase.database().ref('users/' + userId).once('value')
    let user = await Promise.all([userRef])
    let currentGamePath = user[0].val().currentGame
    let currentGameRef = firebase.database().ref('users/' + currentGamePath).once('value')
    let currentGame = await Promise.all([currentGameRef])
    return currentGame[0].val()
}

export async function currentCharacter(characterPath) {
    if (characterPath === undefined) {
        characterPath = window.localStorage.getItem('firebird-command-current-character')
    }
    let characterRef = firebase.database().ref(characterPath).once('value')
    let character = await Promise.all([characterRef])
    return character[0].val()
}

export async function weapons() {
    let weaponRef = firebase.database().ref('weapons').once('value')
    let weapons = await Promise.all([weaponRef])
    return weapons[0].val()
}

export function ref(path) {
    return firebase.database().ref(path)
}

export function set(path, value) {
    firebase.database().ref(path).set(value)
}

export function push(path, value) {
    firebase.database().ref(path).push(value)
}

export function auth() {
    let auth = firebase.auth()
    return auth
}