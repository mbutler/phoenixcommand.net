import firebase from 'firebase/app'
import 'firebase/database'
import * as Utils from './utils'
import * as User from './user'
import * as pf from 'phoenix-functions'

window.eal = eal

$('#eal-button').click(e => {
    e.preventDefault()
})

$('.dropdown-eal').click(e => {
    e.preventDefault()
    let path = $('#character-path').val()
    let targetId = $(e.target.parentElement.parentElement).attr('id')
    let result = e.delegateTarget.innerText
    $(`#${targetId} .dropdown-toggle`).empty().append(result)
})

$('#weapon-button').on('click', '.dropdown-eal', e => {
    $('#weapon-button .dropdown-toggle').empty()
    e.preventDefault()
    let result = e.target.innerText
    $(`#weapon-button .dropdown-toggle`).empty().append(result)
})

$("#character-name").on('click', '.dropdown-eal', e => {
    $('#character-name .dropdown-toggle').empty()
    e.preventDefault()
    let targetId = $(e.target.parentElement.parentElement).attr('id')
    let result = e.target.innerText
    $(`#${targetId} .dropdown-toggle`).empty().append(result)
    let ref = firebase.database().ref('users/' + $('#uid').val() + '/currentGame')
    ref.on('value', snapshot => {
        let gameId = snapshot.val()
        let gameRef = firebase.database().ref('users/' + gameId)
        gameRef.on('value', data => {
            let game = data.val()
            _.forEach(game.content.characters, player => {                
                if (player.name === result) {
                    $('#character-path').val('users/' + gameId + '/content/characters/' + User.getCharacterId(game, result))
                    $('#sal').val(player.sal)
                    $(`#firing-stance-button .dropdown-toggle`).empty().append(player.stance)
                    $(`#position-button .dropdown-toggle`).empty().append(player.position)
                    _.forEach(player.weapons, gun => {
                        $('#weapon-button .col .dropdown-menu').append(`<span class="dropdown-item dropdown-eal">${gun}</span>`)
                    })
                }
            })
        })
    })   
})

export function setUser(user) {
    $(`#shot-type-button .dropdown-toggle`).empty().append('Single Shot')
    let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
    $('#uid').val(user.uid)
    ref.on('value', snapshot => {
        let gameId = snapshot.val()
        let gameRef = firebase.database().ref('users/' + gameId)
        gameRef.on('value', data => {
            let game = data.val()            
            $('.game-title').text(game.metadata.title)
            let userCharacters = User.getUserCharacters(game)
            _.forEach(userCharacters, player => {
                if (user.uid === player.userId) {
                    $('#character-name .dropdown-menu').append(`<span class="dropdown-item dropdown-eal">${player.characterName}</span>`)                    
                }
            })
            
        })
    })
}

export function eal() {    
    let ref = firebase.database().ref('weapons')
    ref.on('value', snap => {
        let eal = {}
        let sal = _.toNumber($('#sal').val())
        let range = _.toNumber($('#range').val())
        let targetSpeed = _.toNumber($('#target-speed').val())
        let shooterSpeed = _.toNumber($('#shooter-speed').val())
        let aimTime = _.toNumber($('#aim-time').val())
        //if (pf.movingALM(targetSpeed, shooterSpeed, range) === -10) {aimTime = 2}
        $('#from-the-hip').prop('checked', false)
        if (shooterSpeed > 0) {$('#from-the-hip').prop('checked', true)}
        let weapon = $(`#weapon-button .dropdown-toggle`).html()
        let weapons = snap.val()        
        let gun = _.find(weapons, o => {return o.Name === weapon})
        let weaponAim = gun['Aim Time']
        let weaponAimIndex = _.clamp(aimTime, 0, weaponAim.length - 1)        
        let shotType = $('#shot-type-button .dropdown-toggle').html()        
        let firingStance = $('#firing-stance-button .dropdown-toggle').html()
        if (firingStance === false) {$('#from-the-hip').prop('checked', true)}
        let position = $('#position-button .dropdown-toggle').html()
        let situational = Utils.selectedCheckboxes($('[name="situational"]'))
        let visibility = Utils.selectedCheckboxes($('[name="visibility"]'))
        let targetSize = Utils.selectedCheckboxes($('[name="targetsize"]'))
        let targetDiameter = _.toNumber($('#target-size').val())
        eal.sal = sal, eal.shotType = shotType, eal.targetSpeed = targetSpeed, eal.shooterSpeed = shooterSpeed, eal.range = range, eal.aimTime = aimTime
        eal.firingStance = firingStance, eal.position = position, eal.situational = situational, eal.visibility = visibility, eal.targetSize = targetSize
        eal.weaponAimMod = weaponAim[_.toString(weaponAimIndex)], eal.targetDiameter = targetDiameter
        let accuracy = pf.effectiveAccuracyLevel(eal)
        let chance = pf.oddsOfHitting(accuracy, shotType)
        $('#eal').empty().append(accuracy)
        $('#odds-of-hitting').empty().append(`<h3>${chance}%</h3>`)
        $('.nav-tabs a[href="#odds"]').tab('show')
    })    
}
