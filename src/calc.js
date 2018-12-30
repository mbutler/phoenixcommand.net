import firebase from 'firebase/app'
import 'firebase/database'
import * as Utils from './utils'
import * as pf from 'phoenix-functions'

window.eal = eal

$('#eal-button').click((e) => {
    e.preventDefault()
})

$('.dropdown-eal').click((e) => {
    e.preventDefault()
    let path = $('#character-path').val()
    let targetId = $(e.target.parentElement.parentElement).attr('id')
    let result = e.delegateTarget.innerText
    $(`#${targetId} .dropdown-toggle`).empty().append(result)
    //firebase.database().ref(path + '/' + targetId).set(result)
  })

export function eal() {
    let shotType = $('#shot-type-button .dropdown-toggle').html()
    let targetSpeed = $('#target-speed').val()
    let shooterSpeed = $('#shooter-speed').val()
    let range = $('#range').val()
    let aimTime = $('#aim-time').val()
    let firingStance = $('#firing-stance-button .dropdown-toggle').html()
    let position = $('#position-button .dropdown-toggle').html()
    let situational = Utils.selectedCheckboxes($('[name="situational"]'))
    let visibility = Utils.selectedCheckboxes($('[name="visibility"]'))
    let targetSize = Utils.selectedCheckboxes($('[name="targetsize"]'))
     
    console.log(shotType, shooterSpeed, targetSpeed, range, aimTime, firingStance, position, situational, visibility, targetSize)
}
