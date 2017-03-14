var plRepo = require('./pl-repo')('./dev/configuration-test.js');
var assert = require('assert');

// plRepo.listDirs("./", (directories) => {
//   assert(directories.indexOf("dev") >= 0);
// });

assert(plRepo.listDirs("./").indexOf("dev") >= 0);