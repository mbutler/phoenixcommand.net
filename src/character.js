import firebase from 'firebase/app'
import 'firebase/database'
import * as User from './user'
import * as pf from 'phoenix-functions'

export function displayCharacterSheet(user, characterName) {
  let ref = firebase.database().ref('users/' + user.uid + '/currentGame')
  ref.on('value', snapshot => {
      let gameId = snapshot.val()
      let gameRef = firebase.database().ref('users/' + gameId)
      gameRef.on('value', data => {
        let game = data.val()
        let characterId = User.getCharacterId(game, characterName)
        window.localStorage.setItem('firebird-command-current-character', 'users/' + gameId + '/content/characters/' + characterId)
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
        $('#physical-damage').val(character.pd)
        $('#total-damage').empty().append(character.dt)
        $('#status').empty().append(character.status)
        $("#cover").val(character.cover).find(`option[value="${character.cover}"]`).attr('selected', true)
        $("#position").val(character.position).find(`option[value="${character.position}"]`).attr('selected', true)
        $('#impulse1').empty().append(character.capi['1'])
        $('#impulse2').empty().append(character.capi['2'])
        $('#impulse3').empty().append(character.capi['3'])
        $('#impulse4').empty().append(character.capi['4'])
        $('#knockout-value').empty().append(character.kv)
        $('#disabling-injuries').attr('data-content', character.injuries)
        $("#stance").val(character.stance).find(`option[value="${character.stance}"]`).attr('selected', true)
        displayWeapons(character)
        $('.sheet-picker').change(e => {
          let id = e.target.id
          let val = e.target.value
          let path = `users/${gameId}/content/characters/${characterId}/${id}`
          firebase.database().ref(path).set(val)
        })
        $('#physical-damage').change(e => {
          let pd = _.toNumber(e.target.value)
          let dt = pf.damageTotal(pd, character.health)
          let pdPath = `users/${gameId}/content/characters/${characterId}/pd`
          let dtPath = `users/${gameId}/content/characters/${characterId}/dt`
          firebase.database().ref(pdPath).set(pd)
          firebase.database().ref(dtPath).set(dt)
          $('#total-damage').empty().append(dt)
          let chance = pf.incapacitationChance(pd, character.kv)
          if (_.random(0,99) <= chance) {
            let roll = _.random(0,9)
            let time = pf.incapacitationTime(roll, pd)
            $('#status').empty().append('Incapacitated')
            firebase.database().ref(`users/${gameId}/content/characters/${characterId}/status`).set('Incapacitated')
            alert(`${characterName} incapacitated for ${time}`)
          }
        })
      })
  })
}

export function displayNewCharacter(user) {
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

export function displayWeapons(character) {
  let ref = firebase.database().ref('weapons')
  ref.on('value', snap => {
    let databaseWeapons = snap.val()
    _.forEach(character.weapons, weapon => {
      let gun = _.find(databaseWeapons, o => {return o.Name === weapon})
      let ammoDropdown = _.kebabCase(gun.Name)
      let ammo = character['ammo'][gun.Name]['type']
      let rounds = character['ammo'][gun.Name]['loaded']
      let aimTime = ''
      for (let i = 1; i <= gun['Aim Time'].length-1; i++) {
        let tr = `
            <tr>
                <td class="text-center">${i}</td>
                <td id="aim-time-mod-${i}" class="text-center">${gun['Aim Time'][i]}</td>
                <td id="shot-accuracy-${i}" class="text-center">${gun['Aim Time'][i] + character.sal}</td>
            </tr>
        `
          aimTime += tr
      }
      let div = `<div class="row">
        <div id="weapon-name"class="col-xs-8"><h4><strong>${gun.Name}</strong></h4></div>
          </div>
          <div class="row color-row">
            <div class="col-xs-8"><strong>Rounds Loaded</strong></div>
            <div id="reload-time" class="col-xs-4 ml-auto">${rounds}</div>
          </div>
          <div class="row">
              <div class="col-xs-7"><strong>Ammo Type</strong></div>
              <div class="col-xs-5 ml-auto">
                  <div class="btn-group dropleft">
                      <button type="button" class="btn btn-sm btn-secondary dropdown-toggle drop-sm" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">${ammo}</button>
                      <div class="dropdown-menu">
                          <span class="dropdown-item ${ammoDropdown}">FMJ</span>
                          <span class="dropdown-item ${ammoDropdown}">AP</span>
                          <span class="dropdown-item ${ammoDropdown}">JHP</span>
                      </div>
                  </div>
              </div>
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
        $('#weapons').append(div)
        $(`.${ammoDropdown}`).click(e => {
          $('#weapons').empty()
          let path = window.localStorage.getItem('firebird-command-current-character')
          let result = e.currentTarget.innerText
          firebase.database().ref(path + '/ammo/' + gun.Name + '/type/').set(result)
        })
    })
  })
}
