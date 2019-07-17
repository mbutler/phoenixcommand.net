import * as User from './user'
import * as pf from 'phoenix-functions'
import * as Timer from './timer'
import * as Database from './database'
import * as Utils from './utils'

export function displayGame(user) {
  let ref = Database.ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
    let gameId = snapshot.val()
    let gameRef = Database.ref('users/' + gameId)
    gameRef.on('value', data => {
      let game = data.val()
      let userReady = game.metadata.readyPlayers[user.uid]
      toggleUserReady(userReady)
      checkReadyPlayers(game.metadata)
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
        Database.set(path, true)
      } else if ($('#next-impulse-button').hasClass('btn-danger')) {
        Database.set(path, false)
      }
    })
  })
}

export function checkReadyPlayers(metadata) {
  if (_.every(metadata.readyPlayers)) {
    nextImpulse()
  }
}

export function nextImpulse() {
  let snap = Database.currentGame()
  snap.then(game => {
    let path = game.metadata.gameId
    let time = game.content.time
    let keys = _.keys(game.metadata.readyPlayers)
    _.forEach(keys, key => {
      Database.set('users/' + path + '/metadata/readyPlayers/' + key, false)
    })   
    let next = pf.nextImpulse(time)
    Database.set('users/' + path + '/content/time', next)
    let ref = Database.ref('users/' + path + '/content/time')
    ref.once('value', snapshot => {
      Timer.run(path)
    })
    //Utils.modal('Phoenix Command', 'Next Impulse!')
  })
}

export function toggleUserReady(userReady) {
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
  let adminRef = Database.ref('users/' + user.uid + '/adminOf')
  let memberRef = Database.ref('users/' + user.uid + '/memberOf').orderByKey()
  
  adminRef.once('value').then(snapshot => {
    $('#game-dropdown').empty()
    snapshot.forEach(childSnapshot => {
      let game = childSnapshot.val()
      $('#game-dropdown').append(`<a class="dropdown-item" data-uid="${user.uid}" data-gameid="${game.gameId}" href="#">${game.name}</a>`)
    })
  })

  memberRef.once('value').then(snapshot => {
    if (snapshot.val()) {
      $('#game-dropdown').empty()
      $('#game-dropdown').append(`<div class="dropdown-divider"></div>`)
      snapshot.forEach(childSnapshot => {
        let gameId = childSnapshot.key
        let game = childSnapshot.val()
        $('#game-dropdown').append(`<a class="dropdown-item" data-uid="${user.uid}" data-gameid="${game.gameId}" href="#">${game.name}</a>`)
      })
    }    
  })
}

export function addPlayers(user, gameId, players, gameName) {
  let playerList = _.split(players, ',')
  let ref = Database.ref('userIds')
  ref.once('value').then(snapshot => {
    let users = snapshot.val()
    _.forEach(playerList, player => {
      let person = _.trim(player)
      if (person === '') {person = 'blank'}
      if (snapshot.hasChild(person) === true) {
        Database.set('users/' + user.uid + '/games/' + gameId + '/users/' + person, users[person])
        Database.set('users/' + user.uid + '/games/' + gameId + '/metadata/readyPlayers/' + person, false)
        Database.set('users/' + person + '/memberOf/', {gameId: user.uid + '/games/' + gameId, name: gameName})
      } else {
        //alert('players intentionally left ' + person)
      }
    })
    Utils.modal('Phoenix Command', 'Game Created Successfully!')   
  })
}

export function addCharacter(character) {
  let snap = Database.currentGame()
  snap.then(game => {
    Database.push('users/' + game.metadata.gameId + '/content/characters/', character)
    Utils.modal('Phoenix Command', 'Character Created Successfully!')
  })
}

export function createNew(user, gameName, players) {
  let date = new Date()
  let ref = Database.ref('users/' + user.uid + '/games')
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
  Database.set('users/' + user.uid + '/games/' + gameId + '/metadata/gameId/', user.uid + '/games/' + gameId)
  Database.set('users/' + user.uid + '/games/' + gameId + '/users/' + user.uid, user.displayName)
  Database.push('users/' + user.uid + '/adminOf/', {gameId: user.uid + '/games/' + gameId, name: gameName})
  Database.set('users/' + user.uid + '/games/' + gameId + '/metadata/readyPlayers/' + user.uid, false)
  navList(user)
}

export function setCurrent(uid, gameId) {
  Database.set('users/' + uid + '/currentGame/', gameId)
}

export function select(uid, gameId) {
  setCurrent(uid, gameId)
  window.location.href = 'game.html'
}

export function newGameSubmit() {
  let name = $('#gamename').val()
  let players = $('#invite-players').val()
  let authUser = Database.auth().currentUser  

  if (authUser) {
    createNew(authUser, name, players)
  } else {
    Utils.modal('Phoenix Command', 'Signed In Successfully!')
  } 
}