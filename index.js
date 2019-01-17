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

// Client-Side JS Router
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

  c.queue([{
    uri: preURL + 'instagram.com/' + username,
    // The global callback won't be called
    callback: function (error, ch, done) {
      console.log('--begin crawl response--')
      if (error) {
        console.log(error);
      } else {
        let $ = ch.$

        let title = $('title').text()

        console.log(title)
        //console.log('$body: ' + $videos)
        //$body.addClass('myclass')
        // console.log($('body').attr('class'))
        // console.log($('body').children()[0].children[0] )
        
          let search = $('div[class=v1Nh3]').html()//.children()[0]

          //search = JSON.stringify(search)

          console.log(search)//._root[0].children[0])
        
        // console.log(
        //   'BODDY::',
        //   $('article > div > div > div > div > a').attr('href'),
        //   '::BODDY'
        // )

        if (title.includes('Page Not Found')) {
          //console.warn('page not found')
          res.send('❌ Page Not Found')
        } else {
          res.send('✔')
        }
      }
      console.log('--end crawl response--')
      res.end()
      done();
    }
  }])
})


app.listen(process.env.PORT || 3000)
console.log("--ready to search--")
