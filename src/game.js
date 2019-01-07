import firebase from 'firebase/app'
import 'firebase/database'
import * as Utils from './utils'
import * as User from './user'

export function displayGame(user) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
    let gameId = snapshot.val()
    let gameRef = firebase.database().ref('users/' + gameId)
    gameRef.on('value', data => {
      let game = data.val()
      let userReady = game.metadata.readyPlayers[user.uid]
      toggleUserReady(userReady)
      checkReadyPlayers(game.metadata.readyPlayers)
      $('#phase').empty().append(`<h4>Phase: <strong>${game.content.time.phase}</strong></h4>`)
      $('#impulse').empty().append(`<h4>Impulse: <strong>${game.content.time.impulse}</strong></h4>`)
      $('.game-title').text(game.metadata.title)      
      $('#user-table tbody').empty()
      _.forEach(User.getUserCharacters(game), player => {
        let link = ''                  
        if (user.uid === player.userId) {
          link = `<a href='character.html?c=${player.characterName}'>${player.characterName}</a>`
        } else {
          link = `${player.characterName}`
        }
        $('#user-table tbody').append(`<tr><td>${link}</td><td>${player.userName}</td></tr>`)
      })
      $('.timestamp').empty().append('created: '+moment.unix(game.metadata.created / 1000).format("MMMM Do, YYYY h:mm a"))               
    })
    $('#next-impulse-button').click(e => {
      let path = `users/${gameId}/metadata/readyPlayers/${user.uid}`
      if ($('#next-impulse-button').hasClass('btn-default')) {
        firebase.database().ref(path).set(true)
      } else if ($('#next-impulse-button').hasClass('btn-danger')) {
        firebase.database().ref(path).set(false)
      }
    })
  })
}

export function checkReadyPlayers(readyPlayers) {
  if (_.every(readyPlayers)) {
    console.log('time incremedn')
  } else {
    console.log('no way')
  }
}

function toggleUserReady(userReady) {
  if (userReady === undefined) {userReady = false}
  if (userReady === false) {
    $('#next-impulse-button').removeClass('btn-danger')
    $('#next-impulse-button').addClass('btn-default')
  }
  if (userReady === true) {
    $('#next-impulse-button').removeClass('btn-default')
    $('#next-impulse-button').addClass('btn-danger')
  }
}

export function navList(user) {
  let adminQuery = firebase.database().ref('users/' + user.uid + '/adminOf')
  let memberQuery = firebase.database().ref('users/' + user.uid + '/memberOf').orderByKey()

  adminQuery.once('value').then(snapshot => {
    snapshot.forEach(childSnapshot => {
      let game = childSnapshot.val()
      $('#game-dropdown').append(`<a class="dropdown-item" href="#" onclick="selectGame('${user.uid}', '${game.gameId}')">${game.name}</a>`)
    })
  })

  memberQuery.once('value').then(snapshot => {
    if (snapshot.val()) {
      $('#game-dropdown').append(`<div class="dropdown-divider"></div>`)
      snapshot.forEach(childSnapshot => {
        let gameId = childSnapshot.key
        let game = childSnapshot.val()
        $('#game-dropdown').append(`<a class="dropdown-item" href="#" onclick="selectGame('${user.uid}', '${game.gameId}')">${game.name}</a>`)
      })
    }    
  })
}

function addPlayers(user, gameId, players, gameName) {
  let playerList = _.split(players, ',')
  let ref = firebase.database().ref('userIds')
  ref.once('value').then(snapshot => {
    let users = snapshot.val()
    _.forEach(playerList, player => {
      let person = _.trim(player)
      if (person === '') {person = 'blank'}
      if (snapshot.hasChild(person) === true) {
        firebase.database().ref('users/' + user.uid + '/games/' + gameId + '/users/' + person).set(users[person])
        firebase.database().ref('users/' + user.uid + '/games/' + gameId + '/metadata/readyPlayers/' + person).set(false)
        firebase.database().ref('users/' + person + '/memberOf/').push({gameId: user.uid + '/games/' + gameId, name: gameName})
      } else {
        alert('players intentionally left ' + person)
      }
    })
    $('#game-created-modal').modal()   
  })
}

export function addCharacter(user, character) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
      let gameId = snapshot.val()
      firebase.database().ref('users/' + gameId + '/content/characters/').push(character)
      $('#character-created-modal').modal()
  })
}

export function createNew(user, gameName, players) {
  let date = new Date()
  let ref = firebase.database().ref('users/' + user.uid + '/games')
  let gameId, newRef
  let newGame = {
    metadata: {
      title: gameName,
      created: date.getTime(),
      createdby: user.displayName
    },
    users: {},
    content: {
      characters: {},
      time: {phase: 1, impulse: 1},
      messages: {}
    }
  }
  newRef = ref.push(newGame)
  gameId = newRef.key
  setCurrent(user.uid, gameId)
  addPlayers(user, gameId, players, gameName)
  firebase.database().ref('users/' + user.uid + '/games/' + gameId + '/metadata/gameId/').set(user.uid + '/games/' + gameId)
  firebase.database().ref('users/' + user.uid + '/games/' + gameId + '/users/' + user.uid).set(user.displayName)
  firebase.database().ref('users/' + user.uid + '/adminOf/').push({gameId: user.uid + '/games/' + gameId, name: gameName})
  firebase.database().ref('users/' + user.uid + '/games/' + gameId + '/metadata/readyPlayers/' + user.uid).set(false)
}

export async function getCurrent(user) {
  let currentGame = firebase.database().ref('users/' + user.uid + '/currentGame').once('value')
  let value = await Promise.all([currentGame])
  let gameId = value[0].val()
  return gameId
}

export async function all(gameId) {
  let gameRef = firebase.database().ref('users/' + gameId).once('value')
  let value = await Promise.all([gameRef])
  let game = value[0].val()
  return game
}

function setCurrent(uid, gameId) {
  firebase.database().ref('users/' + uid + '/currentGame/').set(gameId)
}

export function select(uid, gameId) {
  setCurrent(uid, gameId)
  window.location.href = 'game.html'
}