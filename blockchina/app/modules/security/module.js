define( [
    '../../app' 
] , function ( controllers ) {
	//安全设置
    controllers.controller( 'SecurityController' , ['$scope','Services','$timeout',function ( $scope,Services,$timeout) {
        //获取个人信息
        Services.getData("auth/certificate/user/info",{},function(data){
            $scope.userInfo = data.body.userInfo;
            $scope.userInfo.hasPhone = data.body.userInfo.phone ? true : false;
            $scope.userInfo.hasEmail = data.body.userInfo.email ? true : false;
        })
    }])
    //修改绑定手机号
    .controller( 'SetmobileController' , ['$scope','Services','$timeout','$state','$rootScope','TipService',function ( $scope,Services,$timeout,$state,$rootScope,TipService) {
        //获取个人信息
        Services.getData("auth/certificate/user/info",{},function(data){
            $scope.userInfo = data.body.userInfo;
            //判断是否绑定了手机和邮箱
            if($scope.userInfo.phone){//修改手机
                if($scope.userInfo.email){
                    $scope.getCaptcha();
                }else{
                    var msg = $rootScope.lang.lang194; 
                    if (confirm(msg)==true){ 
                        $state.go("logged.security_userinfo");
                    }else{ 
                        $state.go("logged.index");
                        return false;
                    } 
                }
            }else{//绑定手机
                $scope.getCaptcha();
            }
        });
        $scope.params = {};
        //获取图形验证码
        $scope.getCaptcha = function(){
            Services.getData("captcha",{},function(data){
                $scope.imgCode = "data:image/png;base64,"+data.body.img;
                $scope.params.imageToken = data.body.token;
            })
        }
        $scope.getCaptcha();
        //获取手机验证码
        $scope.getphoneCodefun = function (id) {
            if(!$scope.params.imageCode){
                TipService.setMessage($rootScope.lang.lang43, 'error');
                return false;
            }
            if(id == "sendButton_pre"){//原手机号
                var senddata = {
                    account: $scope.userInfo.phone,
                    capCode: $scope.params.imageCode ,
                    captoken: $scope.params.imageToken,
                    type: 1,
                }
            }else{
                if(!$scope.params.currentPhone){
                    TipService.setMessage($rootScope.lang.lang195, 'error');
                    return false;
                }
                var senddata = {
                    account: $scope.params.currentPhone,
                    capCode: $scope.params.imageCode ,
                    captoken: $scope.params.imageToken,
                    type: 1,
                }
            }
            Services.getData("code", senddata, function (data) {
                if(id == "sendButton_pre"){
                    $scope.params.preToken = data.body.token;
                }else{
                    $scope.params.currentToken = data.body.token;
                }
                $rootScope.timer(60, "#"+id);
                TipService.setMessage($rootScope.lang.lang63, 'info');
            })
        };

        //修改手机号
        $scope.updateMobile = function(){
            Services.getData("auth/certificate/phone/modify", $scope.params, function (data) {
                $state.go("logged.security_userinfo");
                TipService.setMessage($rootScope.lang.lang196, 'info');
            })
        }

        //绑定手机号
        $scope.bindMobile = function(){
            Services.getData("auth/certificate/phone/bind", $scope.params, function (data) {
                $state.go("logged.security_userinfo");
                TipService.setMessage($rootScope.lang.lang197, 'info');
            })
        }
    }])
    //修改登录密码
    .controller( 'UpdatepwdController' , ['$scope','Services','$timeout','$state','TipService','$rootScope',function ( $scope,Services,$timeout,$state,TipService,$rootScope) {
        //判断是否登录
        if(!sessionStorage.token){
            $state.go("logged.login");
        }
        $scope.params = {};
        $scope.updatepwd = function(){
            var newParams = {};
            angular.extend(newParams,$scope.params);
            newParams.prePassword = MD5($scope.params.prePassword);
            newParams.currentPassword = MD5($scope.params.currentPassword);
            Services.getData("auth/certificate/pwd/modify",newParams,function(data){
                TipService.setMessage($rootScope.lang.lang198, 'info');
                Services.getData("logout",{},function(data){
                    sessionStorage.token = "";
                    sessionStorage.account = "";
                    sessionStorage.userId = "";
                    $scope.account = "";
                    $state.go("logged.login", null, {reload: true});
                })
            })
        }
    }])
    //设置资金密码
    .controller( 'SetfundpwdController' , ['$scope','Services','$timeout','$state','$rootScope','TipService',function ( $scope,Services,$timeout,$state,$rootScope,TipService) {
        
        //获取个人信息
        Services.getData("auth/certificate/user/info",{},function(data){
            $scope.userInfo = data.body.userInfo;
            //判断是否绑定了手机和谷歌验证器
            if($scope.userInfo.phone && $scope.userInfo.email && $scope.userInfo.googleAuth){
                $scope.getCaptcha();
            }else{
                var msg = $rootScope.lang.lang199; 
                if (confirm(msg)==true){ 
                    $state.go("logged.security_userinfo");
                }else{ 
                    $state.go("logged.index");
                    return false;
                } 
            }
        })
        $scope.params = {};
        //获取图形验证码
        $scope.getCaptcha = function(){
            Services.getData("captcha",{},function(data){
                $scope.imgCode = "data:image/png;base64,"+data.body.img;
                $scope.params.imageToken = data.body.token;
            })
        };
        //获取手机验证码
        $scope.getphoneCodefun = function (id) {
            if(!$scope.params.imageCode){
                TipService.setMessage($rootScope.lang.lang43, 'error');
                return false;
            }
            var senddata = {
                account: $scope.userInfo.phone,
                capCode: $scope.params.imageCode ,
                captoken: $scope.params.imageToken,
                type: 1,
            }
            Services.getData("code", senddata, function (data) {
                $scope.params.token = data.body.token;
                $rootScope.timer(60, "#sendButton_fund");
                TipService.setMessage($rootScope.lang.lang63, 'info');
            })
        };

        //设置资金密码
        $scope.setFundPwd = function(){
            $scope.params.type = $scope.userInfo.fundSite ? 2 : 1;
            var newParams = {};
            angular.extend(newParams,$scope.params);
            newParams.currentFundCode = MD5($scope.params.currentFundCode);
            Services.getData("auth/certificate/fund/set", newParams, function (data) {
                TipService.setMessage($rootScope.lang.lang200, 'info');
                $state.go("logged.security_userinfo");
            })
        }
        
    }])
    //绑定修改邮箱
    .controller( 'SetemailController' , ['$scope','Services','$timeout','$state','$rootScope','TipService',function ( $scope,Services,$timeout,$state,$rootScope,TipService) {
        //获取个人信息
        Services.getData("auth/certificate/user/info",{},function(data){
            $scope.userInfo = data.body.userInfo;
        });
        //获取图形验证码
        $scope.getCaptcha = function(){
            Services.getData("captcha",{},function(data){
                $scope.imgCode = "data:image/png;base64,"+data.body.img;
                $scope.params.imageToken = data.body.token;
            })
        }
        $scope.getCaptcha();
        $scope.params = {};
        //获取邮箱验证码
        $scope.getphoneCodefun = function (id) {
            
            if(!$scope.params.imageCode){
                TipService.setMessage($rootScope.lang.lang63, 'error');
                return false;
            }
            if(id == "sendButton_pre"){//原邮箱
                var senddata = {
                    account: $scope.userInfo.email,
                    capCode: $scope.params.imageCode ,
                    captoken: $scope.params.imageToken,
                    type: 2,
                }
            }else{
                if(!$scope.params.currentEmail){
                    TipService.setMessage($rootScope.lang.lang201, 'error');
                    return false;
                }
                var senddata = {
                    account: $scope.params.currentEmail,
                    capCode: $scope.params.imageCode ,
                    captoken: $scope.params.imageToken,
                    type: 2,
                }
            }
            Services.getData("code", senddata, function (data) {
                if(id == "sendButton_pre"){
                    $scope.params.preToken = data.body.token;
                }else{
                    $scope.params.token = data.body.token;
                }
                $rootScope.timer(60, "#"+id);
                TipService.setMessage($rootScope.lang.lang202, 'info');
            })
        };

        //绑定邮箱
        $scope.bindEmail = function(){
            Services.getData("auth/certificate/email/bind", $scope.params, function (data) {
                $state.go("logged.security_userinfo");
                TipService.setMessage($rootScope.lang.lang203, 'info');
            })
        }

        //修改邮箱
        $scope.updateEmail = function(){
            Services.getData("auth/certificate/email/modify", $scope.params, function (data) {
                $state.go("logged.security_userinfo");
                TipService.setMessage($rootScope.lang.lang204, 'info');
            })
        }
    }])
    //绑定修改谷歌验证器
    .controller( 'VerifygoogleController' , ['$scope','Services','$timeout','$state','TipService','$rootScope',function ( $scope,Services,$timeout,$state,TipService,$rootScope) {
        //获取个人信息
        Services.getData("auth/certificate/user/info",{},function(data){
            $scope.userInfo = data.body.userInfo;
        });
        //生成google验证码
        Services.getData("auth/google/auth/init",{},function(data){
            $scope.googleAuthRes = data.body.googleAuthRes;
            $scope.googleAuthRes.qrCode = "data:image/png;base64,"+data.body.googleAuthRes.qrCode
        });
        //复制密钥
        $scope.copyFun = function(){
            var key  = angular.element('#key')
            key.select(); //选择对象    
            var tag = document.execCommand("Copy"); //执行浏览器复制命令    
            if(tag){  
                TipService.setMessage($rootScope.lang.lang164, 'info');
            };  
        };
        $scope.params = {};
        //绑定谷歌验证器
        $scope.verifyGoogle = function(){
            $scope.params.currentVerifyKey = $scope.googleAuthRes.secretKey;
            Services.getData("auth/google/auth/verify",$scope.params,function(data){
                $state.go("logged.security_userinfo");
                TipService.setMessage($rootScope.lang.lang205, 'info');
            });
        }
        //修改谷歌验证器
        $scope.updateGoogle = function(){
            $scope.params.currentVerifyKey = $scope.googleAuthRes.secretKey;
            Services.getData("auth/google/auth/modified",$scope.params,function(data){
                $state.go("logged.security_userinfo");
                TipService.setMessage($rootScope.lang.lang206, 'info');
            });
        }
    }]);
});

