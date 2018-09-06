define( [
    '../../app' 
] , function ( controllers ) {
    controllers.controller( 'ForgetpasswordController' , ['$scope','Services','$timeout','$rootScope','TipService',function ( $scope,Services,$timeout,$rootScope,TipService) {
		$scope.navmenus = [
			{name:$rootScope.lang.lang130, istrue:false, success:true},
			{name:$rootScope.lang.lang131, istrue:false, success:false},
			{name:$rootScope.lang.lang132, istrue:false, success:false},
			{name:$rootScope.lang.lang351, istrue:false, success:false},
		];
		$scope.onnavmenu = function(index){
			if($scope.navmenus[index].istrue || (index > 0 && !$scope.navmenus[index-1].istrue)){
				return false;
			}
			for (var i = 0; i < $scope.navmenus.length; i++) {
				if (i==index) {
					$scope.navmenus[i].success = true;
				}else{
					$scope.navmenus[i].success = false;
				}
			}
		}
		$scope.accountPrams = {};
        //获取图形验证码
		$scope.getCaptcha = function(){
			Services.getData("captcha",{},function(data){
				$scope.imgCode = "data:image/png;base64,"+data.body.img;
				$scope.accountPrams.token = data.body.token;
			})
		}
		$scope.getCaptcha();
		//填写账户
		$scope.validAccount = function(){
			//判断账号是邮箱还是手机号
			if($scope.accountPrams.account.indexOf("@") != -1){
	    		$scope.accountType = 2; //邮箱
    		}else{
				$scope.accountType = 1; //手机
    		}
			Services.getData("account/valid",$scope.accountPrams,function(data){
				$scope.checkPrams = {
					account:data.body.account,
					infoToken: data.body.infoToken
				};
				$scope.navmenus[0].istrue = true;
				$scope.onnavmenu(1);
				$scope.getCaptcha();
			})
		};
		//获取手机验证码
        $scope.getphoneCodefun = function () {
        	if(!$scope.checkPrams.imageCode){
        		TipService.setMessage($rootScope.lang.lang43,'error');
        		//alert("请输入图片验证码");
        		return false;
        	}
            var senddata = {
                account: $scope.checkPrams.account,
                capCode: $scope.checkPrams.imageCode ,
                captoken: $scope.accountPrams.token,
                type: $scope.accountType ,
            }
            Services.getData("code", senddata, function (data) {
				$scope.checkPrams.token = data.body.token;
                $rootScope.timer(60, "#sendButton_forget");
                TipService.setMessage($rootScope.lang.lang63,'info');
                //alert("验证码发送成功，请注意查收.");
            })
        };
        //账号验证
        $scope.checkAccount = function(){
        	$scope.checkPrams.imageToken = $scope.accountPrams.token;
        	Services.getData("acount/check", $scope.checkPrams, function (data) {
				$scope.resetParams = {
					infoToken: $scope.checkPrams.infoToken
				};
				$scope.navmenus[1].istrue = true;
				$scope.onnavmenu(2);
            })
        }
        //重置密码
        $scope.resetPwd = function(){
        	var pwdParams = {
        		pwd: MD5($scope.resetParams.pwd),
        		secondPwd: MD5($scope.resetParams.secondPwd),
        		infoToken: $scope.resetParams.infoToken
        	}
        	Services.getData("reset/pwd", pwdParams, function (data) {
				$scope.navmenus[2].istrue = true;
				$scope.onnavmenu(3);
            })
        }
    }]);
});

