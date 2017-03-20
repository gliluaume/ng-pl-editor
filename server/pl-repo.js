'use strict';

var configurePlRepo = function(cfgModule) {

  if(!cfgModule) cfgModule = './configuration';
  const fs = require('fs');
  const dateFormat = require('date-format');
  const exec = require('child_process').exec;
  const path = require('path');
  const cfg = require(cfgModule);
  const videoDir = path.join(cfg.environment.resourcePath, cfg.environment.commonDir);

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

  var treatMetadata = function(origin) {
    return function(metadata) {
      var trackInfos = camelCaseProp(metadata);
      var filename = path.basename(metadata['SourceFile']);
      var splittedName = filename.split('_');

      trackInfos.id = parseInt(splittedName[1], 10);
      trackInfos.filepath = path.join('/', origin, filename);
      trackInfos.poster = trackInfos.filepath.replace(/.mp4$/, '.jpeg');
      trackInfos.typeDesc = splittedName[0];
      trackInfos.duration = Math.round(parseInt(splittedName[2].split('.')[0], 10) / 1000);
      trackInfos.origin = origin;
      console.log('origin', origin);
      delete trackInfos.sourceFile; 

      return trackInfos;
    };
  };


  var plRepo = {
    tracks: null,

    listDirs: function(dirpath) {
      if(!fs.statSync(dirpath).isDirectory()) throw 'directory expected !';
      return fs.readdirSync(dirpath)
      .filter(i => fs.statSync(path.join(dirpath, i)).isDirectory() && !!i.match(cfg.environment.dirnamePattern));
    },

    isInitialized: function() {
      return plRepo.tracks !== null;
    },

    countVideoFiles: function(dir) {
      return fs.readdirSync(dir)
      .filter(item => {
        console.log("fichier", item);
        return !!item.match(new RegExp(cfg.environment.filenamePattern));
      })
      .length;
    },

    buildTrackSetDir: function(dir, origin) {
      console.log('buildTrackSetDir', dir, origin);

      return new Promise((resolve, reject) => {
        var cmdPrms = cfg.tags.reduce(function(acc, item) {
          return acc + `-${item} `
        }, '');

        // exiftool throw error when no file is found
        if(plRepo.countVideoFiles(dir) <= 0) {
          console.log('no matching file');
          resolve([]);
        } else {
          cmdPrms = `exiftool -json ${cmdPrms}${dir}/${cfg.environment.filenamePattern}`
          console.log('cmdPrms', cmdPrms);
          exec(cmdPrms, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              reject();
            }
            resolve(JSON.parse(stdout).map(treatMetadata(origin)));
          });
        }
      });
    },

    buildTrackSet: function() {
      var promises = [plRepo.buildTrackSetDir(videoDir, cfg.environment.commonDir)];

      plRepo.listDirs(cfg.environment.customPath)
      .forEach(dirname => {
        var dirpath = path.join(cfg.environment.customPath, dirname);
        promises.push(plRepo.buildTrackSetDir(dirpath, dirname));
      });
      return Promise.all(promises);
    },

    calculatePlaylist: function(dir, day, trackIds) {
      let playlistFile = path.join(cfg.environment.customPath, dir, cfg.playlists[day]);

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
      console.log('writePlaylistFile', playlistpath);
      fs.writeFile(playlistpath, text, (err) => {
        if (err) throw err;
        console.log('file saved.');
        if(callback) callback();
      });
    },

    archivePlaylistFile: function(dir, day) {
      return new Promise((resolve, reject) => {
        let playlistpath = path.join(cfg.environment.customPath, dir, cfg.playlists[day]);
        let formattedDate = dateFormat.asString('yyyy-MM-dd-hhmmss.SSS', new Date());
        let newName = `${playlistpath}-${formattedDate}`;
        console.log('rename old file to ', newName);
        fs.rename(playlistpath, newName, function() {
          let zipName = playlistpath.replace(/.csv$/, '.zip');
          let cmdPrms = `zip -m ${zipName} ${playlistpath}-*`;
          console.log('zip action cmdPrms', cmdPrms);
          exec(cmdPrms, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              reject();
            }
            resolve(stdout);
          });
        });
      });
    },

    readPlaylist: function(dir, day, callback) {
      if(!dir.match(cfg.environment.dirnamePattern)) throw 'invalid file name';

      let filepath = path.join(cfg.environment.customPath, dir, cfg.playlists[day]);
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
          trackIds = trackIds.filter(id => id);
          if(callback) callback(trackIds);
        });
      }
    },

    writePlaylist: function(dir, day, trackpaths, callback) {
      let playlistpath = path.join(cfg.environment.customPath, dir, cfg.playlists[day]);
      console.log('writePlaylist in', dir, day, trackpaths);
      if(fs.existsSync(playlistpath)) {
        plRepo.archivePlaylistFile(dir, day)
        .then((data) => { 
          console.log(data); 
          plRepo.writePlaylistFile(playlistpath, trackpaths, callback);
        })
        .catch((error) => { 
          console.log(error); 
        });
      } 
      else {
        console.log('writing a new file');
        plRepo.writePlaylistFile(playlistpath, trackpaths, callback);
      }
    },

    savePlaylist: function(dir, day, trackIds) {
      if(!plRepo.isInitialized()) {
        throw 'plRepo is not isInitialized !';
      } 

      console.log('cfg', cfg, 'day', day, 'trackIds', trackIds);
      var trackpaths = plRepo.calculatePlaylist(dir, day, trackIds);
      plRepo.writePlaylist(dir, day, trackpaths, () => {
        return trackpaths;
      });
    }
  };

  return plRepo;
};

module.exports = configurePlRepo;
