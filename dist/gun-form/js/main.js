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
    gun["10"]["FMJ"]["PEN"] = $('#fmj-pen-10').val()
    gun["10"]["FMJ"]["DC"] = $('#fmj-dc-10').val()

    gun["10"]["JHP"] = {}
    gun["10"]["JHP"]["PEN"] = $('#jhp-pen-10').val()
    gun["10"]["JHP"]["DC"] = $('#jhp-dc-10').val()

    gun["10"]["AP"] = {}
    gun["10"]["AP"]["PEN"] = $('#ap-pen-10').val()
    gun["10"]["AP"]["DC"] = $('#ap-dc-10').val()

    gun["10"]["MA"] = $('#ma-10').val()
    gun["10"]["BA"] = $('#ba-10').val()
    gun["10"]["TOF"] = $('#tof-10').val()

    gun["20"]["FMJ"] = {}
    gun["20"]["FMJ"]["PEN"] = $('#fmj-pen-20').val()
    gun["20"]["FMJ"]["DC"] = $('#fmj-dc-20').val()

    gun["20"]["JHP"] = {}
    gun["20"]["JHP"]["PEN"] = $('#jhp-pen-20').val()
    gun["20"]["JHP"]["DC"] = $('#jhp-dc-20').val()

    gun["20"]["AP"] = {}
    gun["20"]["AP"]["PEN"] = $('#ap-pen-20').val()
    gun["20"]["AP"]["DC"] = $('#ap-dc-20').val()

    gun["20"]["MA"] = $('#ma-20').val()
    gun["20"]["BA"] = $('#ba-20').val()
    gun["20"]["TOF"] = $('#tof-20').val()

    gun["40"]["FMJ"] = {}
    gun["40"]["FMJ"]["PEN"] = $('#fmj-pen-40').val()
    gun["40"]["FMJ"]["DC"] = $('#fmj-dc-40').val()

    gun["40"]["JHP"] = {}
    gun["40"]["JHP"]["PEN"] = $('#jhp-pen-40').val()
    gun["40"]["JHP"]["DC"] = $('#jhp-dc-40').val()

    gun["40"]["AP"] = {}
    gun["40"]["AP"]["PEN"] = $('#ap-pen-40').val()
    gun["40"]["AP"]["DC"] = $('#ap-dc-40').val()

    gun["40"]["MA"] = $('#ma-40').val()
    gun["40"]["BA"] = $('#ba-40').val()
    gun["40"]["TOF"] = $('#tof-40').val()

    gun["70"]["FMJ"] = {}
    gun["70"]["FMJ"]["PEN"] = $('#fmj-pen-70').val()
    gun["70"]["FMJ"]["DC"] = $('#fmj-dc-70').val()

    gun["70"]["JHP"] = {}
    gun["70"]["JHP"]["PEN"] = $('#jhp-pen-70').val()
    gun["70"]["JHP"]["DC"] = $('#jhp-dc-70').val()

    gun["70"]["AP"] = {}
    gun["70"]["AP"]["PEN"] = $('#ap-pen-70').val()
    gun["70"]["AP"]["DC"] = $('#ap-dc-70').val()

    gun["70"]["MA"] = $('#ma-70').val()
    gun["70"]["BA"] = $('#ba-70').val()
    gun["70"]["TOF"] = $('#tof-70').val()

    gun["100"]["FMJ"] = {}
    gun["100"]["FMJ"]["PEN"] = $('#fmj-pen-100').val()
    gun["100"]["FMJ"]["DC"] = $('#fmj-dc-100').val()

    gun["100"]["JHP"] = {}
    gun["100"]["JHP"]["PEN"] = $('#jhp-pen-100').val()
    gun["100"]["JHP"]["DC"] = $('#jhp-dc-100').val()

    gun["100"]["AP"] = {}
    gun["100"]["AP"]["PEN"] = $('#ap-pen-100').val()
    gun["100"]["AP"]["DC"] = $('#ap-dc-100').val()

    gun["100"]["MA"] = $('#ma-100').val()
    gun["100"]["BA"] = $('#ba-100').val()
    gun["100"]["TOF"] = $('#tof-100').val()

    gun["200"]["FMJ"] = {}
    gun["200"]["FMJ"]["PEN"] = $('#fmj-pen-200').val()
    gun["200"]["FMJ"]["DC"] = $('#fmj-dc-200').val()

    gun["200"]["JHP"] = {}
    gun["200"]["JHP"]["PEN"] = $('#jhp-pen-200').val()
    gun["200"]["JHP"]["DC"] = $('#jhp-dc-200').val()

    gun["200"]["AP"] = {}
    gun["200"]["AP"]["PEN"] = $('#ap-pen-200').val()
    gun["200"]["AP"]["DC"] = $('#ap-dc-200').val()

    gun["200"]["MA"] = $('#ma-200').val()
    gun["200"]["BA"] = $('#ba-200').val()
    gun["200"]["TOF"] = $('#tof-200').val()

    gun["300"]["FMJ"] = {}
    gun["300"]["FMJ"]["PEN"] = $('#fmj-pen-300').val()
    gun["300"]["FMJ"]["DC"] = $('#fmj-dc-300').val()

    gun["300"]["JHP"] = {}
    gun["300"]["JHP"]["PEN"] = $('#jhp-pen-300').val()
    gun["300"]["JHP"]["DC"] = $('#jhp-dc-300').val()

    gun["300"]["AP"] = {}
    gun["300"]["AP"]["PEN"] = $('#ap-pen-300').val()
    gun["300"]["AP"]["DC"] = $('#ap-dc-300').val()

    gun["300"]["MA"] = $('#ma-300').val()
    gun["300"]["BA"] = $('#ba-300').val()
    gun["300"]["TOF"] = $('#tof-300').val()

    gun["400"]["FMJ"] = {}
    gun["400"]["FMJ"]["PEN"] = $('#fmj-pen-400').val()
    gun["400"]["FMJ"]["DC"] = $('#fmj-dc-400').val()

    gun["400"]["JHP"] = {}
    gun["400"]["JHP"]["PEN"] = $('#jhp-pen-400').val()
    gun["400"]["JHP"]["DC"] = $('#jhp-dc-400').val()

    gun["400"]["AP"] = {}
    gun["400"]["AP"]["PEN"] = $('#ap-pen-400').val()
    gun["400"]["AP"]["DC"] = $('#ap-dc-400').val()

    gun["400"]["MA"] = $('#ma-400').val()
    gun["400"]["BA"] = $('#ba-400').val()
    gun["400"]["TOF"] = $('#tof-400').val()

    gun["Name"] = $('#name').val()
    gun["Type"] = $('#type').val()
    gun["Description"] = $('#description').val()
    gun["Image"] = ""
    gun["L"] = $('#length').val()
    gun["W"] = $('#weight').val()
    gun["RT"] = $('#reload-time').val()
    gun["ROF"] = $('#rate-of-fire').val()
    gun["Cap"] = $('#cap').val()
    gun["AW"] = $('#ammo-weight').val()
    gun["KD"] = $('#knockdown').val()
    gun["SAB"] = $('#sustained-auto-burst').val()

    gun["Aim Time"] = aimTime()

    $("#output").val(JSON.stringify(gun))

    console.log(JSON.stringify(gun));
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