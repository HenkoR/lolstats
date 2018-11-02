const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const axios = require("axios");
const fs = require('fs');

require('dotenv').config();

const port = process.env.PORT || 5000;
const riotAPIUrl = "https://na1.api.riotgames.com";
const riotToken = process.env.riotToken;

const riotAPI = axios.create({
  baseURL: riotAPIUrl,
  headers: { 'X-Riot-Token': riotToken }
});

const spellsFile = JSON.parse(fs.readFileSync('../static_data/summoner.json', 'utf8'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function getSummoner(name) {
  try {
    const response = await riotAPI.get('/lol/summoner/v3/summoners/by-name/' + encodeURIComponent(name));
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getMatches(accId) {
  try {
    const response = await riotAPI.get('/lol/match/v3/matchlists/by-account/' + encodeURIComponent(accId));
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

async function getMatchesResults(matchId) {
  try {
    const response = await riotAPI.get('/lol/match/v3/matches/' + encodeURIComponent(matchId));
    const data = response.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}


var spells = [];

function getSpells(obj, name) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if ("object" == typeof (obj[key])) {
        getSpells(obj[key], name);
      } else if (key == name) {
        spells.push(obj[key]);
      }
    }
  }
}



// API calls
app.get('/api/summoner', async (req, res) => {
  try {
    let sum = await getSummoner(req.query.name);

    let matchList = await getMatches(sum.accountId);

    let summonerStats = {
      summoner: sum,
      matches: []
    }

    for (var i = 0; i < 3; i++) {
      let matchResult = await getMatchesResults(matchList.matches[i].gameId);

      let matchStat = {
        win: null,
        duration: null,
        summonername: sum.name,
        spells: null,
        runes: null,
        champion: null,
        kills: null,
        deaths: null,
        assists: null,
        items: null,
        champlvl: null,
        cs: null,
        cspm: null
      }

      let participantId = matchResult.participantIdentities.find(function (element) {
        return element.player.accountId == sum.accountId;
      }).participantId;

      let participant = matchResult.participants.find(function (element) {
        return element.participantId == participantId;
      });



      getSpells(spellsFile, "key");
      console.log("result: " + result.join(", "));


      matchStat.win = participant.stats.win;
      matchStat.duration = matchResult.gameDuration;
      matchStat.champion = participant.championId;
      matchStat.champlvl = participant.champLevel;
      matchStat.kills = participant.kills;
      matchStat.deaths = participant.deaths;
      matchStat.assists = participant.assists;
      matchStat.cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
      matchStat.cspm = matchStat.cs / (matchResult.gameDuration / 60)
      matchStat.spells = [
        { spellId: participant.spell1Id, spellName: '' },
        { spellId: participant.spell2Id, spellName: '' },
      ];
      matchStat.runes = [
        {
          runeId: participant.perk0,
          runeName: ''
        },
        {
          runeId: participant.perk1,
          runeName: ''
        },
        {
          runeId: participant.perk2,
          runeName: ''
        },
        {
          runeId: participant.perk3,
          runeName: ''
        },
        {
          runeId: participant.perk4,
          runeName: ''
        },
        {
          runeId: participant.perk5,
          runeName: ''
        }
      ];
      matchStat.items = [
        {
          itemId: participant.item0,
          itemName: ''
        },
        {
          itemId: participant.item1,
          itemName: ''
        },
        {
          itemId: participant.item2,
          itemName: ''
        },
        {
          itemId: participant.item3,
          itemName: ''
        },
        {
          itemId: participant.item4,
          itemName: ''
        },
        {
          itemId: participant.item5,
          itemName: ''
        },
        {
          itemId: participant.item6,
          itemName: ''
        }
      ];

      summonerStats.matches.push(matchStat);

    }

    res.send({ summonerStats: JSON.stringify(summonerStats) });
  }
  catch (err) {
    console.error(err);
    res.status(500).send({ error: "boo :(" });
  }

});

if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.listen(port, () => console.log(`Listening on port ${port}`));