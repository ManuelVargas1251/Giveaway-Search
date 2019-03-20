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
                        <button type="button" class="btn btn-primary" disabled><i class="fas fa-sync-alt"></i></button>
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
        let list = '<div class="accordion" id="accordionExample">'
        // .concat('<ul class="list-group">')
        for (i = 0; profileLength > i; i++) {
            let profileName = JSON.stringify(profiles["results"][i].name).replace(/['"]+/g, '')
            list = list.concat(`
            <div class="card">
                <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                        <button class="btn btn-link" type="button" aria-expanded="true" aria-controls="collapseOne">`)
                .concat('@<a href="https://www.instagram.com/' + profileName + '/" target="_blank" style="font-weight: bold;">' + profileName)
                .concat(`</a > 
                        </button>
                        <div class="btn-group fa-pull-right" role="group" aria-label="button group">
                            <button id="viewPosts" type="button" class="btn btn-primary" data-toggle="collapse" data-target="#collapseOne" aria-expanded="false"><i class="fas fa-book"></i></button>
                            <button type="button" class="btn btn-success" disabled><i class="fas fa-sync-alt"></i></button>
                        </div>
                    </h2>
                </div>
                <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                <div class="card-body">
                    <div id="postList"></div>
                </div>
                </div>
            </div>
              `).concat('</li>')
        }
        //list = list.concat('</ul>')
        list = list.concat('</div')
        //console.log(list)
        return list
    })
})