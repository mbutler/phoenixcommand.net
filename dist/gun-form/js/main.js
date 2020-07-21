$('#gun-submit-button').click(e => {
    e.preventDefault()
    createGun()
})

function createGun() {
    let gun = {}
    gun["10"] = {}
    gun["20"] = {}
    gun["40"] = {}
    gun["70"] = {}
    gun["100"] = {}
    gun["200"] = {}
    gun["300"] = {}
    gun["400"] = {}

    gun["10"]["FMJ"] = {}
    gun["10"]["FMJ"]["PEN"] =  Number($('#fmj-pen-10').val())
    gun["10"]["FMJ"]["DC"] = Number($('#fmj-dc-10').val())

    gun["10"]["JHP"] = {}
    gun["10"]["JHP"]["PEN"] = Number($('#jhp-pen-10').val())
    gun["10"]["JHP"]["DC"] = Number($('#jhp-dc-10').val())

    gun["10"]["AP"] = {}
    gun["10"]["AP"]["PEN"] = Number($('#ap-pen-10').val())
    gun["10"]["AP"]["DC"] = Number($('#ap-dc-10').val())

    gun["10"]["MA"] = Number($('#ma-10').val())
    gun["10"]["BA"] = Number($('#ba-10').val())
    gun["10"]["TOF"] = Number($('#tof-10').val())

    gun["20"]["FMJ"] = {}
    gun["20"]["FMJ"]["PEN"] = Number($('#fmj-pen-20').val())
    gun["20"]["FMJ"]["DC"] = Number($('#fmj-dc-20').val())

    gun["20"]["JHP"] = {}
    gun["20"]["JHP"]["PEN"] = Number($('#jhp-pen-20').val())
    gun["20"]["JHP"]["DC"] = Number($('#jhp-dc-20').val())

    gun["20"]["AP"] = {}
    gun["20"]["AP"]["PEN"] = Number($('#ap-pen-20').val())
    gun["20"]["AP"]["DC"] = Number($('#ap-dc-20').val())

    gun["20"]["MA"] = Number($('#ma-20').val())
    gun["20"]["BA"] = Number($('#ba-20').val())
    gun["20"]["TOF"] = Number($('#tof-20').val())

    gun["40"]["FMJ"] = {}
    gun["40"]["FMJ"]["PEN"] = Number($('#fmj-pen-40').val())
    gun["40"]["FMJ"]["DC"] = Number($('#fmj-dc-40').val())

    gun["40"]["JHP"] = {}
    gun["40"]["JHP"]["PEN"] = Number($('#jhp-pen-40').val())
    gun["40"]["JHP"]["DC"] = Number($('#jhp-dc-40').val())

    gun["40"]["AP"] = {}
    gun["40"]["AP"]["PEN"] = Number($('#ap-pen-40').val())
    gun["40"]["AP"]["DC"] = Number($('#ap-dc-40').val())

    gun["40"]["MA"] = Number($('#ma-40').val())
    gun["40"]["BA"] = Number($('#ba-40').val())
    gun["40"]["TOF"] = Number($('#tof-40').val())

    gun["70"]["FMJ"] = {}
    gun["70"]["FMJ"]["PEN"] = Number($('#fmj-pen-70').val())
    gun["70"]["FMJ"]["DC"] = Number($('#fmj-dc-70').val())

    gun["70"]["JHP"] = {}
    gun["70"]["JHP"]["PEN"] = Number($('#jhp-pen-70').val())
    gun["70"]["JHP"]["DC"] = Number($('#jhp-dc-70').val())

    gun["70"]["AP"] = {}
    gun["70"]["AP"]["PEN"] = Number($('#ap-pen-70').val())
    gun["70"]["AP"]["DC"] = Number($('#ap-dc-70').val())

    gun["70"]["MA"] = Number($('#ma-70').val())
    gun["70"]["BA"] = Number($('#ba-70').val())
    gun["70"]["TOF"] = Number($('#tof-70').val())

    gun["100"]["FMJ"] = {}
    gun["100"]["FMJ"]["PEN"] = Number($('#fmj-pen-100').val())
    gun["100"]["FMJ"]["DC"] = Number($('#fmj-dc-100').val())

    gun["100"]["JHP"] = {}
    gun["100"]["JHP"]["PEN"] = Number($('#jhp-pen-100').val())
    gun["100"]["JHP"]["DC"] = Number($('#jhp-dc-100').val())

    gun["100"]["AP"] = {}
    gun["100"]["AP"]["PEN"] = Number($('#ap-pen-100').val())
    gun["100"]["AP"]["DC"] = Number($('#ap-dc-100').val())

    gun["100"]["MA"] = Number($('#ma-100').val())
    gun["100"]["BA"] = Number($('#ba-100').val())
    gun["100"]["TOF"] = Number($('#tof-100').val())

    gun["200"]["FMJ"] = {}
    gun["200"]["FMJ"]["PEN"] = Number($('#fmj-pen-200').val())
    gun["200"]["FMJ"]["DC"] = Number($('#fmj-dc-200').val())

    gun["200"]["JHP"] = {}
    gun["200"]["JHP"]["PEN"] = Number($('#jhp-pen-200').val())
    gun["200"]["JHP"]["DC"] = Number($('#jhp-dc-200').val())

    gun["200"]["AP"] = {}
    gun["200"]["AP"]["PEN"] = Number($('#ap-pen-200').val())
    gun["200"]["AP"]["DC"] = Number($('#ap-dc-200').val())

    gun["200"]["MA"] = Number($('#ma-200').val())
    gun["200"]["BA"] = Number($('#ba-200').val())
    gun["200"]["TOF"] = Number($('#tof-200').val())

    gun["300"]["FMJ"] = {}
    gun["300"]["FMJ"]["PEN"] = Number($('#fmj-pen-300').val())
    gun["300"]["FMJ"]["DC"] = Number($('#fmj-dc-300').val())

    gun["300"]["JHP"] = {}
    gun["300"]["JHP"]["PEN"] = Number($('#jhp-pen-300').val())
    gun["300"]["JHP"]["DC"] = Number($('#jhp-dc-300').val())

    gun["300"]["AP"] = {}
    gun["300"]["AP"]["PEN"] = Number($('#ap-pen-300').val())
    gun["300"]["AP"]["DC"] = Number($('#ap-dc-300').val())

    gun["300"]["MA"] = Number($('#ma-300').val())
    gun["300"]["BA"] = Number($('#ba-300').val())
    gun["300"]["TOF"] = Number($('#tof-300').val())

    gun["400"]["FMJ"] = {}
    gun["400"]["FMJ"]["PEN"] = Number($('#fmj-pen-400').val())
    gun["400"]["FMJ"]["DC"] = Number($('#fmj-dc-400').val())

    gun["400"]["JHP"] = {}
    gun["400"]["JHP"]["PEN"] = Number($('#jhp-pen-400').val())
    gun["400"]["JHP"]["DC"] = Number($('#jhp-dc-400').val())

    gun["400"]["AP"] = {}
    gun["400"]["AP"]["PEN"] = Number($('#ap-pen-400').val())
    gun["400"]["AP"]["DC"] = Number($('#ap-dc-400').val())

    gun["400"]["MA"] = Number($('#ma-400').val())
    gun["400"]["BA"] = Number($('#ba-400').val())
    gun["400"]["TOF"] = Number($('#tof-400').val())

    gun["Name"] = $('#name').val()
    gun["Type"] = $('#type').val()
    gun["Description"] = $('#description').val()
    gun["Image"] = ""
    gun["L"] = $('#length').val()
    gun["W"] = Number($('#weight').val())
    gun["RT"] = Number($('#reload-time').val())
    gun["ROF"] = Number($('#rate-of-fire').val())
    gun["Cap"] = Number($('#cap').val())
    gun["AW"] = $('#ammo-weight').val()
    gun["KD"] = Number($('#knockdown').val())
    gun["SAB"] = Number($('#sustained-auto-burst').val())

    gun["Aim Time"] = aimTime()

    $("#output").val(JSON.stringify(gun, undefined, 2))
}

function aimTime() {
    let aimTime = {}
    for (let i = 1; i <= 16; i++) {
        let item = "#aim-" + i
        let current = $(`${item}`).val()
        if (current !== "") {
            aimTime[i] = current
        }
    }

    return aimTime
}