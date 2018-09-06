define([
    '../../app'
], function(controllers) {
    controllers.controller('EntrustmentController', ['$scope', 'Services', '$timeout', '$rootScope', '$state', '$stateParams', 'TipService', function($scope, Services, $timeout, $rootScope, $state, $stateParams, TipService) {
        $scope.currentType = 1;
        $scope.selectTimes = 3; //默认全部
        //当前委托历史委托
        $scope.myRedCouponSend = {
            index: "0",
            size: "10"
        }
        //设置分页的参数
        $scope.option = {
            curr: 1,
            all: 9999,
            count: 10,
            total: 999,
            click: function(page) {
                $scope.myRedCouponSend.index++;
                $scope.loadData(page);
            }
        }
        //设置交易明细分页的参数
        $scope.myRedCouponSends = {
            index: "0",
            size: "10"
        }
        $scope.options = {
            curr: 1,
            all: 9999,
            count: 10,
            total: 999,
            click: function(page) {
                $scope.myRedCouponSends.index++;
                $scope.loadDatas(page);
            }
        }
        //查询数据
        $scope.loadData = function(page, type) {
            $scope.datalist = [];
            $scope.currentType = type || $scope.currentType;
            $scope.myRedCouponSend.direct = $scope.selectTimes ? $scope.selectTimes : '3';
            $scope.myRedCouponSend.index = page - 1;
            /*var url = $scope.currentType == '3' ? "auth/order" : "auth/apply/" + $scope.currentType;*/
            var url = "auth/apply/" + $scope.currentType;
            Services.getData(url, $scope.myRedCouponSend, function(capitalflowdata) {
                $scope.pagedatas = capitalflowdata.body.data;
                $scope.option.curr = $scope.myRedCouponSend.index + 1;
                $scope.option.all = Math.ceil($scope.pagedatas.total / $scope.myRedCouponSend.size);
                $scope.option.count = $scope.pagedatas.totalIndex > 10 ? 10 : $scope.pagedatas.totalIndex;
                $scope.datalist = capitalflowdata.body.data.dataList;
                $scope.option.total = $scope.pagedatas.total;
            })
        }
        $scope.loadData(1, 1);
        /*交易明细*/
        $scope.loadDatas = function(page, type) {
            $scope.datalist1 = [];
            $scope.currentType = type || $scope.currentType;
            $scope.myRedCouponSends.direct = $scope.selectTimes ? $scope.selectTimes : '3';
            $scope.myRedCouponSends.index = page - 1;
            var url = "auth/order";
            Services.getData(url, $scope.myRedCouponSends, function(capitalflowdata) {
                $scope.pagedatas1 = capitalflowdata.body.data;
                $scope.options.curr = $scope.myRedCouponSends.index + 1;
                $scope.options.all = Math.ceil($scope.pagedatas1.total / $scope.myRedCouponSends.size);
                $scope.options.count = $scope.pagedatas1.totalIndex > 10 ? 10 : $scope.pagedatas1.totalIndex;
                $scope.datalist1 = capitalflowdata.body.data.dataList;
                $scope.options.total = $scope.pagedatas1.total;
            })
        };

        //切换买入、卖出、全部
        $scope.selectTime = function(selectTime) {
            $scope.selectTimes = selectTime;
            if ($scope.currentType == 3) {
                $scope.loadDatas(1)
            } else {
                $scope.loadData(1)
            }

        }
        //撤单
        $scope.dele = function(id) {
            Services.getData("auth/undo/apply/" + id, {}, function(deledata) {
                var errMsg = deledata.errMsg.split('|');
                TipService.setMessage($rootScope.lang.lang91, 'info');
                $timeout(function() { $scope.loadData(1, 1) }, 500)

            })
        }

    }]);
});