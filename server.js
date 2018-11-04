const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

require('dotenv').config();

const port = process.env.PORT || 5000;
const riotToken = process.env.riotToken;

const { Kayn, REGIONS, BasicJSCache } = require('kayn')
const kayn = Kayn(riotToken)({
  region: REGIONS.NORTH_AMERICA,
  locale: 'en_US',
  debugOptions: {
    isEnabled: true,
    showKey: false,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
    burst: false,
    shouldExitOn403: false,
  },
  cacheOptions: {
    cache: new BasicJSCache({ max: 5000 }),
    timeToLives: {
      useDefault: true, // Cache DDragon by default!
    },
  }
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function cleanStaticData(data) {
  var res = Object.keys(data).map(key => {
    return data[key];
  });

  return res;
}

let spellsList = [];
kayn.DDragon.SummonerSpell.list()
  .callback(function (error, spells) {
    spellsList = cleanStaticData(spells.data);

  });

let championList = [];
kayn.DDragon.Champion.listDataByIdWithParentAsId()
  .callback(function (error, champions) {
    championList = cleanStaticData(champions.data);
  });
  

// API calls
app.get('/api/summoner', async (req, res) => {
  try {

    let sum = await kayn.Summoner.by.name(req.query.name)

    let matchList = await kayn.Matchlist.by.accountID(sum.accountId)

    let summonerStats = {
      summoner: sum.name,
      matches: []
    }

    for (var i = 0; i < 3; i++) {

      let matchResult = await kayn.Match.get(matchList.matches[i].gameId);

      let matchStat = {
        gameId: null,
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

      var spell1 = spellsList.find(function (element) {
        return element.key == participant.spell1Id;
      });

      var spell2 = spellsList.find(function (element) {
        return element.key == participant.spell2Id;
      });

      let champion = championList.find(function (element) {
        return element.id == participant.championId;
      });

      console.log(champion);
      matchStat.gameId = matchResult.gameId;
      matchStat.win = participant.stats.win;
      matchStat.duration = matchResult.gameDuration;
      matchStat.champion = participant.championId;
      matchStat.championUrl = participant.championId;
      matchStat.champlvl = participant.champLevel;
      matchStat.kills = participant.kills;
      matchStat.deaths = participant.deaths;
      matchStat.assists = participant.assists;
      matchStat.cs = participant.totalMinionsKilled + participant.neutralMinionsKilled;
      matchStat.cspm = matchStat.cs / (matchResult.gameDuration / 60)
      matchStat.spells = [
        { spellId: participant.spell1Id, spellName: spell1.id },
        { spellId: participant.spell2Id, spellName: spell2.id },
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