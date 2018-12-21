import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export function addNew(user) {
  let date = new Date()
  let ref = firebase.database().ref("userIds")
  ref.once("value").then(snapshot => {
    if (snapshot.hasChild(user.uid) === false) {
      firebase.database().ref("users/" + user.uid).set({
          name: user.displayName,
          email: user.email,
          created: date.getTime()
        })
      firebase.database().ref("userIds/" + user.uid).set(user.displayName)
    }
  })
}

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
    let guy = {}    
    guy.userId = character.user 
    guy.characterId = _.findKey(characters, o => { return o.name === character.name })
    guy.characterName = character.name
    guy.userName = users[character.user]
    guy.gameId = game.metadata.gameId
    list.push(guy)
  })

  return list
}

export function getCharacterSheet(user, game) {
  let userCharacters = getUserCharacters(game)
  let character = _.find(userCharacters, player => {return player.userId === user.uid})
  return character
}

export async function ids() {
  let userids = firebase.database().ref('userIds/IgwAYKuzhIPMkhcrNIuO23GE5yr2').once('value')
  let value = await Promise.all([userids])
  let uid = value[0].val()
  return uid
}