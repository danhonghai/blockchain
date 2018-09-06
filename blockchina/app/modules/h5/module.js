define( [
    '../../app' 
] , function ( controllers ) {
    controllers.controller( 'RegisterController' , ['$scope', '$rootScope', 'Services','TipService','$filter','$stateParams','$state',function ( $scope,$rootScope,Services,TipService,$filter,$stateParams,$state) {
		$rootScope.language = 1;
        $rootScope.lang = chinese;
		$scope.params = {
			inviteCode:$stateParams.inviteCode || ""
		};
		$scope.phoneParams = {};
		$scope.currentType = 1;
		var phoneReg = /^[1][3456789][0-9]{9}$/;
		//获取图形验证码
		$scope.getCaptcha = function(){
			Services.getData("captcha",{},function(data){
				$scope.imgCode = "data:image/png;base64,"+data.body.img;
				$scope.params.captoken = data.body.token;
			})
		}
		$scope.getCaptcha();
		//切换注册类型
		$scope.regTypeChange = function(type){
			$scope.currentType = type;
			if(type == 1){//手机注册
				$scope.phoneParams = {};
				$scope.countryItem = $scope.countryList[0];
				$scope.mobileArea = $scope.countryItem.areaCode;
			}else{
				$scope.emialParams = {};
				$scope.emialParams.country = $scope.countryList[0].id;
			}
			$scope.getCaptcha();
		}
		//获取国籍信息
		Services.getData("countryInfo",{},function(data){
			$scope.countryList = data.body.countryInfoList;
			$scope.countryItem = $scope.countryList[0];
			$scope.mobileArea = $scope.countryItem.areaCode;
		})
		
		//选择上国籍，改变区号
		$scope.selectCountry = function(){
			if($scope.countryItem){
				$scope.mobileArea = $scope.countryItem.areaCode;
			}else{
				$scope.mobileArea = "";
			}
			if($scope.mobileArea == '+86'){
				if (!phoneReg.test($scope.phoneParams.account)) {
			        $scope.accountValid = true;
			    }else{
			    	$scope.accountValid = false;
			    }
			}else{
				$scope.accountValid = false;
			}
		}

		//获取手机验证码
        $scope.getphoneCodefun = function (id) {
        	var country,capCode,account,type;
        	if($scope.currentType == 1){//手机注册
        		country = $scope.countryItem;
        		capCode = $scope.phoneParams.capCode;
        		account = $scope.phoneParams.account;
        		type = 1;
			}else{
				country = $scope.emialParams.country;
        		capCode = $scope.emialParams.capCode;
        		account = $scope.emialParams.account;
        		type = 2;
			}
			if($scope.currentType == 1 &&  $scope.accountValid){
				TipService.setMessage($rootScope.lang.lang183, 'error');
        		return false;
			}
        	if(!country){
        		TipService.setMessage($rootScope.lang.lang156, 'error');
        		return false;
        	}
        	if(!capCode){
        		TipService.setMessage($rootScope.lang.lang43, 'error');
        		return false;
        	}
            if (account) {
                var senddata = {
                    account: account,
                    capCode: capCode ,
                    captoken: $scope.params.captoken,
                    type: type,
                }
                Services.getData("code", senddata, function (data) {
					$scope.params.token = data.body.token;
                    $rootScope.timer(60, "#"+id);
                    TipService.setMessage($rootScope.lang.lang63, 'info');
                })
            } else {
            	var msg = $scope.currentType == 1 ? $rootScope.lang.lang41 : $rootScope.lang.lang193;
            	TipService.setMessage(msg, 'error');
            }
        };
        //注册
        $scope.registerFun = function(){
        	if($scope.currentType == 1){//手机注册
        		angular.extend($scope.params,$scope.phoneParams);
        		$scope.params.country = $scope.countryItem.id;
        		$scope.params.type = 1;
			}else{
				angular.extend($scope.params,$scope.emialParams);
				$scope.params.type = 0;
			}
			$scope.params.pwd  = MD5($scope.params.pwd);
			$scope.params.secondPwd  = MD5($scope.params.secondPwd);
			$scope.params.source = 1;
        	Services.consoleserice("debug信息", $scope.params);
        	Services.getData("register", $scope.params, function (data) {
        		$state.go("registerok");
            })
        	
        }

        //校验手机号
        $scope.phoneValid = function(){
        	if($scope.mobileArea == '+86'){
				if (!phoneReg.test($scope.phoneParams.account)) {
			        $scope.accountValid = true;
			    }else{
			    	$scope.accountValid = false;
			    }
			}else{
				$scope.accountValid = false;
			}
        }

    }]);
});

