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

$('#profiles').load('/getProfiles', function (response, status) {
    if (status != 'success') { console.error(status) }
    //console.log('response: ' + response)
    //console.log('response: ' + response)
    let profiles = JSON.parse(response);//response;//

    //console.log('profiles len: ' + profiles.length)
    let profileLength = profiles.length
    //console.log('profiles: ' + profiles[0])


    $('#profiles').html(function () {
        let list = ''

        for (i = 0; profileLength > i; i++) {
            list = list.concat('<ul class="list-group">')
            list = list.concat('<li class="list-group-item">')
            list = list.concat(JSON.stringify(profiles[i].name).replace(/['"]+/g, ''))
            list = list.concat('</li>')
            list = list.concat('</ul>')
        }

        console.log(list)
        return list
    })

})