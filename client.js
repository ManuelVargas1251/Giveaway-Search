// Submit Button Event Handler
$('#search').click(function () {
    // saves username
    let username = $('#username').val()

    // Send Request & load Response to DOM
    $('#response').load('/search', username, function (response, status) {
        if (status != 'success') { console.error(status) }
        console.log('response: ' + response)
    })
    //clears form input
    $('#myForm')[0].reset()
})

// when pressing enter, prevent page reload and trigger click
$('input[type=text]').on('keypress', function (e) {
    if (e.which == 13) {
        e.preventDefault()
        $('#search').trigger('click')
    }
})

// loads profiles from db
$('#profiles').load('/getProfiles', function (response, status) {
    if (status != 'success') { console.error(status) }
    console.log('response: ' + response)
    let profiles = JSON.parse(response)
    let profileLength = profiles["results"].length
    console.log('response: ' + profiles)
    //console.log('profiles len: ' + profiles.length)
    //console.log('profiles: ' + profiles[0])

    $('#profiles').html(function () {
        let list = '<ul class="list-group">'

        for (i = 0; profileLength > i; i++) {
            list = list.concat('<li class="list-group-item">')
                .concat('@')
                .concat(JSON.stringify(profiles["results"][i].name).replace(/['"]+/g, ''))
                .concat(`<i class="fas fa-sync-alt fa-spin fa-pull-right"></i>`
                )
                .concat('</li>')
        }
        list = list.concat('</ul>')
        //console.log(list)
        return list
    })
})