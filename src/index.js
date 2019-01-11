import * as Database from './database'
import * as _ from 'lodash'
import * as pf from 'phoenix-functions'
import * as Utils from './utils'
import * as Game from './game'
import * as User from './user'
import * as Character from './character'
import * as Calc from './calc'
import './listeners'

//expose to window for use in Game.displayGame() onClicks... for now
window.selectGame = Game.select

Database.auth().onAuthStateChanged(user => {
  if (user) {
    window.localStorage.setItem('firebird-command-user-id', user.uid)
    $('#signin').hide()
    $('#signout').show()
    User.addNew(user)
    
    Utils.displayAccount(user)
    Game.navList(user)
    route(user)
  } else {
    window.localStorage.setItem('firebird-command-user-id', '')
    $('#signout').hide()
    $('#signin').show()
    Utils.clearUserDisplay()
    console.log('User logged out.')
  }
})

function route(user) {
  let page = location.href.split('/').slice(-1)
  page = _.split(page, '?c=')

  if (page[0] === 'game.html') {
    Game.displayGame(user)
  }

  if (page[0] === 'character.html') {
    let characterName = page[1].replace(/%20/g, ' ')
    Character.displayCharacterSheet(characterName)
  }

  if (page[0] === 'newcharacter.html') {
    Character.displayNewCharacter(user)
  }

  if (page[0] === 'calculator.html') {
    Calc.setUser(user)
  }
}
