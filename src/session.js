import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export function init(user) {
  let page = location.href.split("/").slice(-1)

  if (page[0] === 'game.html') {
    display(user)
  } else {
    console.log('nope')
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
        console.log(testParse(game))
      })
  })
}

function testParse(game) {
  return game.metadata.createdby
}