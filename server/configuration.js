'use strict';

const configuration = {
  port: 8080,

  playlists: {
    'mon': 'mon.csv', 
    'tue': 'tue.csv', 
    'wed': 'wed.csv', 
    'thu': 'thu.csv', 
    'fri': 'fri.csv', 
    'sat': 'sat.csv', 
    'sun': 'sun.csv'
  },
  
  // No space allowed in tags
  tags: ['ImageSize', 'Description'],

  environment: {
    filenamePattern: '[A-Z]*_[0-9]*_[0-9]*.mp4',
    clientApp: '../client/app/',
    resourceDir: '/home/guillaume/Documents/projets/ng-pl-editor/resource',
    plPath: '/home/guillaume/Documents/projets/ng-pl-editor/resource/playlist',
    videoRoute: 'video'
  }
};

module.exports = configuration;
