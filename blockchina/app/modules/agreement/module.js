define([
    '../../app'
], function(controllers) {
    controllers
        //用户协议
        .controller('UseragreementController', ['$scope', 'Services', '$timeout', '$state', function($scope, Services, $timeout, $state) {


        }])
        //隐私条款
        .controller('PrivacypolicyController', ['$scope', 'Services', '$timeout', '$state', function($scope, Servicses, $timeout, $state) {


        }])
        //法律声明
        .controller('LegislationController', ['$scope', 'Services', '$timeout', '$state', function($scope, Services, $timeout, $state) {


        }])
        //关于我们
        .controller('AboutusController', ['$scope', 'Services', '$timeout', '$state', function($scope, Services, $timeout, $state) {


        }])
        //费率
        .controller('RateController', ['$scope', 'Services', '$timeout', '$state', function($scope, Services, $timeout, $state) {


        }])
        //帮助中心
        .controller('HelpcenterController', ['$scope', 'Services', '$timeout', '$state', function($scope, Services, $timeout, $state) {
            $scope.currentTypes = 1;
            $scope.loadDataes = function(type) {
                $scope.currentTypes = type || $scope.currentTypes;
            }


        }]);
});