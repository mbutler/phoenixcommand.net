import * as User from './user'
import * as pf from 'phoenix-functions'
import * as Timer from './timer'
import * as Database from './database'
import * as Utils from './utils'

export function displayGame(user) {
    let ref = Database.ref('users/' + user.uid + '/currentGame')
    ref.once('value', snapshot => {
        let gameId = snapshot.val()
        let gameRef = Database.ref('users/' + gameId)
        gameRef.once('value', data => {
            let game = data.val()
            addNextImpulseButton(user, game)
            $('#phase').empty().append(`<h4>Phase: <strong>${game.content.time.phase}</strong></h4>`)
            $('#impulse').empty().append(`<h4>Impulse: <strong>${game.content.time.impulse}</strong></h4>`)
            $('.game-title').text(game.metadata.title)
            $('#user-table tbody').empty()
            _.forEach(User.getUserCharacters(game), player => {
                let link = ''
                let trash = ''
                if (user.uid === player.userId && player.characterId !== '') {
                    link = `<a href='character.html?c=${player.characterName}'>${player.characterName}</a>`
                    trash = `<i id="0${player.characterId}" class="fa fa-trash" data-uid="${user.uid}" data-gameid="${gameId}" data-characterid="${player.characterId}" aria-hidden="true"></i>`
                } else {
                    link = `${player.characterName}`
                    trash = ''
                }
                $('#user-table tbody').append(`<tr id="${player.characterId}-row"><td>${link}</td><td>${player.userName}</td><td>${trash}</td></tr>`)
                $(`#0${player.characterId}`).click(e => {
                    e.preventDefault()
                    let characterId = $(e.target).data('characterid')
                    let gameId = $(e.target).data('gameid')
                    let characterPath = `users/${gameId}/content/characters/`
                    Utils.deleteModal('Phoenix Command', 'Delete Character?', characterPath, characterId)
                })
            })
            let adminRef = Database.ref('users/' + user.uid + '/adminOf')
            adminRef.once('value').then(snapshot => {
                snapshot.forEach(childSnapshot => {
                    let admin = childSnapshot.val()
                    if (game.metadata.gameId === admin.gameId) {
                        $("#button-area").append('<button id="delete-game" class="btn btn-danger btn-sm">Delete Game</button>')
                        $("#delete-game").click(e => {
                            e.preventDefault()
                            let split = _.split(gameId, '/')
                            let path = `users/${user.uid}/games/`
                            Utils.deleteGameModal('Phoenix Command', 'Delete Game?', path, split[2])
                        })
                    }
                })
            })
            $('.timestamp').empty().append('created: ' + moment.unix(game.metadata.created / 1000).format("MMMM Do, YYYY h:mm a"))
        })
    })
}

export function nextImpulse() {
    let snap = Database.currentGame()
    snap.then(game => {
        let path = game.metadata.gameId
        let time = game.content.time
        let next = pf.nextImpulse(time)
        Database.set('users/' + path + '/content/time', next)
        let ref = Database.ref('users/' + path + '/content/time')
        ref.once('value', snapshot => {
            let time = snapshot.val()
            $('#phase').empty().append(`<h4>Phase: <strong>${time.phase}</strong></h4>`)
            $('#impulse').empty().append(`<h4>Impulse: <strong>${time.impulse}</strong></h4>`)
            Timer.run(path)
        })
    })
}

export function addNextImpulseButton(user, game) {
    let adminRef = Database.ref('users/' + user.uid + '/adminOf')
    adminRef.once('value').then(snapshot => {
        snapshot.forEach(childSnapshot => {
            let admin = childSnapshot.val()
            if (game.metadata.gameId === admin.gameId) {
                $('#time').append('<button id="next-impulse" class="btn btn-info btn-link">Next Impulse -></button>')
                $("#next-impulse").click(e => {
                    e.preventDefault()
                    nextImpulse()
                })
            }
        })
    })
}

export function navList(user) {
    let adminRef = Database.ref('users/' + user.uid + '/adminOf')
    let memberRef = Database.ref('users/' + user.uid + '/memberOf').orderByKey()

    $('#game-dropdown').empty()

    adminRef.once('value').then(snapshot => {
        $('#game-dropdown').append('<div class="nav-section"><strong>Created:</strong></div>')
        snapshot.forEach(childSnapshot => {
            let game = childSnapshot.val()
            $('#game-dropdown').append(`<a class="dropdown-item" data-uid="${user.uid}" data-gameid="${game.gameId}" href="#">${game.name}</a>`)
        })
    })

    memberRef.once('value').then(snapshot => {
        if (snapshot.val()) {
            $('#game-dropdown').append(`<div class="dropdown-divider"></div>`)
            $('#game-dropdown').append('<div class="nav-section"><strong>Joined:</strong></div>')
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
            if (person === '') {
                person = 'blank'
            }
            if (snapshot.hasChild(person) === true) {
                Database.set('users/' + user.uid + '/games/' + gameId + '/users/' + person, users[person])
                Database.set('users/' + user.uid + '/games/' + gameId + '/metadata/readyPlayers/' + person, false)
                Database.push('users/' + person + '/memberOf/', {
                    gameId: user.uid + '/games/' + gameId,
                    name: gameName
                })
            } else {
                alert('players intentionally left ' + person)
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
            time: {
                phase: 1,
                impulse: 1
            }
        }
    }
    newRef = ref.push(newGame)
    gameId = newRef.key
    setCurrent(user.uid, gameId)
    addPlayers(user, gameId, players, gameName)
    Database.set('users/' + user.uid + '/games/' + gameId + '/metadata/gameId/', user.uid + '/games/' + gameId)
    Database.set('users/' + user.uid + '/games/' + gameId + '/users/' + user.uid, user.displayName)
    Database.push('users/' + user.uid + '/adminOf/', {
        gameId: user.uid + '/games/' + gameId,
        name: gameName
    })
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