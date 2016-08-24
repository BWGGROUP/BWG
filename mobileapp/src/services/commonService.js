/**
 * Created by SHBSDev on 16/5/30.
 */
define(['require', '../config/app'], function (require, app) {

    /**
     * @author 张子光
     * 提供controller间互相调用方式
     * demo
     *  callbackFactory 注入到 controller
     *
     *  注意先提供调用方法 才可以被其它controller调用
     *  controller1
     *  var call= function (name) {
     *  };
     *   callbackFactory.setfn("call",call);
     *
     *
     *   controller2
     *    var fn=callbackFactory.getfn("call"); 得到回调方法
     *    fn("123");调用方法
     *
     */

    app.factory('callbackFactory', function () {
        var callbacklist = {};
        var fn = {}
        fn.setfn = function (key, sfn) {
            callbacklist[key] = sfn;
        };

        fn.getfn = function (key) {
            return callbacklist[key];
        };
        return fn;
    });
    /**
     * 系统配置工厂
     * 提供一些系统常量.
     */
    app.factory('sysConfig', function () {
        //不可更改的系统配置参数
        var finallconstant = {
            PAGECODE: {
                "PAGE-BUES": "投资业务",
                "PAGE-EMPLOYEE": "员工管理",
                "PAGE-BASKET": "筐管理	",
                "PAGE-LABEL": "标签管理",
                "PAGE-JOBTYPE": "工作类型维护",
                "PAGE-SYSPARA": "系统参数维护",
                "PAGE-TRAINDIR": "培训目录",
                "PAGE-TRAINADMIN": "培训管理",
                "PAGE-SHAREDIR": "共享文件目录",
                "PAGE-SHAREADMIN": "共享文件管理",
                "PAGE-WEEKLYMAKE": "周报填写	",
                "PAGE-WEEKLYADMIN": "周报管理	",
                "PAGE-EVALUATEMAKE": "评价填写",
                "PAGE-EVALUATEADMIN": "评价管理",
                "PAGE-PROJECT": "项目维护	"
            },
            rooturl:"../../"
        };
        //可以在程序中修改的参数
        var simpleconfig = {};
        var fn = {};
        fn.getfinallconfig = function (key) {
            return finallconstant[key]
        };

        fn.getsimpleconfig = function (key) {
            return simpleconfig[key]
        };
        fn.setsimpleconfig = function (key, value) {
            simpleconfig[key] = value
        };
        fn.setuser= function (value) {
            simpleconfig.user=value;
            setCookie("USER",JSON.stringify(value));
        };
        fn.checkpower= function (key,list) {

            for (var i=0;i<list.length;i++){
                if(list[i]==key){
                    return true;
                }
            }
            return false;
        };
        fn.getuser= function () {
            if (simpleconfig.user){
                return simpleconfig.user;
            }
            var str=getCookie("USER");
            if (str!=null){
                var user= angular.fromJson(str);
                simpleconfig.user=user;
                return simpleconfig.user
            }else {
                return null;
            }
        };
        fn.getCookieuser= function () {
            var str=getCookie("USER");
            if (str!=null){
                var user= angular.fromJson(str);
                return user
            }else {
                return null;
            }
        };
        function setCookie(name, value) {
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }

        function getCookie(name) {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
        }

        function delCookie(name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }

        return fn;
    });

});
