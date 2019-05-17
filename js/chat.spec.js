'use strict';

describe('myApp.chat module', function() {

  beforeEach(module('myApp.chat'));

  describe('chat controller', function(){

    it('should ....', inject(function($controller) {
      //spec body
      var ChatCtrl = $controller('ChatCtrl');
      expect(ChatCtrl).toBeDefined();
    }));

  });
});