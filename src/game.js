/**
 * This module handles main game logic
 * @module Game
 * @namespace
 */

import * as User from './user'
import * as pf from 'phoenix-functions'
import * as Timer from './timer'
import * as Database from './database'
import * as Utils from './utils'

/**
 * Displays the game interface
 *
 * @param {object} user - A Firebase auth user
 * @memberof Game
 * @return {undefined} - Modifies the DOM
 */
export function displayGame(user) {
    let ref = Database.ref('users/' + user.uid + '/currentGame')
    ref.once('value', snapshot => {
        let gameId = snapshot.val()
        let gameRef = Database.ref('users/' + gameId)
        gameRef.once('value', data => {
            let game = data.val()
            addNextImpulseButton(user, game)
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

/**
 * Advances the game time by one impuse
 *
 * @memberof Game
 * @return {undefined} - Modifies the database
 */
export function nextImpulse() {
    let snap = Database.currentGame()
    snap.then(game => {
        let path = game.metadata.gameId
        let time = game.content.time
        let next = pf.nextImpulse(time)
        Database.set('users/' + path + '/content/time', next)
    })
}

/**
 * Adds the next impulse button if user is admin
 *
 * @param {object} user - A Firebase auth user
 * @param {object} game - A game object
 * @memberof Game
 * @return {undefined} - Modifies the DOM
 */
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

/**
 * Builds a user's game navigation
 *
 * @param {object} user - A Firebase auth user
 * @memberof Game
 * @return {undefined} - Modifies the DOM
 */
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
                let game = childSnapshot.val()
                let memberGameRef = Database.ref('users/' + game.gameId)
                memberGameRef.once('value', snapshot => {
                    $('#game-dropdown').append(`<a class="dropdown-item" data-uid="${user.uid}" data-gameid="${game.gameId}" href="#">${game.name}</a>`)     
                })
            })
        }
    })
}

/**
 * Joins other players to a game
 *
 * @param {object} user - A Firebase auth user who owns the game
 * @param {string} gameId - A game object id
 * @param {array} players - A list of user ids to add as players
 * @param {string} gameName - A game object's name property
 * @memberof Game
 * @return {undefined} - Modifies the database
 */
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
            }
        })
        Utils.modal('Phoenix Command', 'Game Created Successfully!')
    })
}

/**
 * Adds a character to the current game
 *
 * @param {object} character - A game's character object
 * @memberof Game
 * @return {undefined} - Modifies the database
 */
export function addCharacter(character) {
    let snap = Database.currentGame()
    snap.then(game => {
        Database.push('users/' + game.metadata.gameId + '/content/characters/', character)
        Utils.modal('Phoenix Command', 'Character Created Successfully!')
    })
}

/**
 * Creates a new game in the database
 *
 * @param {object} user - A Firebase auth user who owns the game
 * @param {string} gameName - A game object's name property
 * @param {array} players - A list of user ids to add as players
 * @memberof Game
 * @return {undefined} - Modifies the database
 */
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
            },
            messages: {}
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

/**
 * Makes a game the current game
 *
 * @param {string} uid - A Firebase id of a user
 * @param {string} gameId - A Firebase id of a game
 * @memberof Game
 * @return {undefined} - Modifies the database
 */
export function setCurrent(uid, gameId) {
    Database.set('users/' + uid + '/currentGame/', gameId)
}

/**
 * Selects a game
 *
 * @param {string} uid - A Firebase id of a user
 * @param {string} gameId - A Firebase id of a game
 * @memberof Game
 * @return {undefined} - Modifies the window location and runs setCurrent
 */
export function select(uid, gameId) {
    setCurrent(uid, gameId)
    window.location.href = 'game.html'
}

/**
 * Handler for new game submit
 *
 * @memberof Game
 * @return {undefined} - runs createNew
 */
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