var express = require('express');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");

const app = express();

// TODO: Enter the path to your service account json file
// Need help with this step go here: https://firebase.google.com/docs/admin/setup

// TODO: Enter your database url from firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'madden-germany-exporter',
    clientEmail: 'firebase-adminsdk-4bosa@madden-germany-exporter.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCT6eBZc6A/JKOv\nmN5aSCQi7Hczq+4/rPjfybuPSPoqIDJngWOfHtNxXuBby63pmSsCUECLo3iNy+c7\n3Whb09j0y7XNZ6XnDBN+LSBjpjySW5Z2f//oXpJfCq+10kZYnlc4EogkOKz1Qhf/\nyp827QgM4Guj9OuilbxeGCdJJhpDCcqAp+QK3T6wB0+qXpTlbFNtNhCR6/8ICs8G\ndmF/AGVGijRwIBvk90Tv0q0acj1te/TttDqMqcbsqzn3lvcadUsfH8+K9ebbWp+F\nDrIRROvKeyhU/HEOEox5GznYPdcqlJQ8H2U3G3OYXmsef5lprclUPDEoSA2PvmVB\noQa/DVZtAgMBAAECggEAFQtaJlfvVXSEzmOxRQaND6P1nLYqPkiBmzNkOlFfeFVe\n3n+X+ShlXHSrdpv+uSTX6+sXl9Zw/Tmkw01vvtrf/AosqlYEEmCTOGk6ubrJ1Ofv\nexoggoLMD/YhBD0v0YVrstheIssmfnmCGRxOtT2Znt1iKzBaQyZLJ9cHZd6kL2PS\nh52kuEsoP4ZPhy6Iilfrz0Mh7reQ5ifzw+3YQP8gHRiEZ9u4uPtMmiiMAPfckWml\n3s/CSYWhQQoce+HRi6iQsizAurbbyuv5M3D+kpGl+uxg2WMsOTY8ulVl/4EYH159\nNV2utvqJoZlNagj79k4+nmjUkmOszzln5cbmhSEwAQKBgQDNCN8BjK9SRC/5AEts\nGBL/j3B1GpP+YBg+P1/chI9RMBeArqrm2SMZuBTag5O4ffNp9NTAOROyxnLoq0BM\nvUtClnIHS1Axe16Az/0tVJAGFdStbKd7FhAbzVIAku1PQxE1FitAEj4nqoR0NVW3\ndH8Juaz8PEArbV1pimfNJE6QAQKBgQC4riz9wfoLrJJ/81EneVR2vIEpqwrIB7/+\nu4a5ZRFReL3D0Ee7byzXGk4qE0CTKek/EPYgMJ/MExLY6e4zOOnOQOJ4t+msg04+\nAjgkDvamv6uuqQv9DG40K95M3qEWjKBQdPBOVhP2xBK6WxJP9pA8xmnsRrAxSmjc\nDgPn0joGbQKBgBrxY3yspA1HcJZj94VI1JZInxqEV5ZBwm3Lnik4Mi0VCMGcMlEL\nj5U9n1/nkm3X/ziZN6va1D/V3Bu/BUAQT+d8JZfXyb323EBJFJf0WMiz7bKsaIXA\nLHW60V/J7u1Pft9e/mf4/bnwql8q8wycfmUkxRqQQE50nKXVzjYi40ABAoGBAK0E\nUJYzomRJer5wX7lRi/XpSECXQ3R+/jpRyTfrHbxsF6xZdrp8v0+OD2iPvNGiVCiH\nZW5m3246+E9LaaOHUFOwqftaoYrDQQwK3Dm74wv5SYhKSzb47E3oQ01UzSno+VAn\nHfLl5bIrozf/ljpfzmWBpT58QxkKkw6F+ta2NzJJAoGBAI6RUAVWnvAJS1eRkgFb\n2viRKXVdvuFo4WWk+jy5NLjx8LuQRwntdNNIXS7vezGIur/TzUvmGRwN3lYpLAj9\nZyr8Hs1yNzamIj1HjC4CGAmTCewSEAIQmYhb5w8GLg3Dzv+6VbbnI3z5F5xB3W4T\n6re1tFgtajwLjC1j0XfkOwgY\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: "https://madden-germany-exporter.firebaseio.com"
});


app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.post('*', (req, res) => {
  console.log(req.url);
  res.sendStatus(200);
});

app.post('/:username/:platform/:leagueId/leagueteams', (req, res) => {
  const db = admin.database();
  const ref = db.ref();
  const { params: { username, leagueId }, body: { leagueTeamInfoList: teams } } = req;

  teams.forEach(team => {
    const teamRef = ref.child(`data/${username}/${leagueId}/teams/${team.teamId}`);
    teamRef.update(team);
  });

  res.sendStatus(200);
});

app.post('/:username/:platform/:leagueId/standings', (req, res) => {
  const db = admin.database();
  const ref = db.ref();
  const { params: { username, leagueId }, body: { teamStandingInfoList: teams } } = req;

  teams.forEach(team => {
    const teamRef = ref.child(`data/${username}/${leagueId}/teams/${team.teamId}`);
    teamRef.update(team);
  })

  res.sendStatus(200);
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

app.post('/:username/:platform/:leagueId/week/:weekType/:weekNumber/:dataType', (req, res) => {
  const db = admin.database();
  const ref = db.ref();
  const { params: { username, leagueId, weekType, weekNumber, dataType } } = req;
  const dataRef = ref.child(`data/${username}/${leagueId}/week/${weekType}/${weekNumber}/${dataType}`);

  // "defense", "kicking", "passing", "punting", "receiving", "rushing"

  switch (dataType) {
    case 'schedules': {
      const weekRef = ref.child(`data/${username}/${leagueId}/schedules/${weekType}/${weekNumber}`);
      const { body: { gameScheduleInfoList: schedules } } = req;
      dataRef.set(schedules);
      break;
    }
    case 'teamstats': {
      const { body: { teamStatInfoList: teamStats } } = req;
      teamStats.forEach(stat => {
        const weekRef = ref.child(`data/${username}/${leagueId}/stats/${stat.teamId}/team-stats/${weekType}/${weekNumber}`);
        weekRef.set(stat);
      })
      break;
    }
    case 'defense': {
      const { body: { playerDefensiveStatInfoList: defensiveStats } } = req;
      defensiveStats.forEach(stat => {
        const weekRef = ref.child(`data/${username}/${leagueId}/stats/${stat.teamId}/player-stats/${stat.rosterId}/${weekType}/${weekNumber}`);
        weekRef.update(stat);
      })
      break;
    }
    default: {
      const { body } = req;
      const property = `player${capitalizeFirstLetter(dataType)}StatInfoList`;
      const stats = body[property];
      stats.forEach(stat => {
        const weekRef = ref.child(`data/${username}/${leagueId}/stats/${stat.teamId}/player-stats/${stat.rosterId}/${weekType}/${weekNumber}`);
        weekRef.update(stat);
      })
      break;
    }
  }

  res.sendStatus(200);
});

// ROSTERS

app.post('/:username/:platform/:leagueId/freeagents/roster', (req, res) => {
  res.sendStatus(200);
});

app.post('/:username/:platform/:leagueId/team/:teamId/roster', (req, res) => {
  const db = admin.database();
  const ref = db.ref();
  const { params: { username, leagueId, teamId }, body: { rosterInfoList } } = req;
  const dataRef = ref.child(`data/${username}/${leagueId}/teams/${teamId}/roster`);
  const players = {};
  rosterInfoList.forEach(player => {
    players[player.rosterId] = player;
  });
  dataRef.set(players, (error) => {
    if (error) {
      console.log("Data could not be saved." + error);
    } else {
      console.log("Data saved successfully.");
    }
  });
  res.sendStatus(200);
});

app.listen(app.get('port'), function () { return console.log('Madden Data is running on port', app.get('port')) });
