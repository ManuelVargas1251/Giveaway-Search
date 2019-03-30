console.log("--starting server--")

const express = require('express')
const app = express()
const path = require('path')
const moment = require('moment');

// Postgres
const { Pool } = require('pg');
const pool = new Pool(
    {
        connectionString: process.env.DATABASE_URL,
        ssl: true
    }
);

// Routers
// routes the url to index.html
app
    // Homepage Router
    .get('/', function (req, res) {
        res.sendFile(path.join(__dirname + '/index.html'))
    })
    // Client-Side JS Router
    .get('/client.js', function (req, res) {
        res.sendFile(path.join(__dirname + '/client.js'));
    })
    // Username Router
    .get('/search', function (req, res) {
        console.log('---server search---')
        let username = Object.keys(req.query)[0]

        console.log('username: ' + username)
        if (username != undefined || username != '' || username != null) {
            searchProfile(username, 'https://www.instagram.com/' + username);
            res.send(`<div class="alert alert-primary" role="alert">✔ Submitted, scanning, will show profile in list</div>`)
        }
        console.error('no name');
    })
    // Profile Router
    .get('/getProfiles', async (req, res) => {
        try {
            const client = await pool.connect()
            const result = await client.query('SELECT name FROM profiles');
            const results = { 'results': (result) ? result.rows : null };
            //res.render('pages/db', results);
            console.log(results)
            res.json(results);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })
    .get('/getPosts', async (req, res) => {
        console.log('getPosts!!--🌏')
        let id = Object.keys(req.query)[0]
        console.log(id)

        try {
            const client = await pool.connect()
            const result = await client.query({
                text: `
            SELECT caption 
            FROM posts 
            WHERE profile_url = $1`, values: [id]
            });
            const results = { 'results': (result) ? result.rows : null };
            //res.render('pages/db', results);
            console.log(results)
            res.json(results);
            client.release();
        } catch (err) {
            console.error(err);
            res.send("Error " + err);
        }
    })


// start server
app.listen(process.env.PORT || 3000, () => {
    console.log("--server ready--")
})

const puppeteer = require('puppeteer');
const stripHtml = require("string-strip-html");

async function insertPost(url, caption, profileUrl) {
    console.log('--- insertPost ---')
    let results
    //check if post is already in db
    try {
        const client = await pool.connect()
        const result = await client.query({
            text: `
            SELECT COUNT(*)
            FROM posts 
            WHERE url = $1`,
            values: [url]
        });

        results = result["rows"][0].count
        console.log('db posts result: ' + result["rows"][0].count)

        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }

    //test if caption contains keywords?
    //only save if post has keywords, 'giveaway'
    if (results == 0 && caption.indexOf('giveaway') != -1) {

        // console.log('profile ' + name + ' not found in db, inserting to db')
        try {
            const client = await pool.connect()
            const result = await client.query({
                text: `
                INSERT INTO posts(url,profile_url,caption,create_date) 
                VALUES($1, $2, $3, $4)
                `,
                values: [url, profileUrl, stripHtml(caption), moment().format()]
            });
            console.log("insertResult:" + JSON.stringify(result))
        } catch (error) {
            console.error(error);
        }
    }
}

async function insertProfile(name, profileURL) {
    console.log('--- insertProfile ---')

    let results
    // search if profile is already in DB
    try {
        const client = await pool.connect()
        const result = await client.query({
            text: `
            SELECT COUNT(*)
            FROM profiles 
            WHERE url = $1`,
            values: [profileURL]
        });

        results = result["rows"][0].count
        //console.log('profileResult: ' + result["rows"][0].count)

        client.release();
    } catch (err) {
        console.error(err);
        res.send("Error " + err);
    }

    // if profile url not found, insert in DB
    if (results == 0) {
        // console.log('profile ' + name + ' not found in db, inserting to db')
        try {
            const client = await pool.connect()
            const result = await client.query({
                text: `
                INSERT INTO profiles(name, url, create_date) 
                VALUES($1, $2, $3)`,
                values: [name, profileURL, moment().format()]
            });
            console.log("::Insert::Result::" + JSON.stringify(result))
        } catch (error) {
            console.error(error);
        }
    }
    // console.log('--- profileInsert--end ---')
}

// this is an async function/ use to separate your code to methods
async function searchProfile(name, profileUrl) {
    console.log('-- searchProfile --')

    //open browser page
    const browser = await puppeteer.launch({
        headless: true
        , args: ['--no-sandbox']
        //, slowMo: 20
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

    await page.goto(profileUrl)

    //insert to db, no dups
    insertProfile(name, profileUrl)

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

        insertPost(instagramPosts[i], instagramCaption[i], name)


        console.log('iCount: ' + i)
    }
    console.log('-- complete --')
    //await browser.close()
}
