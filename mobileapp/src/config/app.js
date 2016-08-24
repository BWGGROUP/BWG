/**
 * Created by SHBSDev on 16/5/30.
 */
define(function (require, exports, module) {

    var asyncLoader = require('angular-async-loader');//按需求加载controllers, services, filters
     require('lib/ionic-datepicker.bundle.min');//按需求加载controllers, services, filters
     require('ionic-toast');//按需求加载controllers, services, filters

    // 时间选择插件 https://github.com/rajeshwarpatlolla/ionic-datepicker
    //toast 插件https://github.com/rajeshwarpatlolla/ionic-toast
    //一切从模块开始　定义页面模块　注入需要模块
    var app = angular.module('app', ['ionic','ionic-datepicker','ionic-toast']);

    asyncLoader.configure(app);

//CommonJS来定义模块
    module.exports = app;
});
