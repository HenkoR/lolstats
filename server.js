const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const https = require('https');
require('dotenv').config();


const port = process.env.PORT || 5000;
const riotAPI = "na1.api.riotgames.com";
const riotToken = process.env.riotToken;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API calls
app.get('/api/summoner', (req, res) => {
  var options = {
    host: riotAPI,
    port: 443,
    path: '/lol/summoner/v3/summoners/by-name/'+encodeURIComponent(req.query.name),
    method: 'GET',
    headers: {
      'X-Riot-Token': riotToken
    }
  };

  https.request(options, function(response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      res.send({ summoner: chunk });
    });
    response.on('error', (e) => {
      console.error(e);
      res.status(500).send({ error: "boo:(" });
    });
  }).end(); 

});

app.post('/api/summoner', (req, res) => {
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.summoner}`,
  );
});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));