/**
 * Created by shbs-tp001 on 15-12-7.
 */

define(['require','src/config/app'],function (require,app) {

//自定义$http拦截器，此拦截器需要在　app　config阶段注入
    app.factory('httpInterceptor', [ '$q', '$injector','$rootScope', function($q, $injector,$rootScope) {
            return {
                // optional method
                'request': function(config) {
                    // do something on success
                    return config;
                },

                // optional method
                'requestError': function(rejection) {
                    // do something on error
                    if (canRecover(rejection)) {
                        return responseOrNewPromise
                    }
                    return $q.reject(rejection);
                },



                // optional method
                'response': function(response) {

                    if (response.data.state=="NOPOWER"){
                        //没有权限
                        $rootScope.$broadcast('NOPOWER', response);
                    }else if (response.data.state=="SESSIONTIMEOUT"){
                        //登陆超时
                        $rootScope.$broadcast('SESSIONTIMEOUT', response);
                    }

                    // do something on success
                    return response;
                },

                // optional method
                'responseError': function(rejection) {
                    // do something on error

                    return $q.reject(rejection);
                }
            };
        }]);

    var Interceptor= function ($httpProvider) {
        //$http注入自定义拦截器　
        $httpProvider.interceptors.push('httpInterceptor');
        // Use x-www-form-urlencoded Content-Type
        //以下内容序列化$http.post请求传参序列化，使之与jQuery　ajax相同，否则后台取不到值
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $httpProvider.defaults.headers.post['X-Requested-With']="XMLHttpRequest";

        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function(obj) {

        //$httpParamSerializerJQLike


            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

            for(name in obj) {
                value = obj[name];

                if(value instanceof Array) {
                    for(i=0; i<value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value instanceof Object) {
                    for(subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if(value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // 重写 $http 服务的默认 请求前数据处理方法
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    };
    return{
        Interceptor:Interceptor
    }
});