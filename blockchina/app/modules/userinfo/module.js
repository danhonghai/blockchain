define([
    '../../app'
], function(controllers) {
    controllers
        .controller('UserinfoController', ['$scope', 'Services', '$timeout', '$state', function($scope, Services, $timeout, $state) {
            //获取个人信息
            Services.getData("auth/certificate/user/info", {}, function(data) {
                $scope.userInfo = data.body.userInfo;
                $scope.userInfo.hasPhone = data.body.userInfo.phone ? true : false;
                $scope.userInfo.hasEmail = data.body.userInfo.email ? true : false;
                getdatafun(1);
            })
            $scope.data = {
                index: "0",
                size: "5"
            }
            //设置分页的参数
            $scope.option = {
                curr: 1,
                all: 9999,
                count: 5,
                total: 999,
                click: function(page) {
                    $scope.data.index++;
                    getdatafun(page);
                }
            }
            //获取
            function getdatafun(page) {
                $scope.data.index = page - 1;
                Services.getData("auth/certificate/user/loginHistory", $scope.data, function(data) {
                    $scope.pagedatas = data.body.loginHistory;
                    $scope.option.curr = $scope.data.index + 1;
                    $scope.option.all = Math.ceil($scope.pagedatas.total / $scope.data.size);
                    $scope.option.count = $scope.pagedatas.totalIndex > 10 ? 10 : $scope.pagedatas.totalIndex;
                    $scope.option.total = $scope.pagedatas.total;
                })
            }

            $scope.urlActive = function() {
                $state.go("logged.userinfo.realname");
            }

        }])
        .controller('invitefriendsController', ['$scope', '$rootScope', '$state', 'Services', '$location', '$http', '$stateParams', '$filter', '$timeout', 'TipService', function($scope, $rootScope, $state, Services, $location, $http, $stateParams, $filter, $timeout, TipService) {
            //复制按钮
            $scope.copyText = function(id) {
                var Url1 = document.getElementById(id);
                Url1.select(); //选择对象    
                document.execCommand("Copy"); //执行浏览器复制命令   
                TipService.setMessage($rootScope.lang.lang164, 'info');
            };

            $scope.data = {
                index: "0",
                size: "3"
            }
            //设置分页的参数
            $scope.option = {
                curr: 1,
                all: 9999,
                count: 5,
                total: 999,
                click: function(page) {
                    $scope.data.index++;
                    $scope.getdatafun(page);
                }
            }
            //邀请记录查询 
            $scope.getdatafun = function(page) {
                $scope.data.index = page - 1;
                $scope.countryes = [];
                Services.getData('user/auth/invite', $scope.data, function(capitalflowdata) {
                    $scope.country = capitalflowdata.body.pageData;
                    $scope.countrydd = capitalflowdata.body;
                    $scope.countrd = capitalflowdata.body.qrcode;
                    $scope.countryes = capitalflowdata.body.pageData.dataList;
                    $scope.option.curr = $scope.data.index + 1;
                    $scope.option.all = Math.ceil($scope.country.total / $scope.data.size);
                    $scope.option.count = $scope.country.totalIndex > 10 ? 10 : $scope.country.totalIndex;
                    $scope.option.total = $scope.country.total;
                    //图片下载
                    $scope.download = function() {
                        /* var src = "http://192.168.3.127:8080/apis/Api-App/user/qrcode/download?inviteCode=" + $scope.countrd;*/
                        /*   var src = $rootScope.baseUrl + "user/qrcode/download?inviteCode=" +$scope.countrd;*/
                        var src = $rootScope.baseUrl + "user/qrcode/download/" + $scope.countrd + "/" + $rootScope.hostUrl + "/" + $rootScope.language;
                        Services.consoleserice("debug信息", src);
                        var $a = document.createElement('a');
                        $a.setAttribute("href", src);
                        $a.setAttribute("download", "");

                        var evObj = document.createEvent('MouseEvents');
                        evObj.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
                        $a.dispatchEvent(evObj);

                    }
                })
            }
            //邀请记录
            $scope.account = "";
            if (sessionStorage.token) {
                var account = sessionStorage.account;
                if (account.indexOf("@") != -1) {
                    var accounts = account.split("@");
                    $scope.account = $filter('limitTo')(accounts[0], accounts[0].length - 4) + "****@" + accounts[1];
                } else {
                    $scope.account = $filter('limitTo')(account, 3) + "****" + $filter('limitTo')(account, -4);
                }
                $scope.getdatafun(1)
            }




        }]);
});