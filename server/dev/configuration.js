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
    resourcePath: '/home/guillaume/Documents/projets/ng-pl-editor/resource', 
    commonDir: 'cmn',
    customPath: '/home/guillaume/Documents/projets/ng-pl-editor/resource/custom'
  }
};

module.exports = configuration;
