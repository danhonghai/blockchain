define( [
    '../../app' 
] , function ( controllers ) {
    controllers.controller( 'LoginController' , ['$scope','Services','$timeout','$state','$filter','$rootScope','TipService',function ( $scope,Services,$timeout,$state,$filter,$rootScope,TipService) {
        $scope.params = {};
        $scope.data = {};
        //获取图形验证码
        $scope.getCaptcha = function(){
            Services.getData("captcha",{},function(data){
                $scope.imgCode = "data:image/png;base64,"+data.body.img;
                $scope.params.token = data.body.token;
            })
        }
        $scope.getCaptcha();
        //登录
        $scope.login = function(){
            $scope.params.type  = 1;
            $scope.params.password  = MD5($scope.data.password);
            Services.getData("login",$scope.params,function(data){
                sessionStorage.account = $scope.params.account;
                sessionStorage.userId = data.body.userId;
                //是否绑定谷歌验证0没有1有
                $scope.googleIsExist = data.body.googleIsExist;
                var account = sessionStorage.account;
                if (account.indexOf("@") != -1) {
                    var accounts = account.split("@");
                    $scope.account = $filter('limitTo')(accounts[0], accounts[0].length - 4) + "****@" + accounts[1];
                    $scope.accountType = 2;
                } else {
                    $scope.account = $filter('limitTo')(account, 3) + "****" + $filter('limitTo')(account, -4);
                    $scope.accountType = 1;
                }
                $('#sliderModal').modal('show');
                $scope.slideParams = {
                    userId : data.body.userId
                };
            })
        }

        //获取手机验证码
        $scope.getphoneCodefun = function (id) {
            var imgdata = {
                account: $scope.params.account,
                capCode: $scope.params.captcha ,
                captoken: $scope.params.token,
                type: $scope.accountType,
            }
            Services.getData("code", imgdata, function (data) {
                if($scope.accountType == 1){
                    $scope.slideParams.phoneToken = data.body.token;
                }else{
                    $scope.slideParams.emailToken = data.body.token;
                }
                $rootScope.timer(60, "#"+id);
                TipService.setMessage($rootScope.lang.lang63, 'info');
            })
        }

        //验证方法提交
        $scope.confirm = function(){
            Services.getData('loginCheckAuth',$scope.slideParams,function(data){
                $('#sliderModal').modal('hide');
                $('#sliderModal').on('hidden.bs.modal', function (e) {
                    sessionStorage.token = data.body.token;
                    $state.go("logged.index", null, {reload: true});
                })
            })
        }
    }]);
});
