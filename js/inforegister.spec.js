'use strict';

describe('myApp.chat module', function() {

  beforeEach(module('myApp.info'));

  describe('chat controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var InfoCtrl = $controller('InfoCtrl');
      expect(InfoCtrl).toBeDefined();
    }));

  });
});