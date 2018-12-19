import {codenames} from "./codenames"
import {mission} from "./operations"

export function selectedCheckboxes(boxes) {
  let selected = []
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i].checked) {
      selected.push(boxes[i].defaultValue)
    }
  }
  return selected
}

function threeD6() {
  return _.random(1, 6) + _.random(1, 6) + _.random(1, 6)
}

export function randomize() {
  let name = _.sample(codenames)
  let skill = _.random(1, 6)
  $("#skill-level").val(skill)
  $("#codename").val(name)
  let str = threeD6()
  $("#strength").val(str)
  let int = threeD6()
  $("#intelligence").val(int)
  let will = threeD6()
  $("#will").val(will)
  let health = threeD6()
  $("#health").val(health)
  let agi = threeD6()
  $("#agility").val(agi)
}

export function operationName() {
  $("#gamename").val(mission())
}

export function displayAccount(user) {
  $("#account-name").text(user.displayName)
  $("#account-id").text(user.uid)
  $("#account-email").text(user.email)
}

export function clearUserDisplay() {
  $("#game-dropdown").empty()
  $("#account-name").text('Account Name')
  $("#account-id").empty()
  $("#account-email").empty()
}