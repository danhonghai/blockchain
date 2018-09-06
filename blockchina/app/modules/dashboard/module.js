define([
    '../../app'
], function(controllers) {
    controllers
        .controller('DashboardController', ['$scope', '$interval', 'Services', '$timeout', '$rootScope', '$state', '$stateParams', 'TipService', '$filter', function($scope, $interval, Services, $timeout, $rootScope, $state, $stateParams, TipService, $filter) {
            //获取点卡方案
            $scope.loadData = function() {
                Services.getDataget("pointCard/programs", function(capitalflowdata) {
                    $scope.pagedatas = capitalflowdata.body.programs;
                    if ($scope.pagedatas.length > 0) {
                        $scope.dele($scope.pagedatas[0].programId);
                    }
                })
            }
            $scope.loadData()
            //获取点卡活动
            $scope.dele = function(id) {
                for (var i = 0; i < $scope.pagedatas.length; i++) {
                    if (id == $scope.pagedatas[i].programId) {
                        $scope.currentActivity = $scope.pagedatas[i];
                    }
                    /*        Services.consoleserice("debug信息", $scope.currentActivity.startTime)
                            Services.consoleserice("debug信息", $scope.currentActivity.endTime)*/
                }
                Services.getDataget("pointCard/activity/" + id, function(deledata) {
                    $scope.gedatas = deledata.body.activities;
                })
            }
            //倒计时时间
            $scope.ti = {
                times: '00:00:01',
                times1: '00:00:01',
                timesCopy: '00:00:00'
            }
            $scope.$watch('currentActivity', function(value, value1) {
                if (value) {
                    $interval(function() {
                        var endTime = value.endTime;
                        var startTime = value.startTime;
                        var now = new Date().getTime();
                        if ($scope.ti.times != $scope.ti.timesCopy) {
                            $scope.ti.times = $filter('date')((endTime - now), 'HH:mm:ss');
                            $scope.ti.times1 = $filter('date')((now - startTime), 'HH:mm:ss');
                        }
                    }, 1000);
                }
            })
        }])
        .controller('PurchaseController', ['$scope', 'Services', '$timeout', '$state', '$stateParams', function($scope, Services, $timeout, $state, $stateParams) {
            $scope.userId = sessionStorage.getItem('userId');
            $scope.activityId = angular.fromJson($stateParams.activityId);
            $scope.credit = angular.fromJson($stateParams.credit);
            $scope.activityCardType = angular.fromJson($stateParams.activityCardType);
            $scope.params = {
                account: 1,
                type: 1
            }
            //获取可用余额接口
            $scope.adess = function() {
                Services.getData("auth/coin/balance", { transName: $scope.params.type == 1 ? 'BTC' : 'ETH' }, function(data) {
                    $scope.coinlists = data.body.coinBalance;
                    for (var i = 0; i < $scope.coinlists.length; i++) {
                        $scope.curty = $scope.coinlists[i];

                    }
                })
            }
            $scope.adess()
            //获取币种信息接口
            $scope.address = function(userId, activityId) {
                Services.getDataget("pointCard/obtain/" + userId + '/' + activityId + '/' + $scope.params.type, function(coindata) {

                })
            }

        }]);
});