/**
 * Created by SHBSDev on 16/7/6.
 */

define(['require', 'src/config/app'], function (require, app) {
    'use strict';


    app.controller('share', ['$scope', '$stateParams', '$ionicSideMenuDelegate', 'sysConfig', '$http', 'callbackFactory', '$ionicLoading', '$ionicScrollDelegate', '$timeout', 'ionicToast','$ionicModal',

        function ($scope, $stateParams, $ionicSideMenuDelegate, sysConfig, $http, callbackFactory, $ionicLoading, $ionicScrollDelegate, $timeout, ionicToast,$ionicModal) {
            var rooturl = sysConfig.getfinallconfig("rooturl");
            $scope.toggleLeft = function () {
                $ionicSideMenuDelegate.toggleLeft();
            };
            $ionicModal.fromTemplateUrl('src/model/modal/video.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.videomodel = modal;

            });
            $scope.shareconfig = {
                keyword: "",
                pageCurrent: 0,
                totalCount: 0,
                allowloadmore: false
            };
            $scope.user = sysConfig.getuser();
            $scope.treedata = [];
            var keyword = "";
            var Node;
            init();
            function init() {
                //加载虚拟目录
                var treereq = {
                    method: 'POST',
                    url: rooturl + 'shareDirectory.action',
                    data: {
                        pagecode: "PAGE-SHAREADMIN"
                    }
                };
                $http(treereq).success(function (response) {

                    if (response.message == "success") {
                        $scope.treedata = response.shareList;
                    }
                });
            }

            callbackFactory.setfn("init", init);

            $scope.showlist = function (node, type) {
                if (Node && node.base_sharedir_code == Node.base_sharedir_code && !type) {
                    return;
                }
                Node = node;
                $scope.shareconfig.allowloadmore = false;
                if (!type || type == "keyword") {
                    if (!type) {
                        keyword = $scope.shareconfig.keyword = "";
                    }
                    $scope.shareconfig.pageCurrent = 0;
                    $scope.datelist = [];
                    $ionicScrollDelegate.scrollTop();
                }
                var req = {
                    method: 'POST',
                    url: rooturl + 'shareFile.action',
                    data: {
                        pagecode: "PAGE-SHAREADMIN",
                        name: "",
                        pageCurrent: $scope.shareconfig.pageCurrent,
                        pageNum: 10,
                        sharefileficsrc: node.base_sharedir_srccode,
                        keyword: keyword || ""
                    }
                };

                $http(req).success(function (res) {
                    if (res.message == "success") {
                        if ($scope.datelist) {
                            $scope.datelist = $scope.datelist.concat(res.sharefileList)
                        } else {
                            $scope.datelist = res.sharefileList;
                        }

                        if ($scope.datelist.length == res.totalCount) {
                            $scope.havemore = false
                        } else {
                            $scope.havemore = true;
                        }
                        if (!res.sharefileList.length) {
                            ionicToast.show('暂无数据', 'middle', false, 2000);
                        } else {
                            ionicToast.hide();
                        }
                        $scope.shareconfig.totalCount = res.totalCount;
                        $timeout(function () {
                            $scope.shareconfig.allowloadmore = true;
                        }, 300);


                    }
                }).error(function () {
                    $scope.havemore = false;
                    ionicToast.show('请求失败', 'middle', false, 2000);

                }).finally(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });
            };

            $scope.fileimg = function (item) {
                var filetype = "";
                if (item.base_sharefile_src.lastIndexOf(".") > -1) {
                    filetype = item.base_sharefile_src.substring(item.base_sharefile_src.lastIndexOf("."), item.base_sharefile_src.length);
                }
                if (angular.lowercase(filetype) == ".mp4") {
                    return item.img = "img/filemp4.png";
                } else if (angular.lowercase(filetype) == ".pdf") {
                    return item.img = "img/filepdf.png";
                }
                return item.img = "img/filelist.png";
            };


            $scope.searchkeyword = function () {
                if (!Node) {
                    ionicToast.show('请选择目录', 'middle', false, 2000);

                    return;
                }
                if ($scope.shareconfig.keyword != keyword) {
                    keyword = $scope.shareconfig.keyword;
                    $scope.showlist(Node, "keyword")
                }

            };
            $scope.loadMore = function () {
                if (Node && $scope.datelist && $scope.datelist.length < $scope.shareconfig.totalCount && $scope.shareconfig.allowloadmore) {
                    $scope.shareconfig.pageCurrent++;
                    $scope.showlist(Node, "loadmore")
                } else {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }

            };

            $scope.look = function (item) {
                if (item.base_sharefile_lookwad==0){
                    ionicToast.show('您没有权限查看该文件', 'middle', false, 2000);
                    return
                };

                var callback = function () {
                    var filetype = "";
                    if (item.base_sharefile_src.lastIndexOf(".") > -1) {
                        filetype = item.base_sharefile_src.substring(item.base_sharefile_src.lastIndexOf("."), item.base_sharefile_src.length);
                    }
// 浏览数加一
                    var req = {
                        method: 'post',
                        url: rooturl + "lookNumAdd.action",
                        data: {
                            pagecode: "PAGE-SHAREDIR",
                            base_sharefile_code: item.base_sharefile_code
                        }
                    };

                    $http(req).success(function (res) {
                        if (res.message == "success") {
                            item.base_sharefile_looknum = res.looknum;
                        }
                    });

                    if (angular.lowercase(filetype) == ".mp4") {

                        $scope.videopath = item.base_sharefile_src;
                        $scope.videoname = item.base_sharefile_name;
                        $scope.videomodel.show()

                    } else {
                        document.getElementById("hiddenlink").action =item.base_sharefile_src;
                        var s = document.getElementById("hiddenlink");
                        s.submit();

                    }
                };
                checkfile( item.base_sharefile_src, callback);

            };

            function checkfile(file, call) {
                var req = {
                    method: 'HEAD',
                    url: file
                };
                $http(req).success(function (response, state) {
                    if (call && angular.isFunction(call)) {
                        call();
                    }
                }).error(function (response) {
                    ionicToast.show('该文件路径错误', 'middle', false, 2000);
                });
            }

        }]);


    app.directive('sharetree', ['$compile', function ($compile) {

        return {
            restrict: 'EA',
            scope: false,
            link: function (scope, element, attrs, ctrl) {
                //tree id
                var treeId = attrs.treeId;

                //tree model
                var treeModel = attrs.treeModel;

                //node id
                var nodeId = attrs.nodeId || 'id';

                var firstnode = attrs.firstnode || false;

                //node label
                var nodeLabel = attrs.nodeLabel || 'label';

                var choosenode = attrs.choosenode || 'choosenode';

                //children
                var nodeChildren = attrs.nodeChildren || 'children';

                var level = attrs.level || 1;

                var template = '<ul>' +
                    '<li  ng-repeat="node in ' + treeModel + '">' +
                    '<div class="treelable" ng-click="node.active=!node.active;showlist(node)" ng-style="{\'padding-left\':\'' + (13 * parseInt(level)) + 'px\'}">' +
                    ' <i class="fileopen" ng-if="node.active&&node.' + nodeChildren + '.length"></i> ' +
                    '<i class="fileclose" ng-if="!node.active&&node.' + nodeChildren + '.length""></i>' +
                    '<i class="filet" ng-if="!node.' + nodeChildren + '.length""></i>' +
                    '{{node.' + nodeLabel + '}}' +
                    '</div>' +
                    '<sharetree tree-model="node.' + nodeChildren + '" node-id="' + nodeId + '"  node-label="' + nodeLabel + '" node-children="' + nodeChildren + '" class="treehide" ng-class="{\'show\':node.active}" class="treehide" level=' + (parseInt(level) + 1) + '></sharetree>' +

                    '</li>' +
                    '</ul>';
                element.html('').append($compile(template)(scope));
            },
            controller: function ($scope, $element) {


            }
        }

    }]);
});
