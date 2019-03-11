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
    console.log('response: ' + response)
})