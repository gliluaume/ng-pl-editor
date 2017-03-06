'use strict';

var configurePlRepo = function(cfgModule) {

  if(!cfgModule) cfgModule = './configuration';

  const _ = require('underscore');
  const fs = require('fs');
  const dateFormat = require('date-format');
  const exec = require('child_process').exec;
  const path = require('path');
  const cfg = require(cfgModule);

  const videoDir = path.join(cfg.environment.resourceDir, cfg.environment.videoRoute);
  console.log('videoDir', videoDir);

  var lowerFirst = function(strValue) {
    if(!strValue || (strValue.length === 0)) 
      return strValue;
    var tmp = strValue[0].toLowerCase();
    for(var i = 1; i < strValue.length; i++) {
      tmp += strValue[i];
    }
    return tmp; 
  }

  var camelCaseProp = function(obj) {
    var ret = {};
    for(var p in obj) {
      console.log(p, lowerFirst(p), obj[p]);
      ret[lowerFirst(p)] = obj[p];
    }
    return ret;
  };

  var treatMetadata = function(metadata) {
    var trackInfos = camelCaseProp(metadata);
    var filename = path.basename(metadata['SourceFile']);
    var splittedName = filename.split('_');

    trackInfos.id = parseInt(splittedName[1], 10);
    trackInfos.filepath = path.join(cfg.environment.videoRoute, filename);
    trackInfos.typeDesc = splittedName[0];
    trackInfos.duration = Math.round(parseInt(splittedName[2].split('.')[0], 10) / 1000),
    delete trackInfos.sourceFile; 

    return trackInfos;
  };

  var plRepo = {
    tracks: null,

    isInitialized: function() {
      console.log('test', plRepo.tracks !== null);
      return plRepo.tracks !== null;
    },

    buildTrackSet: function() {
      return new Promise((resolve, reject) => {
        var cmdPrms = cfg.tags.reduce(function(acc, item) {
          return acc + `-${item} `
        }, '');

        cmdPrms = `exiftool -json ${cmdPrms}${videoDir}/${cfg.environment.filenamePattern}`
        console.log(cmdPrms);
        exec(cmdPrms, (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            reject();
          }
          resolve(JSON.parse(stdout).map(treatMetadata));
        });
      });
    },

    calculatePlaylist: function(day, trackIds) {
      let playlistFile = path.join(cfg.environment.plPath, cfg.playlists[day]);

      var playlistDesc = {};
      plRepo.tracks.forEach(function(track) {
        playlistDesc[track.id] = track.filepath;
      });

      var filepaths = [];
      trackIds.forEach(function(trackId) {
        console.log(trackId);
        let trackpath = playlistDesc[trackId];

        if(!trackpath)
          throw `track id ${trackId} unknown !`;    
        
        filepaths.push(path.join(videoDir, trackpath));
      });

      return filepaths;
    },

    readPlaylistFile: function(playlistpath, callback) {
      fs.readFile(playlistpath, (err, data) => {
        if (err) throw err;
        if(callback) callback(data);
      });
    },

    writePlaylistFile: function(playlistpath, trackpaths, callback) {
      let text = '';

      if(trackpaths.length > 0) {
        text = trackpaths.reduce(function(acc, elt) {
          return acc + '\n' + elt;
        });
      } 

      fs.writeFile(playlistpath, text, (err) => {
        if (err) throw err;
        console.log('file saved.');
        if(callback) callback();
      });
    },

    readPlaylist: function(day, callback) {
      let filepath = path.join(cfg.environment.plPath, cfg.playlists[day]);
      console.log('playlist filepath', filepath);
      if(!fs.existsSync(filepath)) {
        if(callback) callback([]);
      }
      else {
        plRepo.readPlaylistFile(filepath, (data) => {
          let trackIds = data.toString().split('\n')
          .map(function(line) {
            return parseInt(path.basename(line).split('_')[1], 10);
          })
          trackIds = _.compact(trackIds);
          if(callback) callback(trackIds);
        });
      }
    },

    writePlaylist: function(playlistpath, trackpaths, callback) {
      console.log('writePlaylist in', playlistpath, trackpaths);
      if(fs.existsSync(playlistpath)) {
        let formattedDate = dateFormat.asString('yyyy-MM-dd-hhmmss.SSS', new Date());
        let newName = `${playlistpath}-${formattedDate}`;
        console.log('rename old file to ', newName);
        fs.rename(playlistpath, newName, function() {
          plRepo.writePlaylistFile(playlistpath, trackpaths, callback);
        });
      } 
      else {
        console.log('writing a new file');
        plRepo.writePlaylistFile(playlistpath, trackpaths, callback);
      }
    },

    savePlaylist: function(day, trackIds) {
      if(!plRepo.isInitialized()) {
        throw 'plRepo is not isInitialized !';
      } 

      console.log('cfg', cfg, 'day', day, 'trackIds', trackIds);
      let playlistpath = path.join(cfg.environment.plPath, cfg.playlists[day]);
      var trackpaths = plRepo.calculatePlaylist(day, trackIds);
      plRepo.writePlaylist(playlistpath, trackpaths, () => {
        return trackpaths;
      });
    }
  };

  return plRepo;
};

module.exports = configurePlRepo;
