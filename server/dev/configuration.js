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

  // No space allowed in tags
  tags: ['ImageSize', 'Description', 'title'],

  environment: {
    dirnamePattern: /^test-[a-z]/,
    filenamePattern: '[A-Z]*_[0-9]*_[0-9]*.mp4',
    clientApp: '../client/app/',
    commonDir: '/home/guillaume/Documents/projets/ng-pl-editor/resource',
    customPath: '/home/guillaume/Documents/projets/ng-pl-editor/resource/custom',
    videoRoute: 'video'
  }
};

module.exports = configuration;
