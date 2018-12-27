import firebase from 'firebase/app'
import 'firebase/database'
import * as Game from './game'
import * as User from './user'

$('.dropdown-item-charactersheet').click((e) => {
  let path = $('#character-path').val()
  let targetId = $(e.target.parentElement.parentElement.parentElement).attr('id')
  e.preventDefault()
  let result = e.delegateTarget.innerText
  $(`#${targetId} button`).empty()
  $(`#${targetId} button`).empty().append(result)
  firebase.database().ref(path + '/' + targetId).set(result)
})

export function init(user) {
  let page = location.href.split('/').slice(-1)
  page = _.split(page, '?c=')

  if (page[0] === 'game.html') {
    displayGame(user)
  }

  if (page[0] === 'character.html') {
    let characterName = _.replace(page[1], '%20', ' ')
    displayCharacterSheet(user, characterName)
  }

  if (page[0] === 'newcharacter.html') {
    displayNewCharacter(user)
  }
}

function displayGame(user) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref('users/' + gameId)
      gameRef.on('value', data => {
        let game = data.val()
        $('.game-title').text(game.metadata.title)      

        _.forEach(User.getUserCharacters(game), player => {
          let link = ''                  
          if (user.uid === player.userId) {
            link = `<a href='character.html?c=${player.characterName}'>${player.characterName}</a>`
          } else {
            link = `${player.characterName}`
          }
          $('#user-table tbody').empty().append(`<tr><td>${link}</td><td>${player.userName}</td></tr>`)
        })
        $('.timestamp').empty().append('created: '+moment.unix(game.metadata.created / 1000).format("MMMM Do, YYYY h:mm a"))
      })
  })
}

function displayCharacterSheet(user, characterName) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref('users/' + gameId)
      gameRef.on('value', data => {
        //$('#character-path').text('users/' + gameId)
        let game = data.val()
        $('#character-path').val('users/' + gameId + '/content/characters/' + User.getCharacterId(game, characterName))
        $('.game-title').text(game.metadata.title)        
        let character = User.getCharacterSheet(game, characterName)
        $('#character-name').empty().append(`<h3><strong>${character.characterName}</strong></h3>`)
        $('#skill-level').empty().append(`<h6>Level: ${character.skillLevel}</h6>`)
        $('#strength').empty().append(character.strength)
        $('#intelligence').empty().append(character.intelligence)
        $('#agility').empty().append(character.agility)
        $('#will').empty().append(character.will)
        $('#health').empty().append(character.health)
        $('#movement').empty().append(character.speed)
        $('#sal').empty().append(character.sal)
        $('#physical-damage').empty().append(character.pd)
        $('#total-damage').empty().append(character.td)
        $('#status').empty().append(character.status)
        $('#cover button').empty().append(character.cover)
        $('#position button').empty().append(character.position)
        $('#impulse1').empty().append(character.capi['1'])
        $('#impulse2').empty().append(character.capi['2'])
        $('#impulse3').empty().append(character.capi['3'])
        $('#impulse4').empty().append(character.capi['4'])
        $('#knockout-value').empty().append(character.kv)
        $('#disabling-injuries').attr('data-content', character.injuries)

        if (character.stance === true) {
          $('#stance button').empty().append('True')
        } else {
          $('#stance button').empty().append('False')
        }
        $('#weapon-name').empty().append(`<h4><strong>${character.weapons[0]}<strong></h4>`)

        displayWeapons(character.weapons, character.sal)
      })
  })
}

function displayNewCharacter(user) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref('users/' + gameId)
      gameRef.on('value', data => {
        let game = data.val()
        $('.game-title').empty().append(`<a href='game.html'>${game.metadata.title}</a>`)
      })
  })
}

function displayWeapons(weaponList, sal) {
  let ref = firebase.database().ref('weapons')
  ref.on('value', snap => {
    let weapons = snap.val()
    _.forEach(weaponList, weapon => {
      let gun = _.find(weapons, o => {return o.Name === weapon})
      let aimTime = ''
      for (let i = 1; i <= gun['Aim Time'].length-1; i++) {
        let tr = `
            <tr>
                <td class="text-center">${i}</td>
                <td id="aim-time-mod-${i}" class="text-center">${gun['Aim Time'][i]}</td>
                <td id="shot-accuracy-${i}" class="text-center">${gun['Aim Time'][i] + sal}</td>
            </tr>
        `
          aimTime += tr
      }
      let div = `<div class="row">
        <div id="weapon-name"class="col-xs-8"><h4><strong>${gun.Name}</strong></h4></div>
          </div>
          <div class="row color-row">
            <div class="col-xs-8"><strong>Reload Time</strong></div>
            <div id="reload-time" class="col-xs-4 ml-auto">${gun.RT}</div>
          </div>
          <div class="row">
            <div class="col-xs-8"><strong>Rate of Fire</strong></div>
            <div id="fate-of-fire" class="col-xs-4 ml-auto">${gun.ROF}</div>
          </div>
          <div class="row color-row">
            <div class="col-xs-8"><strong>Capacity</strong></div>
            <div id="capacity" class="col-xs-4 ml-auto">${gun.Cap}</div>
          </div>
          <div class="row">
            <div class="col-xs-8"><strong>Ammo Weight</strong></div>
            <div id="ammo-weight" class="col-xs-4 ml-auto">${gun.AW}</div>
          </div>
          <div class="row color-row">
            <div class="col-xs-8"><strong>Knock Down</strong></div>
            <div id="knock-down" class="col-xs-4 ml-auto">${gun.KD}</div>
          </div>
          <div class="row">
            <div class="col-xs-8"><strong>Sustained Auto Burst</strong></div>
            <div id="sab" class="col-xs-4 ml-auto">${gun.SAB}</div>
          </div>
          <table class="table table-condensed table-bordered table-striped">
            <thead>
                <tr>
                    <th class="text-center">Aim Time</th>
                    <th class="text-center">Aim Time Mod</th>
                    <th class="text-center">Shot Accuracy</th>
                </tr>
            </thead>
            <tbody id="weapon-table">${aimTime}</tbody>
          </table>`
        $('#weapons').empty().append(div)
    })
  })
}
