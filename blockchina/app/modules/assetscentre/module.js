define([
    '../../app'
], function(controllers) {
    controllers.controller('AssetscentreController', ['$scope', 'Services', '$timeout', '$state', '$rootScope', 'TipService', function($scope, Services, $timeout, $state, $rootScope, TipService) {
        $scope.data = {
            index: "0",
            size: "100"
        }
        //设置分页的参数
       /* $scope.option = {
            curr: 1,
            all: 9999,
            count: 5,
            total: 999,
            click: function(page) {
                $scope.data.index++;
                getdatafun(page);
            }
        }*/

        function getdatafun(page) {
            $scope.data.index = page - 1;
            Services.getData("auth/account/capital", $scope.data, function(capitalflowdata) {
                $scope.pagedatas = capitalflowdata.body.data;
                /*$scope.option.curr = $scope.data.index + 1;
                $scope.option.all = Math.ceil($scope.pagedatas.total / $scope.data.size);
                $scope.option.count = $scope.pagedatas.totalIndex > 10 ? 10 : $scope.pagedatas.totalIndex;
                $scope.option.total = $scope.pagedatas.total;*/
            })
        }

        getdatafun(1);

        $scope.tolinkwithdraw = function(id,coinName) {
            TipService.setMessage($rootScope.lang.lang513, 'info');
            //$state.go("logged.withdrawals_capital", { id: id});
        }
        $scope.tolinkrecharge = function(id,coinName) {
            //TipService.setMessage($rootScope.lang.lang418, 'info');
            $state.go("logged.recharge_capital", { id: id,coinName:coinName});
        }

        Services.getData("auth/account/credit",{}, function(data) {
            $scope.credit = data.body.credit;
            $scope.certification = data.body.certification;
        })

    }]);
});