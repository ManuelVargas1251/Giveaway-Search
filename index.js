console.log("--starting server--")

const express = require('express')
const app = express()
const Crawler = require("crawler");
const path = require('path')
const preURL = 'https://www.'




const c = new Crawler({
  maxConnections: 10,
  // deafult callback function
  callback: function (error, res, done) {
    if (error) {
      console.log(error);
    } else {
      var $ = res.$;
      // $ is Cheerio by default
      //a lean implementation of core jQuery designed specifically for the server
      console.log($("title").text());
    }
    done();
  }
});

app.get('/client.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/client.js'));
});

// Homepage Router
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

// Username Router and Handler
app.get('/search', function (req, res) {

  let username = Object.keys(req.query)[0]
  if (username === undefined || username === '') {
    console.error('no name')
  }

  //crawl with the username!
  // Queue just one URL, with default callback
  //c.queue(preURL + 'amazon.com' + '')

  c.queue([{
    uri: preURL + 'instagram.com' + '/' + username,
    // The global callback won't be called
    callback: function (error, jq, done) {
      console.log('--begin crawl response--')
      if (error) {
        console.log(error);
      } else {
        //reponse from 
        let $ = jq.$,
          title = $("title").text()


        console.log(title);
        console.log('Grabbed', jq.body.length, 'bytes');

        if (title.includes('Page Not Found')) {
          console.log('page not found')
          res.send('❌')
        } else {
          res.send('✔')
        }
      }
      console.log('--end crawl response--')
      res.end()
      done();
    }
  }])
  // if URL resolves, send check
  //res.send("✔")

  //else DNE or Private
  //res.send("❌")


})


app.listen(process.env.PORT || 3000)
console.log("--ready to search--")
