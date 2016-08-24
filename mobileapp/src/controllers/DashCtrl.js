
define(['require','src/config/app'],function (require,app) {
  'use strict';



  app.controller('DashCtrl', ['$scope','$ionicPopover','$timeout','ionicDatePicker',

    function($scope, $ionicPopover,$timeout,ionicDatePicker) {

      $scope.popover = $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
      });

      // .fromTemplateUrl() 方法
      $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });


      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      // 清除浮动框
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // 在隐藏浮动框后执行
      $scope.$on('popover.hidden', function() {
        // 执行代码
      });
      // 移除浮动框后执行
      $scope.$on('popover.removed', function() {
        // 执行代码
      });

      $scope.openDatePickerOne = function (val) {
        var ipObj1 = {
          callback: function (val) {  //Mandatory
            console.log('Return value from the datepicker popup is : ' + val, new Date(val));
            $scope.selectedDate1 = new Date(val);
          },
          disabledDates: [
            new Date(2016, 2, 16),
            new Date(2015, 3, 16),
            new Date(2015, 4, 16),
            new Date(2015, 5, 16),
            new Date('Wednesday, August 12, 2015'),
            new Date("08-16-2016"),
            new Date(1439676000000)
          ],
          from: new Date(2012, 1, 1),
          to: new Date(2016, 10, 30),
          inputDate: new Date(),
          mondayFirst: true,
          disableWeekdays: [0],
          closeOnSelect: false,
          templateType: 'popup'
        };
        ionicDatePicker.openDatePicker(ipObj1);
      };
    }]);
});