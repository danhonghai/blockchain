define([
    '../../app'
], function(controllers) {
    controllers
        .controller('LoginController', ['$scope', '$state', 'Services','$rootScope','$http', function($scope, $state, Services,$rootScope,$http) {
            $scope.login = function() {
                Services.getData("noauth/login", $scope.params, function(data) {
                    sessionStorage.token = data.data.token;
                    sessionStorage.setItem("userName", data.data.userName);
                    $scope.userName = sessionStorage.getItem("userName");
                    console.log( $scope.userName)
                    $state.go('logged.index');
                });
            };
        }]);
});