
  define(['require','src/config/app'],function (require,app) {
      'use strict';



      app.controller('ChatsCtrl', ['$scope','$stateParams','Chats',

          function($scope, $stateParams,Chats) {

              $scope.chats = Chats.all();
              $scope.remove = function(chat) {
                  Chats.remove(chat);
              };
          }]);
  });

