/**
 * This module is the application entry point
 * @module Index
 * @namespace
 */

import * as Database from './database'
import * as _ from 'lodash'
import * as Utils from './utils'
import * as Game from './game'
import * as User from './user'
import * as Character from './character'
import * as Calc from './calc'
import * as Timer from './timer'
import * as pf from 'phoenix-functions'
import './listeners'

Database.auth().onAuthStateChanged(user => {
  if (user) {
    window.localStorage.setItem('phoenix-command-user-id', user.uid)
    User.addNew(user)
    Game.navList(user)
    route(user)
  } else {
    window.localStorage.setItem('phoenix-command-user-id', '')
    Utils.clearUserDisplay()
  }

  Utils.toggleSignInLink(user)
})

/**
 * Runs the entry point function based on html file
 *
 * @param {object} user - A Firebase auth user
 * @memberof Index
 * @return {undefined} - Runs the appropriate function
 */
function route(user) {
  let page = location.href.split('/').slice(-1)
  page = _.split(page, '?c=')
  let file = page[0]

  if (file === 'game.html') {
    Game.displayGame(user)
  }

  if (file === 'character.html') {
    let characterName = page[1].replace(/%20/g, ' ')
    Character.displayCharacterSheet(characterName)
  }

  if (file === 'newcharacter.html') {
    Character.displayCharacterCreation(user)
  }

  if (file === 'calculator.html') {
    Calc.setUser(user)
  }

  if (file === 'account.html') {
    Utils.displayAccount(user)
  }

  if (file === 'timer.html') {
    Timer.setUser(user)
  }

  if (file === 'log.html') {
    Utils.displayLog(user)
  }

  if (file === 'actions.html') {
    Utils.displaySetActions(user)
  }

  if (file === 'clock.html') {
    Timer.clock(user)
  }
}

window.pfTables = pf.getAllTables()
window.pfWeapons = pf.getAllWeapons()
