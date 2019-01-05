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
    $('.arc-rows').hide()
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
    if ($('#range').val() === '' || $('#aim-time').val() === '' || $(`#weapon-button .dropdown-toggle`).html() === 'Weapon') {
        alert("Weapon, Range, and Aim Time are required values.")
    } else {
        let ref = firebase.database().ref('weapons')
        ref.once('value').then(snap => {
            let eal = {}
            let sal = _.toNumber($('#sal').val())
            let range = _.toNumber($('#range').val())
            let targetSpeed = _.toNumber($('#target-speed').val())
            let shooterSpeed = _.toNumber($('#shooter-speed').val())
            let aimTime = _.toNumber($('#aim-time').val())
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
            $('.arc-rows').hide()
            $('#sab-message').empty()
            $('#odds-of-hitting').empty()
            $('#fire-button').off('click')
            $('#eal').empty().append(accuracy)
            displayHit(chance, shotType, range, gun)            
        }) 
    }       
}

function displayHit(chance, shotType, range, weapon) {    
    if (shotType === 'Burst') {
        let sab = weapon['SAB']
        $('.arc-rows h5').empty().append(`Number of Targets in <strong>Minimum Arc of ${getMinimumArc(weapon, range)}:</strong>`)
        $('.arc-rows').show()
        $('#odds-label').empty().append(`<strong><h3>Burst Elevation Chance</h3></strong>`)
        let odds = $('#odds-of-hitting h3').html()
        odds = _.toNumber(_.trim(odds, '%'))
        if (odds === 0) {
            $('#odds-of-hitting').empty().append(`<h3>${chance}%</h3>`)
            odds = chance
        } else {
            $('#odds-of-hitting').empty().append(`<h3>${odds}%</h3>`)
        }
        $('#fire-button').click(e => {
            e.preventDefault()
            let targets = _.toNumber($('#number-of-targets').val())
            let arc = _.toNumber($('#arc').val())
            //make sure these fields are not empty
            if (targets > 0 && arc > 0) {
                //if we've already fired a burst, lower the chances
                if (odds <= chance) {            
                    odds = odds - sab
                    if (odds < 0) {odds = 0}
                    $('#odds-of-hitting').empty().append(`<h3>${odds}%</h3>`)
                    $('#sab-message').empty().append(`With sustained auto burst penalty of -${sab}`)
                }
                fireBurst(weapon, targets, arc, odds)
            } else {
                alert('Arc and number of targets required.')
            }     
        })
    } else if (shotType === 'Single Shot') {
        $('#odds-label').empty().append(`<strong><h3>Chance of Hitting</h3></strong>`)
        $('#odds-of-hitting').empty().append(`<h3>${chance}%</h3>`)
        $('#fire-button').click(e => {
            e.preventDefault()
            fireSingleShot(weapon, chance)
        })        
    }    
    $('.nav-tabs a[href="#odds"]').tab('show')    
}

function getMinimumArc(weapon, range) {
    range = pf.snapToValue(range, [0,10,20,40,70,100,200,300,400,600,800,1000,1200,1500])
    let arc = weapon[_.toString(range)]['MA']
    return arc
}

function fireBurst(weapon, numberOfTargets, arc, chance) {
    let result = ''
    let path = $('#character-path').val()
    let ref = firebase.database().ref(path)
    let rof = weapon['ROF']
    let sab = weapon['SAB']
    let roll = _.random(0,99)
    ref.once('value').then(snap => {
        let character = snap.val()
        let loadedAmmo = character['ammo'][weapon.Name]['loaded']
        if (loadedAmmo >= rof) {
            firebase.database().ref(path + '/ammo/' + weapon.Name + '/loaded/').set(loadedAmmo - rof)
            if (_.random(0,99) <= chance) {
                result = pf.burstFire(arc, rof, numberOfTargets)
                displayTargets(result)
            } else {
                result = 'Burst fire at wrong elevation. All targets missed.'
            }
        } else {
            result = 'Not enough ammo loaded for burst mode.'
            //this is fake. If fire button is clicked again the chance still goes down. Should be fine...
            $('#odds-of-hitting').empty().append(`<h3>${chance + sab}%</h3>`)
            $('#sab-message').empty()
            alert(result)
        }        
        console.log(result)
    })    
}

function fireSingleShot(weapon, chance) {
    let result = ''
    let path = $('#character-path').val()
    let ref = firebase.database().ref(path)
    ref.once('value').then(snap => {
        let character = snap.val()
        let loadedAmmo = character['ammo'][weapon.Name]['loaded']
        if (loadedAmmo >= 1) {
            firebase.database().ref(path + '/ammo/' + weapon.Name + '/loaded/').set(loadedAmmo - 1)
            if (_.random(0,99) <= chance) {
                result = pf.singleShotFire(chance)
                displayTargets(result)
            } else {
                result = 'Miss.'
            }
        } else {
            result = 'Out of ammo.'
            alert(result)
        }
        console.log(result)
    })
}

function displayTargets(targetList) {
    console.log()
    let targetRows = ''
    let targets = targetList
    //const targets = {"target 1":{"hit":false,"bullets":6,"chance":23},"target 2":{"hit":false,"bullets":0,"chance":23},"target 3":{"hit":false,"bullets":0,"chance":23},"target 4":{"hit":false,"bullets":0,"chance":23},"target 5":{"hit":false,"bullets":0,"chance":23},"target 6":{"hit":false,"bullets":0,"chance":23},"target 7":{"hit":false,"bullets":0,"chance":23},"target 8":{"hit":false,"bullets":0,"chance":23},"target 9":{"hit":false,"bullets":0,"chance":23},"target 10":{"hit":false,"bullets":2,"chance":23}}
    for (let i = 1; i <= _.size(targets); i++) {
        let bullets = _.toNumber($(`#target-${i}-bullets`).text()) + _.toNumber(`${targets[`target ${i}`]['bullets']}`)
        let tr = `
            <tr>
                <td class="text-center">${i}</td>
                <td id="target-${i}-bullets" class="text-center">${bullets}</td>
                <td id="target-${i}-chance" class="text-center">${targets[`target ${i}`]['chance']}%</td>
                <td id="target-${i}-armor" class="text-center"><select class="form-control selectpicker target-armor-select" data-style="btn btn-link"">
                    <option value="Clothing">Clothing</option>
                    <option value="Light Flexible">Light Flexible</option>
                    <option value="Medium Flexible">Medium Flexible</option>
                    <option value="Heavy Flexible">Heavy Flexible</option>
                    <option value="Light Rigid">Light Rigid</option>
                    <option value="Medium Rigid">Medium Rigid</option>
                    <option value="Heavy Rigid">Heavy Rigid</option>
                </select></td>
            </tr>
        `
        targetRows += tr
    }
    let div = `<table class="table table-condensed table-bordered table-striped">
        <thead>
            <tr>
                <th class="text-center">Target</th>
                <th class="text-center">Hits</th>
                <th class="text-center">Chance</th>
                <th class="text-center">Armor</th>
            </tr>
        </thead>
        <tbody id="target-table">${targetRows}</tbody>
    </table>`
    $('#location').empty().append(div)
}
