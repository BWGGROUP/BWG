
define(['require','src/config/app'],function (require,app) {
  'use strict';



  app.controller('ChatDetailCtrl', ['$scope','$stateParams','Chats',

    function($scope, $stateParams,Chats) {

      $scope.chat = Chats.get($stateParams.chatId);
  }]);
});

