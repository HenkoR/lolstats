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
    let newItem = data[key];
    newItem.pk = key;
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

let itemsList = [];
kayn.DDragon.Item.list()
  .callback(function (error, items) {
    itemsList = cleanStaticData(items.data);
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

    for (var i = 0; i < 5; i++) {

      let matchResult = await kayn.Match.get(matchList.matches[i].gameId);

      let matchStat = {
        gameId: null,
        win: null,
        duration: null,
        summonername: sum.name,
        spells: null,
        runes: null,
        champion: null,
        championUrl: null,
        champName: null,
        champlvl: null,
        kills: null,
        deaths: null,
        assists: null,
        items: [],
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

      let item0 = itemsList.find(function (element) {
        return element.pk == participant.stats.item0;
      });
      if (typeof item0 !== 'undefined' && item0) {
        matchStat.items.push({
          itemId: item0.pk,
          itemName: item0.name,
          itemImg: item0.image.full
        })
      }

      let item1 = itemsList.find(function (element) {
        return element.pk == participant.stats.item1;
      });
      if (typeof item1 !== 'undefined' && item1) {
        matchStat.items.push({
          itemId: item1.pk,
          itemName: item1.name,
          itemImg: item1.image.full
        })
      }
      let item2 = itemsList.find(function (element) {
        return element.pk == participant.stats.item2;
      });
      if (typeof item2 !== 'undefined' && item2) {
        matchStat.items.push({
          itemId: item2.pk,
          itemName: item2.name,
          itemImg: item2.image.full
        })
      }
      let item3 = itemsList.find(function (element) {
        return element.pk == participant.stats.item3;
      });
      if (typeof item3 !== 'undefined' && item3) {
        matchStat.items.push({
          itemId: item3.pk,
          itemName: item3.name,
          itemImg: item3.image.full
        })
      }
      let item4 = itemsList.find(function (element) {
        return element.pk == participant.stats.item4;
      });
      if (typeof item4 !== 'undefined' && item4) {
        matchStat.items.push({
          itemId: item4.pk,
          itemName: item4.name,
          itemImg: item4.image.full
        })
      }
      let item5 = itemsList.find(function (element) {
        return element.pk == participant.stats.item5;
      });
      if (typeof item5 !== 'undefined' && item5) {
        matchStat.items.push({
          itemId: item5.pk,
          itemName: item5.name,
          itemImg: item5.image.full
        })
      }
      let item6 = itemsList.find(function (element) {
        return element.pk == participant.stats.item6;
      });
      if (typeof item6 !== 'undefined' && item6) {
        matchStat.items.push({
          itemId: item6.pk,
          itemName: item6.name,
          itemImg: item6.image.full
        })
      }

      
      matchStat.gameId = matchResult.gameId;
      matchStat.win = participant.stats.win;
      matchStat.duration = matchResult.gameDuration;
      matchStat.champion = participant.championId;
      matchStat.championUrl = champion.image.full;
      matchStat.champName = champion.name;
      matchStat.champlvl = participant.stats.champLevel;
      matchStat.kills = participant.stats.kills;
      matchStat.deaths = participant.stats.deaths;
      matchStat.assists = participant.stats.assists;
      matchStat.kda = Number.parseFloat((participant.stats.kills + participant.stats.assists) / participant.stats.deaths).toPrecision(2);
      matchStat.cs = participant.stats.totalMinionsKilled + participant.stats.neutralMinionsKilled;
      matchStat.cspm = Number.parseFloat(matchStat.cs / (matchResult.gameDuration / 60)).toPrecision(2);
      matchStat.spells = [
        { spellId: participant.spell1Id, spellName: spell1.id, spellImg: spell1.image.full },
        { spellId: participant.spell2Id, spellName: spell2.id, spellImg: spell2.image.full },
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