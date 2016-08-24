/**
 * Created by SHBSDev on 16/5/30.
 */
define(function (require) {
    var app = require('src/config/app');
    require('src/services/commonService');
    require('src/controllers/mainCtrl');

    app.run(['$ionicPlatform','$state', '$stateParams', '$rootScope', '$ionicPopup','sysConfig','$http',
        function ($ionicPlatform,$state,$stateParams,$rootScope,$ionicPopup,sysConfig,$http) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });

            $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){

                // 如果用户不存在
                $rootScope.user=sysConfig.getsimpleconfig("user");
                if(!$rootScope.user){
                    if(toState.name!='main.card'){
                        event.preventDefault();// 取消默认跳转行为
                    }


                    var req = {
                        method: 'POST',
                        url: sysConfig.getfinallconfig("rooturl")+'getUserInfoBySession.action'
                    };
                    var successcallback= function () {
                        $state.go(toState,toParams);
                    };
                    $http(req).success(function(response) {
                        var mes=response.message;
                        if (mes=="success"){
                            var user={
                                sys_user_name:response.useinfo.sys_user_name,
                                sys_user_email:response.useinfo.sys_user_email,
                                sys_user_wechatflag:response.useinfo.sys_user_wechatflag,
                                updid:response.useinfo.updid,
                                pagelist:response.useinfo.list,
                                filepath:response.useinfo.filepath
                            };
                            if (sysConfig.getCookieuser()){
                                var u=sysConfig.getCookieuser();
                                if(u.remberuser){
                                    user.remberuser=true
                                }
                            }
                            sysConfig.setuser(user);
                            $state.go(toState,toParams);
                        }else{
                            $rootScope.$broadcast('NOUSER',successcallback);
                        }
                    }).error(function (response) {
                        $rootScope.$broadcast('NOUSER',successcallback);
                    });
                }

            });


    }]);

    app.config(['$controllerProvider','$stateProvider', '$urlRouterProvider','$locationProvider','$httpProvider','$ionicConfigProvider',
        function ($controllerProvider,$stateProvider, $urlRouterProvider,$locationProvider,$httpProvider,$ionicConfigProvider) {
            //设置显示风格 以ios风格为基准
            $ionicConfigProvider.tabs.style("standard");
            $ionicConfigProvider.tabs.position("bottom");
            $ionicConfigProvider.views.transition("ios");
            $ionicConfigProvider.spinner.icon("ios");
            $ionicConfigProvider.form.toggle("large");
            $ionicConfigProvider.navBar.alignTitle("center");
            $ionicConfigProvider.tabs.position('bottom');
            $ionicConfigProvider.platform.android.backButton.icon('ion-chevron-left');
            $ionicConfigProvider.backButton.previousTitleText(false);
            $ionicConfigProvider.backButton.text("返回");
            /**
             * 解决嵌套路由 父路由 和 子路由不可同时加载controllerUrl 问题
             */
            app.registerController = $controllerProvider.register;
            app.loadControllerJs = function(controllerJs){
                return function($rootScope, $q){
                    var def = $q.defer(),deps=[];
                    angular.isArray(controllerJs) ? (deps = controllerJs) : deps.push(controllerJs);
                    require(deps,function(){
                        $rootScope.$apply(function(){
                            def.resolve();
                        });
                    });
                    return def.promise;
                };
            };


            $stateProvider.state('main',{
                url: '/main',
                abstract: true,
                templateUrl: 'templates/icontitle.html'


            }) .state('main.card', {
                url: '/card',
                templateUrl: 'templates/card.html'
            });

            $stateProvider.state('train',{
                url: '/train',

                templateUrl: 'src/model/train/train.html',
                controller: 'train',
                resolve:{
                    deps: app.loadControllerJs('../model/train/train')
                }

            }).state('share',{
                url: '/share',

                templateUrl: 'src/model/share/share.html',
                controller: 'share',
                resolve:{
                    deps: app.loadControllerJs('../model/share/share')
                }

            });




                //$stateProvider
                //
                //// setup an abstract state for the tabs directive
                //.state('tab', {
                //    url: '/tab',
                //    abstract: true,
                //    templateUrl: 'templates/tabs.html'
                //
                //})
                //
                //// Each tab has its own nav history stack:
                //
                //.state('tab.dash', {
                //    url: '/dash',
                //    views: {
                //        'tab-dash': {
                //            templateUrl: 'templates/tab-dash.html',
                //            controller: 'DashCtrl',
                //            resolve:{
                //                //这里要执行加载js，我们使用$q的方法阻塞执行
                //                //定义了一个方法，这个方法接受一个路径名称或者包含路径名称的数组
                //                //使用$q的方式异步执行
                //                //这里的话应该是这么理解的，使用require的方式加载文件，通过require的相应callback
                //                //响应了$q的执行结果事件resolve
                //                deps: app.loadControllerJs('../controllers/DashCtrl')
                //            }
                //        }
                //    }
                //})
                //.state('tab.chats', {
                //    url: '/chats',
                //    views: {
                //        'tab-chats': {
                //            templateUrl: 'templates/tab-chats.html',
                //            controller: 'ChatsCtrl',
                //            dependencies: ['src/services/ChatsService'],
                //            resolve:{
                //                deps: app.loadControllerJs('../controllers/ChatsCtrl')
                //            }
                //        }
                //    }
                //})
                //.state('tab.chat-detail', {
                //    url: '/chats/:chatId',
                //    views: {
                //        'tab-chats': {
                //            templateUrl: 'templates/chat-detail.html',
                //            controller: 'ChatDetailCtrl',
                //            dependencies: ['src/services/ChatsService'],
                //            resolve:{
                //                deps: app.loadControllerJs('../controllers/ChatDetailCtrl')
                //            }
                //        }
                //    }
                //})
                //
                //.state('tab.account', {
                //    url: '/account',
                //    views: {
                //        'tab-account': {
                //            templateUrl: 'templates/tab-account.html',
                //            controller: 'AccountCtrl',
                //            resolve:{
                //                deps: app.loadControllerJs('../controllers/AccountCtrl')
                //            }
                //        }
                //    }
                //});

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/main/card');


//注入$http拦截器
            var Interceptor= require("src/config/HttpInterceptor");
            Interceptor.Interceptor($httpProvider);
        }]);
});
