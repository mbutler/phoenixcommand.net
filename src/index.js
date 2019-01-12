import * as Database from './database'
import * as _ from 'lodash'
import * as Utils from './utils'
import * as Game from './game'
import * as User from './user'
import * as Character from './character'
import * as Calc from './calc'
import './listeners'

Database.auth().onAuthStateChanged(user => {
  if (user) {
    window.localStorage.setItem('firebird-command-user-id', user.uid)
    User.addNew(user)
    Game.navList(user)
    route(user)
  } else {
    window.localStorage.setItem('firebird-command-user-id', '')
    Utils.clearUserDisplay()
  }

  Utils.toggleSignInLink(user)
})

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
}
