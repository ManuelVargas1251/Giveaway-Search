console.log("--starting server--")

const express = require('express')
const app = express()
const path = require('path')

//low db
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

// Client-Side JS Router
app.get('/client.js', function (req, res) {
    res.sendFile(path.join(__dirname + '/client.js'));
});

// Homepage Router
//routes the url to index.html
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'))
})

// Username Router and Handler
app.get('/search', function (req, res) {
    console.log('---server search---')
    let username = Object.keys(req.query)[0];
    if (username === undefined || username === '') {
        console.error('no name');
    }

    searchProfile(username, 'https://www.instagram.com/' + username);
    res.send('✔')
});

// send all profiles to client UI
app.get('/getProfiles', function (reg, res) {
    console.log('-- getting profiles --')
    const state = db.getState()
    const str = JSON.stringify(state["profile"], null, 2)
    console.log(str)
    res.send(str)
})

app.listen(process.env.PORT || 3000)
console.log("--ready to search--")


const puppeteer = require('puppeteer');
const stripHtml = require("string-strip-html");

// (async () => {
//     searchProfile(name, 'https://www.instagram.com/' + name)
// })();

// this is an async function/ use to separate your code to methods
async function searchProfile(name, profileUrl) {
    console.log('-- searchProfile --')

    db.defaults({
        profile: [],
        posts: []
    })
        .write()

    //open browser page
    const browser = await puppeteer.launch({
        headless: false
        , slowMo: 20
    })
    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 });


    const preSelector = '#react-root > section > main > div > div._2z6nI > article > div:nth-child(1) > div > div:nth-child('
    const midSelector = ') > div:nth-child('
    const postSelector = ') > a'

    const captionSelector = '#react-root > section > main > div > div > article > div.eo2As > div.KlCQn.G14m-.EtaWk > ul > li:nth-child(1) > div > div > div > span'

    const instagramPosts = []
    const instagramCaption = []
    let postCount = 0


    // get all urls from each posts on the profile page
    await page.goto(profileUrl)

    //search lowdb profile, if url exists, do not store
    //continue to saving non-duplicate posts with profileURL of url

    let findProfile = db.get('profile')
        .find({ url: profileUrl })
        .value()

    // if URL not found, add to db
    if (findProfile == undefined) {
        //profile url not found in db
        //Add a profile
        try {
            db.get('profile')
                .push({
                    name: name,
                    url: profileUrl
                })
                .write()
        } catch (error) {
            console.log(error)
        }

    }

    // grab profile posts
    for (i = 1; i <= 3; i++) {
        for (k = 1; k <= 3; k++) {

            try {   //retrieve post urls
                instagramPosts[postCount] = await page.$eval(
                    preSelector + i + midSelector + k + postSelector,
                    el => el.href
                )
            } catch (error) {
                console.log(error + ' selector may have been updated')
            }
            //console.log('postCount: ' + postCount)
            //console.log('kCount: ' + k)
            postCount++
        }
        //console.log('iCount: ' + i)
    }
    //console.log('instagramPosts: ' + instagramPosts)
    //console.log(instagramPosts.length + ' urls parsed')


    // get all post captions by visiting each post page
    // I could most likely just click on each post, that would save a load as the page uses ajax
    for (i = 0; i <= 8; i++) {
        console.log('grabbing post caption' + i)
        console.log('instagram posts: ' + instagramPosts[i])

        await page.goto(instagramPosts[i])
        //await page.screenshot({ path: 'instaPost' + i + '.png' });

        try {
            instagramCaption[i] = await page.$eval(
                captionSelector,
                el => el.outerHTML
            )
        } catch (error) {
            console.log(error + ' selector may have been updated')
        }

        //check if post is already in db
        let findPost = db.get('posts')
            .find({ url: instagramPosts[i] })
            .value()
        //if post is undefined, save to db
        if (findPost == undefined && instagramCaption[i].indexOf('giveaway') != -1) {

            //test if caption contains keywords?
            //only save if post has keywords, 'giveaway'

            // save to database
            try {
                db.get('posts')
                    .push({
                        profileUrl: profileUrl,
                        url: instagramPosts[i],
                        caption: stripHtml(instagramCaption[i])
                    })
                    .write()
            } catch (error) {
                console.log(error)
            }
        }


        console.log('iCount: ' + i)
    }
    //console.log('caption: ' + stripHtml(instagramCaption))
    console.log('-- complete --')
    await browser.close()
}
