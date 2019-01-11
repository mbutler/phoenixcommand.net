import firebase from 'firebase/app'
import 'firebase/database'
import * as pf from 'phoenix-functions'
import * as database from './database'

export function run() {
    console.log('timer running...')
}

export function add() {
    let userId = window.localStorage.getItem('firebird-command-user-id')
    let ref = firebase.database().ref()
}