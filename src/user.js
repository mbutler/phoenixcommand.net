/**
 * This module handles user functionality
 * @module User
 * @namespace
 */

import * as Database from './database'

/**
 * Adds a new user to the database and sets localStorage 'phoenix-command-user-id'
 *
 * @param {object} user - A Firebase auth user
 * @memberof User
 * @return {undefined} - Modifies the database and localstorage
 */
export function addNew(user) {
  let date = new Date()
  let ref = Database.ref('userIds')
  ref.once('value').then(snapshot => {
    if (snapshot.hasChild(user.uid) === false) {
      Database.ref('users/' + user.uid).set({
        name: user.displayName,
        email: user.email,
        created: date.getTime()
      })
      Database.set('userIds/' + user.uid, user.displayName)
      window.localStorage.setItem('phoenix-command-user-id', user.uid)
    }
  })
}

/**
 * Gets a list of all character objects belonging to a user
 *
 * @param {object} game - An entire game object
 * @memberof User
 * @return {array} - A list of user's characters
 */
export function getUserCharacters(game) {
  let list = []
  let users = game.users
  let characters = game.content.characters
  let characterIdList = []
  _.forEach(characters, c => {characterIdList.push(c.user)})
  _.forEach(users, u => {
    let userId = _.findKey(users, o => { return o === u })
    if (_.includes(characterIdList, userId ) === false) {
      let guy = {}    
      guy.userId = userId
      guy.characterId = ''
      guy.characterName = '[empty slot]'
      guy.userName = users[userId]
      guy.gameId = game.metadata.gameId
      list.push(guy)
    }
  })

  _.forEach(characters, character => {
      let guy = character    
      guy.userId = character.user 
      guy.characterId = _.findKey(characters, o => { return o.name === character.name })
      guy.characterName = character.name
      guy.userName = users[character.user]
      guy.gameId = game.metadata.gameId
      list.push(guy)
  })

  return list
}

/**
 * Gets a character object by name
 *
 * @param {object} game - An entire game object
 * @param {string} characterName - The character's game name
 * @memberof User
 * @return {object} - A character object
 */
export function getCharacterSheet(game, characterName) {
  let userCharacters = getUserCharacters(game)
  let character = _.find(userCharacters, player => {return player.name === characterName})
  return character
}

/**
 * Gets a character object ID
 *
 * @param {object} game - An entire game object
 * @param {string} characterName - The character's game name
 * @memberof User
 * @return {string} - ID for a character object
 */
export function getCharacterId(game, characterName) {
  let userCharacters = getUserCharacters(game)
  let character = _.find(userCharacters, player => {return player.name === characterName})
  return character.characterId
}