'use strict';
/*
  TODO in next versions

  - check playlist length (timelength) before writing file

  Tests:
   - patch with unknown trackId
   - patch with a too long tracks id array
  sauvegarder une playlist vide
 
  tracks format
  -------------
  var tracks = [
    {
    'id': 9,
    'filepath': 'video/CAP_0009_180630.mp4',
    'alias': 'Alias 9',
    'title': 'Test capsule',
    'description': 'Capsule en HD',
    'typeDesc': 'Capsule',
    'duration':180
    },
    {
    'id': 7,
    'filepath': 'video/CAP_0007_180630.mp4',
    'alias': 'Alias 7',
    'title': 'Ma première capsule',
    'description': 'La pirogue de génération Félix Houphouët Boigny',
    'typeDesc': 'Capsule',
    'duration':181
    },
    {
    'id': 3,
    'filepath': 'video/CAP_0003_180630.mp4',
    'title': 'Ma deuxième capsule',
    'alias': 'Alias 3',
    'description': 'Le royaume du Sanwi',
    'typeDesc': 'Publicité',
    'duration':180
    }
  ];


  playlist format
  ---------------
  const playlists = {
    'mon' : [9, 7, 3, 7, 9], 
    'tue' : [9], 
    'wed' : [7], 
    'thu' : [3, 7], 
    'fri' : [7, 9], 
    'sat' : [], 
    'sun' : [7]
  };
*/

var configFile = process.argv[2];
if(!configFile){
  configFile = './configuration.js';
}

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const trace = require('./logger');
const resources = path.join(__dirname, 'public');
const app = express();
const cfg = require(configFile);
const plRepo = require('./pl-repo')(configFile);

plRepo.buildTrackSet()
.then(function(tracksInfos) {
  console.log('tracksInfos', tracksInfos);
  plRepo.tracks = tracksInfos;
})
.catch(function(error) {
  console.log(error);
});

app.use(bodyParser.json());
app.use(trace.req);
app.use('/', express.static(path.join(__dirname, cfg.environment.clientApp)));
const videoDir = path.join(cfg.environment.resourceDir, cfg.environment.videoRoute);
app.use('/' + cfg.environment.videoRoute, express.static(videoDir));

app.get('/api/track', (req, res) => {
  console.log('get track');
  let reqBody;
  if(plRepo.isInitialized()) {
    reqBody = plRepo.tracks;
  }
  else {
    res.statusCode = 503;
    console.log('error sent : track description not initialized');
  }
  res.send(plRepo.tracks);
});

app.get('/api/playlist/:day', (req, res) => {
  console.log('get playlist');
  plRepo.readPlaylist(req.params.day, (trackIds) => {
    res.send(trackIds);
  });
});

app.patch('/api/playlist/:day', (req, res) => {
  console.log('patch playlist');
  try {
    let filepaths = plRepo.savePlaylist(req.params.day, req.body);
  } catch(e){
    res.statusCode = 409;
    resBody = e;
    console.log(e);
  }
  res.send(resBody);
});

app.listen(cfg.port)
console.log('listening on', cfg.port);

module.exports = app;
