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
      firebase.database().ref("userIds/" + user.uid).set(true)
    }
  })
}