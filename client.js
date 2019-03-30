localStorage.clear()

// Submit Button Event Handler
$('#search').click(function () {
    $('#username').removeClass('is-invalid')
    // saves username
    let username = $('#username').val()
    console.log('undefined??: ' + username)
    if (username != undefined && username != '') {
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
            getProfiles()
        }, 6000);
    } else {
        console.log('undefined!!')
        $('#username').addClass('is-invalid')
        //$('#emailHelp').text('is-invalid')
    }
})

// when pressing enter, prevent page reload and trigger click
$('input[type=text]').on('keypress', function (e) {
    if (e.which == 13) {
        e.preventDefault()
        $('#search').trigger('click')
    }
});

//call function on page init
getProfiles()
function getProfiles() {
    // loads profiles from db
    $('#profiles').load('/getProfiles', function (response, status) {
        if (status != 'success') { console.error(status) }
        //console.log('response: ' + response)
        let profiles = JSON.parse(response)["results"]
        let profileLength = profiles.length
        // console.log('response: ' + profiles)
        //console.log('profiles len: ' + profileLength)

        $('#profiles').html(function () {
            let html = '<div class="accordion" id="profilesAccordion">'

            profiles.forEach(function (profile, i) {
                let profileName = JSON.stringify(profile.name).replace(/['"]+/g, '')
                html = html.concat(`
                <div class="card">
                    <div class="card-header" id="headingOne">
                        <h2 class="mb-0">
                            <button class="btn btn-link" type="button" aria-expanded="true" aria-controls="collapseOne">`)
                    .concat('@<a href="https://www.instagram.com/' + profileName + '/" target="_blank" style="font-weight: bold;">' + profileName)
                    .concat(`</a > 
                            </button>
                            <div class="btn-group fa-pull-right" role="group" aria-label="button group">
                                <button id="`+ profileName + `" type="button" class="btn btn-primary viewPosts" data-toggle="collapse" data-target="#collapse-` + i + `" aria-expanded="false">
                                    <i class="fas fa-book"></i>
                                </button>
                                <button type="button" class="btn btn-success" disabled>
                                    <i class="fas fa-sync-alt"></i>
                                </button>
                            </div>
                        </h2>
                    </div>
                    <div id="collapse-`+ i + `" class="collapse" aria-labelledby="headingOne" data-parent="#profilesAccordion">
                        <div class="card-body">
                            <div id="postList">
                                <div class="d-flex justify-content-center">
                                    <div class="spinner-grow text-primary" style="width: 5rem; height: 5rem;" role="status">
                                        <span class="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`)
                    .concat(`
                <script>
                </script>
            </div>`)
            })
            //console.log(list)
            return html
        })
    })
}


// get posts from profile that was clicked
$('#profiles').on('click', '.viewPosts', function () {
    let profileName = $(this).attr('id'),
        posts = []

    if (localStorage.getItem('posts') == null) {
        localStorage.setItem('posts', []);
    }
    else {
        // posts = Array.from(localStorage.getItem('posts')) 
        posts = JSON.parse(localStorage.getItem('posts'))
        console.log('posts: ' + posts)
    }

    if (posts.includes(profileName)) {
        console.warn('posts found in localStorage - not sending request')
    } else {
        // if profile not found, adding to local storage and searching db
        posts.push(profileName)
        localStorage.setItem('posts', JSON.stringify(posts))

        $(this).closest('.card-header').next().children('.card-body').children().load('/getPosts', profileName, function (response, status) {
            if (status != 'success') { console.error(status) }
            //console.log('response: ' + response)

            if (response === '{"results":[]}') {
                $(this).html(function () { return `<strong>no results found</strong>` })
            } else {
                let posts = JSON.parse(response)["results"]
                let postsLength = posts.length

                console.log('post len: ' + postsLength)

                $(this).html(function () {
                    let html = `<div class="accordion" id="postsAccordian">`
                    posts.forEach(function (post, i) {
                        console.log('for lopp')
                        // let profileName = JSON.stringify(profiles["results"][i].name).replace(/['"]+/g, '')
                        // html = html.concat('<strong>post: </strong>')
                        html = html.concat(`
                        <div class="card">
                            <div class="card-header" id="headingOne">
                            <h2 class="mb-0">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                Collapsible Group Item #1
                                </button>
                            </h2>
                            </div>

                            <div id="collapseOne" class="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                            <div class="card-body">
                                Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                            </div>
                            </div>
                        </div>
                        `)
                    })
                    html = html.concat('</div>')
                    return html
                })
            }
        })
    }
})
