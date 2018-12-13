import * as firebase from 'firebase'
import * as firebaseui from 'firebaseui'

let user

function uniqueKey() {
    return '_' + Math.random().toString(36).substr(2, 9)
  }

if (localStorage.getItem('firebirdUserID') === null) {
  localStorage.setItem('firebirdUserID', uniqueKey())
  user = localStorage.getItem('firebirdUserID')
} else {
  user = localStorage.getItem('firebirdUserID')
}

let config = {
    gameID: '-L6D8cz625nLzyargSEO',
    newGame: false,
    userID: user,
    firebase: {
      apiKey: 'AIzaSyBKxAP8VRE18XIqhkZlI6z3xbCgaPCwVc0',
      authDomain: 'firebird-f30dc.firebaseapp.com',
      databaseURL: 'https://firebird-f30dc.firebaseio.com',
      projectId: 'firebird-f30dc',
      storageBucket: 'firebird-f30dc.appspot.com',
      messagingSenderId: '274623842874'
    }
  }

  firebase.initializeApp(config.firebase)

  // FirebaseUI config.
  let uiConfig = {
    signInSuccessUrl: 'index.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ]
  }

  // Initialize the FirebaseUI Widget using Firebase.
  let ui = new firebaseui.auth.AuthUI(firebase.auth())
  // The start method will wait until the DOM is loaded.
  ui.start('#firebaseui-auth-container', uiConfig)

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        $('#signin').hide()
        $('#signout').show()
        console.log(user.email)
    } else {
        $('#signout').hide()
        $('#signin').show()
        console.log('User logged out.')
    }
})

$('#signout').on('mousedown touchstart', () => {
    firebase.auth().signOut().then(() => {
        $('#signoutModal').modal()
    }).catch((error) => {
        console.log('Sign out error.')
    })
})