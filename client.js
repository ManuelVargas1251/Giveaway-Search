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


    // call the rest of the code and have it execute after 3 seconds
    setTimeout(() => {
        console.log('recalling profiles!')

        // REloads profiles from db
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
                    let profileName = JSON.stringify(profiles["results"][i].name).replace(/['"]+/g, '')
                    list = list
                        .concat('<li class="list-group-item">')
                        .concat('@')
                        .concat('<a href="https://www.instagram.com/' + profileName + '/" target="_blank">')
                        .concat(profileName)
                        .concat('</a>')
                        .concat(
                            `<div class="btn-group fa-pull-right" role="group" aria-label="Basic example">
                        <button id="viewPosts" type="button" class="btn btn-primary">View Posts</button>
                        <button type="button" class="btn btn-primary" disabled>Re-Sync</button>
                        <button type="button" class="btn btn-danger" disabled>Delete</button>
                    </div>`
                        )
                        .concat('</li>')
                }
                list = list.concat('</ul>')
                //console.log(list)
                return list
            })
        })
    }, 6000);
})

// when pressing enter, prevent page reload and trigger click
$('input[type=text]').on('keypress', function (e) {
    if (e.which == 13) {
        e.preventDefault()
        $('#search').trigger('click')
    }
})

$('#viewPosts').click(() => { console.log('--- view posts ---') })

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
            let profileName = JSON.stringify(profiles["results"][i].name).replace(/['"]+/g, '')
            list = list
                .concat('<li class="list-group-item">')
                .concat('@')
                .concat('<a href="https://www.instagram.com/' + profileName + '/" target="_blank">')
                .concat(profileName)
                .concat('</a>')
                .concat(
                    `<div class="btn-group fa-pull-right" role="group" aria-label="Basic example">
                        <button id="viewPosts" type="button" class="btn btn-primary">View Posts</button>
                        <button type="button" class="btn btn-primary" disabled>Re-Sync</button>
                        <button type="button" class="btn btn-danger" disabled>Delete</button>
                    </div>`
                )
                .concat('</li>')
        }
        list = list.concat('</ul>')
        //console.log(list)
        return list
    })
})