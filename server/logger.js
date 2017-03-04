'use strict';

var trace = {
  req: function(req, res, next) {
    console.log('request url', req.url, 'params', req.params);
    next();
  }
};



module.exports = trace;
