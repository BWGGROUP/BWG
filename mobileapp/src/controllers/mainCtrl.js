define(['require', 'src/config/app'], function (require, app) {
    "use strict";


    app.controller('mainCtrl', ['$scope', '$stateParams', '$ionicModal', '$ionicPopup', 'sysConfig', '$ionicLoading', '$http', 'callbackFactory', 'ionicToast',

        function ($scope, $stateParams, $ionicModal, $ionicPopup, sysConfig, $ionicLoading, $http, callbackFactory, ionicToast) {

            $ionicModal.fromTemplateUrl('src/model/modal/login.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;

            });

            //没有权限
            $scope.$on('NOPOWER', function (event, data) {

            });
            $scope.$on('NOUSER', function (event, data) {
                showlogin(event, data);
            });
            //登陆超时
            $scope.$on('SESSIONTIMEOUT', function (event, data) {
                ionicToast.show('登陆超时,需要重新登陆', 'middle', true, 2000);
                showlogin(event, function () {
                    var init = callbackFactory.getfn("init", init);
                    init();
                });
            });


            var rooturl = sysConfig.getfinallconfig("rooturl");

            function showlogin(event, data) {
                $scope.modal.show();


                $scope.pageconfig = {
                    codesrc: rooturl + "Verify_code.action?v=" + Math.random()
                };
                $scope.changecode = function () {
                    $scope.pageconfig.codesrc = $scope.pageconfig.codesrc + "?v=" + Math.random();
                };
                $scope.user = {remberuser: true};
                if (sysConfig.getCookieuser()) {
                    var user = sysConfig.getCookieuser();
                    if (user.remberuser) {
                        $scope.user.name = user.sys_user_email;
                    }
                }
                $scope.submit = function () {

                    if (!$scope.user.name) {
                        ionicToast.show('请填写邮箱', 'middle', false, 2000);

                    } else if (!$scope.user.psd) {
                        ionicToast.show('请填写密码', 'middle', false, 2000);

                    } else if (!$scope.user.verifycode) {
                        ionicToast.show('请填写验证码', 'middle', false, 2000);
                    } else {
                        var req = {
                            method: 'POST',
                            url: rooturl + 'login.action',
                            data: {
                                username: $scope.user.name,
                                password: $scope.user.psd,
                                Verifycode: $scope.user.verifycode
                            }
                        };
                        $ionicLoading.show({
                            template: '  <ion-spinner icon="android"></ion-spinner>' +
                            '<p>加载中...</p>',
                            noBackdrop: true
                        });
                        $http(req).success(function (response) {
                            //   console.log(response)
                            $ionicLoading.hide();
                            var mes = response.message;
                            if (mes == "codeerror") {
                                ionicToast.show('验证码输入错误', 'middle', false, 2000);
                                $scope.changecode();
                            } else if (mes == "pass_error") {
                                ionicToast.show('密码输入错误', 'middle', false, 2000);
                            } else if (mes == "name_erro") {
                                ionicToast.show('邮箱输入错误', 'middle', false, 2000);
                            } else if (mes == "success") {
                                ionicToast.show('登陆成功', 'middle', false, 2000);
                                var user = {
                                    sys_user_name: response.useinfo.sys_user_name,
                                    sys_user_email: response.useinfo.sys_user_email,
                                    sys_user_wechatflag: response.useinfo.sys_user_wechatflag,
                                    updid: response.useinfo.updid,
                                    pagelist: response.useinfo.list,
                                    remberuser: $scope.user.remberuser,
                                    filepath: response.useinfo.filepath
                                };
                                sysConfig.setuser(user);
                                data();
                                $scope.modal.hide();
                            }
                        });
                    }


                };
            }

            $scope.forgetPass = function () {
                $scope.data = {};
                var myPass = $ionicPopup.show({
                    template: '<input type="text" ng-model="data.email">',
                    title: '密码重置',
                    subTitle: '请填写邮箱，我们将为您重置密码，并发送至您的邮箱。',
                    scope: $scope,
                    buttons: [
                        {text: '取消'},
                        {
                            text: '<b>确定</b>',
                            type: 'button-positive',
                            onTap: function (e) {
                                if (!$scope.data.email) {
                                    ionicToast.show('请填写邮箱', 'middle', false, 2000);
                                    //不允许用户关闭，除非他键入邮箱密码
                                    e.preventDefault();
                                } else {
                                    e.preventDefault();
                                    var req = {
                                        method: 'POST',
                                        url: rooturl + 'forgetpassword.action',
                                        data: {
                                            emali: $scope.data.emali

                                        }
                                    };
                                    $ionicLoading.show({
                                        template: '  <ion-spinner icon="android"></ion-spinner>' +
                                        '<p>加载中...</p>',
                                        noBackdrop: true
                                    });
                                    $http(req).success(function (response) {
                                        //   console.log(response)
                                        $ionicLoading.hide();

                                        var mes = response.message;
                                        if (mes == "nouser") {
                                            ionicToast.show('没有该用户信息', 'middle', false, 2000);

                                        } else if (mes == "success") {
                                            ionicToast.show('您的密码已发送到您的用户邮箱,请注意查收', 'middle', false, 2000);
                                            myPass.close();

                                        } else {
                                            ionicToast.show('密码重置失败', 'middle', false, 2000);
                                        }
                                    });
                                }
                            }
                        }
                    ]
                });
                myPass.then(function (res) {
                    console.log('Tapped!', res);
                });
            }

        }]);

});
