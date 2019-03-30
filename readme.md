# Giveaway Search

Node server to auto enter into giveaways on Instagram. Using Google's [Puppeteer](https://developers.google.com/web/tools/puppeteer/) to control headless Chromium.

https://giveawaysearch.herokuapp.com/

### Start Local Server
Must update heroku connection string
```
npm install
nodemon index
```
### View Logs
```
heroku logs --tail -a giveawaysearch
```
### Postgres Console

```
heroku login
heroku pg:psql -a giveawaysearch
```

future plan is to use amazon turk to analyze the caption texts