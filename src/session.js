import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import * as Game from './game'

export function init(user) {
  let page = location.href.split("/").slice(-1)

  if (page[0] === 'game.html') {
    display(user)
  }
}

function display(user) {
  let ref = firebase.database().ref("users/" + user.uid + "/currentGame")
  ref.on("value", snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref("users/" + user.uid + "/games/" + gameId)
      gameRef.on("value", data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)
      })
  })
}

function testParse(game) {
  return game.metadata.createdby
}