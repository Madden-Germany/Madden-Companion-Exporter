var express = require('express');
var bodyParser = require('body-parser');
var admin = require("firebase-admin");

const app = express();

// TODO: Enter the path to your service account json file
// Need help with this step go here: https://firebase.google.com/docs/admin/setup

// TODO: Enter your database url from firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'madden-germany-18-exporter',
    clientEmail: 'firebase-adminsdk-80dfa@madden-germany-18-exporter.iam.gserviceaccount.com',
    privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzlMOIy9Ed+2/v\n6jbjQQHWjjKrh5zEFTJdOQx/wG1Hnt02tgoMOLoBRaD5H00BnL1rz9DjntsvvKPB\nQbf2jVduJ0fqA4Tw1YekDlxwitU7e2cxFeT5Z2YePDkS+ndoq7TxxRDGETgBwgis\npOWthyFlrmJ6KmSVEbSfWkgGR4mhVGh7hiDgSju0F6E+oew2aD5DUfqCL59tkZ6O\nTnul06tzemKt8WuErIsP398qnpyyRZ41vg5t8WYHTcpCywupldQ418BFr1b8Yeg5\n+U564hFWUdjOvBUFVrJFHwSiG0cWrwSFdSbJ3dR5x6d/4cdZ49FRwW+cF11Cjsjg\nJ0hrkSNdAgMBAAECggEAMI4wsHQrfqfVhFEXtiqFjLW2DZsFUB9LFtmt/3zQD2Vs\n+rYN0XAlGuLwu2szLxRqQxRVrrXtHeMrg715ODjPQwFr+GIrN9MEcd9QLz3amdKr\n/CGnX6gNfG9cHz2Ju8txiU13U5akRhVoswWC9IBtD0kvZ0i/GW9IHy4R+2CsXeo4\nmxhy9MaZPxRyrwdAoOUPc8FwEN9x7FYZnI3e1MThodYBleQ4ZnnKy0ufWVuwsVVe\n5ZWmRxOflIZgUvDswTBHJideIA+J4fyzXii09pn8Cw9kINAQ5jN2xuUU/lJezfR+\nnlFozq31nCzLMmssVFV40IrBuptrcAu79nxjEA7DIQKBgQDh2XIz/0hNneWd2N8V\nFCH/DJ9ki/SaOhBUcfr/mp5tdeel33zFkXYcOLMUrrhMNYLS8m9tSVdo4gusM9Kt\n5Ykr3qq12cq9TBjvgifv8gFTXMFH4c9qw0Xiw1xkC3Vw7WotRdJgxoKGrVphuaKk\nCWNFGIbDYvSeDuNAe2eroUGsLwKBgQDLjhFpKa6g6mzubZeeuxlIcqsiPL0eOfoY\nfYheiKtiLykNTm34M3DlWP1ATJXYGb2W+uQg5r24m2f0x2ksJ0GWHSxmqLgw9H7A\nn19d2elfPtxHpcjtbrr7RqU3BMzxURhHM2JpFsqKj3vYGsGGfEd+nUQd/Niw75uk\nGYDytt4KMwKBgH0nP3b7Bzkjv6NqE60dm/03JHjWabSxam0xQHM2Xoav6K9tmjnt\ncrMO5IYYkD6DBL0a5Y59LvgLE4bYrO36nbn2yUi+qO+fZM4MpU79H6jvZJgN1SAH\nmAmiUueJxgnPNqBh6cQBHUG+fLBc63jVTvJyNfO+OWoBPAN2nytnz/m3AoGAcCi8\nwTRda38gPJQYWjb/rGK6lyfekNwjSQFKdcRaosQXm6RehcdaapUJHjfUzPkJ9ToT\nH2nkmebPdhm2gsSyp9M1Vu+aZich/GMUejMLGxcY60WXG/TKhJAdkt5LSqCDfx/6\nFqufOI/tDltXzRGHl2VyVg+vGnc8TERdP9+xIu8CgYEAktTDLcoJo+orUkKph2Sr\nHkP+u5SiWeO6sxheuyg11V78bHBfk3Sur0hoXIV9+6JSeT6UoS9UWMjqLbI3kcL3\nBairptR9CnPPqGScS8c+YAxHC2hOZl1LLuVawBTtWa8EAaOx42W6yE9P1b4LczNj\nTVmj73M0BCCAI1vs9qsxHbg=\n-----END PRIVATE KEY-----\n'
  }),
  databaseURL: "https://madden-germany-18-exporter.firebaseio.com/"
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
