/**
 * This module handles calculator functionality
 * @module Medical
 * @namespace
 */
 import * as Database from './database'
 import * as User from './user'
 import * as pf from 'phoenix-functions'
 import _ from 'lodash'
 
 /**
  * Sets the User's characters in Medical dropdown and fields
  *
  * @param {object} user - A Firebase auth user
  * @memberof Calc
  * @return {undefined} - Modifies the DOM
  */
 export function setUser(user) {
     let snap = Database.currentGame(user.uid)
     snap.then(game => {
         $('.game-title').text(game.metadata.title)
         let userCharacters = User.getUserCharacters(game)
         _.forEach(userCharacters, player => {
             if (user.uid === player.userId) {
                 let tr = `
                 <tr>
                     <td class="text-center"><strong>${player.name}</strong></td>
                     <td id="${player.characterId}-damage" class="text-center">${player.dt}</td>
                     <td class="text-center"><select id="${player.characterId}-aid" class="form-control selectpicker aid-select" data-style="btn btn-link"">
                         <option value="No Aid">No Aid</option>
                         <option value="First Aid">First Aid</option>
                         <option value="Aid Station">Aid Station</option>
                         <option value="Field Hospital">Field Hospital</option>
                         <option value="Trauma Center">Trauma Center</option>
                     </select></td>
                     <td id="${player.characterId}-recovery" class="text-center">${pf.medicalAid(_.toNumber(player.dt), 'No Aid')}</td>
                 </tr>
                 `
                 $('#medical-table tbody').append(tr)
             }
         })
         $('.aid-select').change(e => {
             let id = _.split(e.target.id, '-', 2)
             let aid = e.target.value
             let damage = $(`#-${id[1]}-damage`).text()
             let result = pf.medicalAid(_.toNumber(damage), aid)
             let recoveryId = `#-${id[1]}-recovery`
             $(recoveryId).empty().append(result)
         })
     })
 }