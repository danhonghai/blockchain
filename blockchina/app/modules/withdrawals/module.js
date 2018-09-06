define( [
    '../../app' 
] , function ( controllers ) {
    controllers.controller( 'WithdrawalsController' , ['$scope', '$rootScope', 'Services','$timeout', '$stateParams', 'TipService','$rootScope','$filter','$state', function ( $scope, $rootScope, Services,$timeout,$stateParams, TipService,$rootScope,$filter,$state) {
        	var coinid = angular.fromJson($stateParams.id);
        	$scope.data = {
        		coinId:coinid,
        		coinAddress:null,
        		coinAmount:0
        	};
        	$scope.pagedata = {
        		value:0.1
        	};
        	$scope.imgdata = {};
	        Services.getData("coin/list",{},function(coindata){
	        	$scope.coinlists = coindata.body.data;
	        	$scope.changecoin();
	        })
	        $scope.changecoin = function(){
		        Services.getData("auth/draw/address?coinId="+$scope.data.coinId,{},function(addressdata){
		        	$scope.addresslists = addressdata.body.data;
		        	if ($scope.addresslists.length>0) {
		        		$scope.data.coinAddress = $scope.addresslists[0].account;
		        	}else{
		        		TipService.setMessage($rootScope.lang.lang319, 'error');
		        		$scope.data.coinAddress = null;
		        	}
		        	for (var i = $scope.coinlists.length - 1; i >= 0; i--) {
		        		if ($scope.coinlists[i].id==$scope.data.coinId) {
		        			$scope.pagedata.coinName = $scope.coinlists[i].name;
		        		}
		        	}
	        		Services.consoleserice("debug信息", $scope.pagedata.coinName);
		        	Services.getData("auth/draw/coin/info/"+$scope.data.coinId,{},function(coindata){
			        	Services.consoleserice("debug信息", coindata);
			        	$scope.pagedata.coinAvailable = coindata.body.data.coinAvailable;
			        })
			        Services.getData("draw/coin/rate/"+$scope.pagedata.coinName,{},function(sxfdata){
			        	Services.consoleserice("debug信息", sxfdata);
			        	$scope.pagedata.value = sxfdata.body.data.sysFee;
			        	$scope.data.coinFee = sxfdata.body.data.sysFee;
			        	//$scope.data.walletName = sxfdata.body.data.walletName;
			        	$scope.pagedata.minDrawNumber = sxfdata.body.data.minDrawNumber;
			        })
		        })
	        }
	        
	        //获取个人信息
            Services.getData("auth/certificate/user/info", {}, function(data) {
                $scope.userInfo = data.body.userInfo;
                var phone = data.body.userInfo.phone;
                var email = data.body.userInfo.email;
                var emailArr = email ? email.split("@") : [];
                $scope.userInfo.phoneFilter = phone ? $filter('limitTo')(phone, 3) + "****" + $filter('limitTo')(phone, -4) : "";
                $scope.userInfo.emailFilter = email ? $filter('limitTo')(emailArr[0], emailArr[0].length - 4) + "****@" + emailArr[1] : "";
            })
	        //获取图形验证码
			$scope.getCaptcha = function(){
				Services.getData("captcha",{},function(data){
					Services.consoleserice("debug信息", data);
					$scope.imgCode = "data:image/png;base64,"+data.body.img;
					$scope.imgdata.captoken = data.body.token;
				})
			}
			$scope.getCaptcha();
			//获取手机验证码
        	$scope.getphoneCodefun = function (id,account,type) {
				if (!$scope.imgdata.capCode) {
					TipService.setMessage($rootScope.lang.lang43, 'error');
				}else{
					$scope.imgdata.account = account;
					$scope.imgdata.type = type;
	        		Services.getData("code", $scope.imgdata, function (phonedata) {
						if(type == 1){
	        				$scope.data.token = phonedata.body.token;
	        				$scope.data.account = account;
	        			}else{
							$scope.data.emailToken = phonedata.body.token;
	        				$scope.data.email = account;
	        			}
	                    $rootScope.timer(60, "#"+id);
	                    TipService.setMessage($rootScope.lang.lang63, 'info');
	                })
				}
        	}
	        $scope.withdrawfun = function(){
	        	if ($scope.data.coinAmount >$scope.pagedata.coinAvailable) {
	        		TipService.setMessage($rootScope.lang.lang320, 'error');
	        	}else{
	        		var newParams = {};
		            angular.extend(newParams,$scope.data);
		            newParams.capitalPwd = MD5($scope.data.capitalPwd);
		            Services.consoleserice("debug信息", newParams);
		        	Services.getData("auth/draw/coin",newParams,function(withdata){
						TipService.setMessage($rootScope.lang.lang321, 'info');
						$state.go("logged.assetscentre_capital");
					})
	        	}
	        }

    }]);
});

