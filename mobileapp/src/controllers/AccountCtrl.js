//.controller('AccountCtrl', function($scope) {
//  $scope.settings = {
//    enableFriends: true
//  };
//});
//修改后的文件如下
define(['require','src/config/app'],function (require,app) {
  'use strict';



  app.controller('AccountCtrl', ['$scope',function($scope) {

    $scope.settings = {
      enableFriends: true
    };

  }]);
});

