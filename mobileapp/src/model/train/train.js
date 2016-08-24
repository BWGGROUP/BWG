/**
 * Created by SHBSDev on 16/7/5.
 */
define(['require','src/config/app'],function (require,app) {
    'use strict';



    app.controller('train', ['$scope','$stateParams','$timeout','$ionicScrollDelegate','$ionicSideMenuDelegate','sysConfig','$http','callbackFactory','ionicToast',

        function($scope, $stateParams,$timeout,$ionicScrollDelegate,$ionicSideMenuDelegate,sysConfig,$http,callbackFactory,ionicToast) {
            var rooturl = sysConfig.getfinallconfig("rooturl");
            $scope.toggleLeft = function() {
                $ionicSideMenuDelegate.toggleLeft();
            };
            $scope.user = sysConfig.getuser();
            $scope.treedata = [];
            $scope.trainfiledata=[];
            $scope.traindata={
                trainfileficsrc:"",
                pageNum:10,
                pageCurrent:0,
                totalCount:0,
                allowloadmore:false
            };
            var Node;
            //是否允许加载更多标识
            $scope.havemore=false;

            init();
            function init() {
                //加载虚拟目录
                var treereq = {
                    method: 'POST',
                    url: rooturl + 'trainingDirectory.action',
                    data: {
                        pagecode: "PAGE-TRAINDIR"
                    }
                };
                $http(treereq).success(function (response) {

                    if (response.message == "success") {
                        $scope.treedata = response.trainList;
                    }

                });
            }
//点击左子树查询该文夹下的培训文档列表
            $scope.showList= function (node,type) {
                //第一次加载时
                if(!type){
//                    Node=false;
                    $scope.trainfiledata=[];
                    $scope.traindata.pageCurrent=0;
                    $ionicScrollDelegate.scrollTop();
                }
                if($scope.Node&&node.base_traindir_code==Node.base_traindir_code){
                    return;
                }
                $scope.traindata.allowloadmore=false;
                Node=node;
                var req={
                    method:'post',
                    url: rooturl + 'trainFile.action',
                    data: {
                        pagecode: "PAGE-TRAINDIR",
                        trainfileficsrc:node.base_traindir_srccode,
                        pageNum:$scope.traindata.pageNum,
                        pageCurrent:$scope.traindata.pageCurrent
                    }
                };

                $http(req).success(function (response) {

                    if (response.message == "success") {
                        //如果加载更多则list合并
                        if($scope.trainfiledata){
                            $scope.trainfiledata=$scope.trainfiledata.concat(response.trainfileList);
                        }else{
                            $scope.trainfiledata=response.trainfileList;
                        }
                        if (!response.trainfileList.length){
                            ionicToast.show('暂无数据', 'middle', false, 2000);
                        }else{
                            ionicToast.hide();
                        }
                        //判断是否需要加载更多
                        if($scope.trainfiledata.length == response.totalCount) {
                            //不需要加载更多
                            $scope.havemore = false
                        } else {
                            //需要加载更多
//                            $timeout(function () {
                                $scope.havemore = true;

//                            },300);

                            $timeout(function () {
                                $scope.traindata.allowloadmore=true;
                            },300);
                        };

                        $scope.traindata.totalCount= response.totalCount;
                    }
                }).error(function () {
                    $scope.havemore = false;
                    ionicToast.show('请求失败', 'middle', false, 2000);

                }).finally(function () {
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                });;
            };
            //图片加载
            $scope.fileimg = function (item) {
                var filetype = "";
                if (item.base_trainfile_ftpsrc.lastIndexOf(".") > -1) {
                    filetype = item.base_trainfile_ftpsrc.substring(item.base_trainfile_ftpsrc.lastIndexOf("."), item.base_trainfile_ftpsrc.length);
                }
                if (angular.lowercase(filetype) == ".mp4") {
                    return item.img = "img/filemp4.png";
                } else if (angular.lowercase(filetype) == ".pdf") {
                    return item.img = "img/filepdf.png";
                }
                return item.img = "img/filelist.png";
            };

            //滚动加载更多
            $scope.loadMore = function() {
                //判断是否需要加载更多
                if(Node && $scope.trainfiledata && $scope.trainfiledata.length < $scope.traindata.totalCount&&$scope.traindata.allowloadmore){
                    $scope.traindata.pageCurrent++;
                    $scope.showList(Node,"loadmore");
                }else{
                    //加载更多完成标志
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }



            };

            callbackFactory.setfn("init",init);
        }]);


    app.directive('traintree', ['$compile', function ($compile) {

        return {
            restrict: 'EA',
            scope: false,
            link: function (scope, element, attrs, ctrl) {
                //tree id
                var treeId = attrs.treeId;

                //tree model
                var treeModel = attrs.treeModel;

                //node id
                var  nodeId = attrs.nodeId || 'id';

                var firstnode = attrs.firstnode || false;

                //node label
                var nodeLabel = attrs.nodeLabel || 'label';

                var choosenode = attrs.choosenode || 'choosenode';

                //children
                var nodeChildren = attrs.nodeChildren || 'children';

                var level=attrs.level||1;

                var template = '<ul>' +
                    '<li  ng-repeat="node in ' + treeModel + '">' +
                    '<div class="treelable" ng-click="node.active=!node.active;showList(node,type)" ng-style="{\'padding-left\':\''+(13*parseInt(level))+'px\'}">' +
                    ' <i class="fileopen" ng-if="node.active&&node.'+nodeChildren+'.length"></i> ' +
                    '<i class="fileclose" ng-if="!node.active&&node.'+nodeChildren+'.length""></i>' +
                    '<i class="filet" ng-if="!node.'+nodeChildren+'.length""></i>' +
                    '{{node.'+nodeLabel+'}}' +
                    '</div>' +
                    '<traintree tree-model="node.' + nodeChildren + '" node-id="' + nodeId + '"  node-label="' + nodeLabel + '" node-children="' + nodeChildren + '" class="treehide" ng-class="{\'show\':node.active}" class="treehide" level='+(parseInt(level)+1)+'></traintree>' +

                    '</li>' +
                    '</ul>';
                element.html('').append($compile(template)(scope));
            },
            controller: function ($scope, $element) {


            }
        }

    }]);

});
