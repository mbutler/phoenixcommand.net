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

export async function ids() {
  let userids = firebase.database().ref('userIds/IgwAYKuzhIPMkhcrNIuO23GE5yr2').once('value')
  let value = await Promise.all([userids])
  let uid = value[0].val()
  return uid
}