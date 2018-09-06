define( [
    '../../app' 
] , function ( controllers ) {
    controllers.controller( 'AddressController' , ['$scope', '$rootScope', 'Services','TipService','$filter','$window',function ( $scope,$rootScope,Services,TipService,$filter,$window) {
        
	        $scope.data = {
				account: "",
				address: "",
				code: "",
				ggCode: "",
				id: 1,
				remark: "",
				token: ""
			}
			$scope.imgdata = {
				account:"",
				capCode:"",
				captoken:"",
				type:1
			};
			$scope.imgCode = "";
			$scope.addresslists = [];
			Services.getData("/coin/list",{},function(coindata){
	        	//Services.consoleserice("debug信息", coindata);
	        	$scope.coinlists = coindata.body.data;
	        })
			//获取地址列表
		    Services.getData("auth/draw/address",{},function(addressdata){
		    	//Services.consoleserice("debug信息", addressdata);
		    	$scope.addresslists = addressdata.body.data;
		    })
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
					//Services.consoleserice("debug信息", data);
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
        	//添加地址
	        $scope.addressfun = function(){
	        	var newParams = {};
	            angular.extend(newParams,$scope.data);
	            newParams.capitalPwd = MD5($scope.data.capitalPwd);
	            Services.consoleserice("debug信息", newParams);
	        	Services.getData("auth/add/draw/address",newParams,function(addressbackdata){
	        		$window.location.reload();
			    	TipService.setMessage($rootScope.lang.lang64, 'info');
			    })
	        }
	        //删除地址
	        $scope.deleteadrss = function(adress, coinId){
	        	//Services.consoleserice("debug信息", coinId);
	        	var deleadr = {
	        		address:adress,
	        		id:coinId
	        	};
	        	Services.getData("auth/clear/draw/address",deleadr,function(data){
					//Services.consoleserice("debug信息", data);
					if (data.success) {
			    		TipService.setMessage($rootScope.lang.lang65, 'info');
			    	}
			    	//重新获取地址列表
				    Services.getData("auth/draw/address",{},function(addressdata){
				    	//Services.consoleserice("debug信息", addressdata);
				    	$scope.addresslists = addressdata.body.data;
				    })
				})
	        }
    }]);
});

