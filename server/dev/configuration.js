'use strict';

const configuration = {
  port: 8081,
  playlists: {
    'mon': 'mon.csv', 
    'tue': 'tue.csv', 
    'wed': 'wed.csv', 
    'thu': 'thu.csv', 
    'fri': 'fri.csv', 
    'sat': 'sat.csv', 
    'sun': 'sun.csv'
  },

  tagMapping: {
    'Size': 'Image Size',
    'Duration': 'Duration'
  },

  environment: {
    clientApp: '../client/app/',
    videoExt: '.mp4',
    resourceDir: '/home/guillaume/Documents/projets/ng-pl-editor/resource',
    videoRoute: 'video'
  }
};

module.exports = configuration;
