let express = require('express')
let app = express()
let Crawler = require("crawler");
const path = require('path')

console.log("--starting server--")
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

// Handle the username being sent over
app.get('/search', function (req, res) {
  //res.sendFile(path.join(__dirname + '/index.html'))
  console.log(Object.keys(req.query)[0])

  //crawl with the username!
})

app.listen(3000)



let c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
        }
        done();
    }
});
console.log("--ready to search--")

// Queue just one URL, with default callback
c.queue('https://www.amazon.com');


