define([
    '../../app'
], function(controllers) {
    controllers.controller('RechargeController', ['$scope', '$rootScope', 'Services', '$timeout', '$stateParams', 'TipService', '$rootScope', function($scope, $rootScope, Services, $timeout, $stateParams, TipService, $rootScope) {
        $scope.copyText = function(evt) {
            var Url1 = document.getElementById("text");
            Url1.select(); //选择对象    
            var tag = document.execCommand("Copy"); //执行浏览器复制命令    
            if (tag) {
                TipService.setMessage($rootScope.lang.lang164, 'info');

            };
        };

        /*获取充币地址*/
        var coinid = $stateParams.id;
        var coinname = $stateParams.coinName;
        $scope.coin = coinname;
        var userId = sessionStorage.getItem('userId');
        $scope.address = function() {
            Services.getData("/auth/coinWallet/createAddress", { userId: userId, coinId: coinid }, function(coindata) {
                $scope.coinlists = coindata.body;

            })
        }
        $scope.address()
        
        Services.getData("draw/coin/rate/"+$scope.coin,{},function(sxfdata){
            $scope.minChargeNumber = sxfdata.body.data.minChargeNumber;
        })

    }]);
});