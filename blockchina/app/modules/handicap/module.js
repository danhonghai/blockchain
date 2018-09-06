define(['../../app'], function(controllers) {
    controllers.controller('HandicapController', ['$scope', '$rootScope', 'Services', '$timeout', 'utilsService', '$stateParams', function($scope, $rootScope, Services, $timeout, utilsService, $stateParams) {
        
        $scope.tradedata = {
            transModel:$stateParams.transModel,
            messageFrom:$stateParams.messageFrom,
            messageUser:$stateParams.messageUser,
            transName:$stateParams.transName
        }
        $scope.transmarkets = $stateParams.transName.split("/");
        var issocket = false;
        Services.getData("coin/realTimeData", $scope.tradedata, function(applydata) {
            var deaphdata = applydata.body.realTimeData;
            deaphdata.maxinprice = 0;
            deaphdata.maxoutprice = 0;
            for (var o = 0; o < deaphdata.applyIn.length; o++) {
                if (deaphdata.applyIn[o].totalAmount>deaphdata.maxinprice) {
                    deaphdata.maxinprice = deaphdata.applyIn[o].totalAmount;
                }
            }
            for (var p = 0; p < deaphdata.applyOut.length; p++) {
                if (deaphdata.applyOut[p].totalAmount>deaphdata.maxoutprice) {
                    deaphdata.maxoutprice = deaphdata.applyOut[p].totalAmount;
                }
            }
            deaphdata.applyOut = deaphdata.applyOut.reverse();
            $scope.pagerightdata = deaphdata;
            Services.consoleserice("debug信息", $scope.pagerightdata);
            if (issocket) {
                $rootScope.unsubscribe1();
            }
            $rootScope.transaction1($scope.tradedata.transName + '/apply', function(dyapplydata) {
                issocket = true;
                var pagerightdataapply = angular.fromJson(dyapplydata.body);
                pagerightdataapply.maxinprice = 0;
                pagerightdataapply.maxoutprice = 0;
                Services.consoleserice("debug信息", pagerightdataapply);
                for (var o = 0; o < pagerightdataapply.applyIn.length; o++) {
                    if (pagerightdataapply.applyIn[o].totalAmount>pagerightdataapply.maxinprice) {
                        pagerightdataapply.maxinprice = pagerightdataapply.applyIn[o].totalAmount;
                    }
                }
                for (var o = 0; o < pagerightdataapply.applyOut.length; o++) {
                    if (pagerightdataapply.applyOut[o].totalAmount>pagerightdataapply.maxoutprice) {
                        pagerightdataapply.maxoutprice = pagerightdataapply.applyOut[o].totalAmount;
                    }
                }
                pagerightdataapply.applyOut = pagerightdataapply.applyOut.reverse();
                $scope.pagerightdata = pagerightdataapply;
                $scope.$apply();
            })
        })
    }]);
});