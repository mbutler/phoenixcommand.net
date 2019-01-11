import firebase from 'firebase/app'
import 'firebase/database'

export async function user(userId) {
    if (userId === undefined) {
        userId = window.localStorage.getItem('firebird-command-user-id')
    }
    let user = firebase.database().ref('users/' + userId).once('value')
    let value = await Promise.all([user])
    return value[0].val()
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