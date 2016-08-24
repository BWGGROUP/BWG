/**
 * Created by SHBSDev on 16/5/30.
 */
//require.js 初始化配置，
require.config({
    baseUrl: '',//根目录

    paths: {
        'angular-async-loader': 'lib/angular-async-loader',
        'ionic-toast': 'lib/ionic-toast.bundle.min',
    },
    //非require.js模块定义写法的类库，注入依赖
    //exports 返回模块用于依赖
    shim: {

    }
});
//手动启动angular
require(['src/config/app-routes','src/config/app'], function (app) {
    //angular.element(document).ready(function () {
    //    //手动启动　angular
    //    angular.bootstrap(document, ['app']);
    //});


    //方案2
    angular.element(document).ready(function () {
        console.log("bootstrap ready");

        var startApp = function () {
            angular.bootstrap(document, ['app']);
        };

        var onDeviceReady = function () {
            console.log("on deviceready");
            angular.element().ready(function () {
                startApp();
            });
        };

        if (typeof cordova === 'undefined') {
            startApp();
        } else {
            document.addEventListener("deviceready", onDeviceReady, false);
        }
        //这一部分是方案2的内容
    });
});
