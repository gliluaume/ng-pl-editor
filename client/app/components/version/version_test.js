'use strict';

describe('plEditor.version module', function() {
  beforeEach(module('plEditor.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.2');
    }));
  });
});
