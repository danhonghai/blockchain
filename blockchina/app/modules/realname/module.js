define( [
    '../../app',
    '../../directives/upload-picture'
] , function ( controllers ) {
    controllers.controller( 'RealnameController' , ['$scope','Services','$timeout','$window','TipService','$rootScope',function ( $scope,Services,$timeout,$window,TipService,$rootScope) {
        
		//个人信息查询
        Services.getJsonPost("auth/fiatAccount",{},function(data){
        	if(data.data.identification){//实名认证
        		$scope.isRealName = true;
        		//实名认证查询
		        Services.getData("auth/certificate/user/realNameQuery",{},function(data){
		        	$scope.realNameVerified = data.body.realNameVerified;
				});
        	}else{
        		$scope.isRealName = false;
        	}
		});
		//获取国籍信息
		Services.getData("countryInfo",{},function(data){
			$scope.countryList = data.body.countryInfoList;
		});
		//获取证件类型
		Services.getData("documentTypeInfo",{},function(data){
			$scope.documentTypeInfo = data.body.documentTypeInfo;
		});
		//是否显示高级认证
		$scope.showAuthHigh = false;
		$scope.params = {};
		//提交审核
		$scope.realnameFun = function(){
			if($scope.isRealName){
				$scope.showAuthHigh = true;
				$scope.queryInfo();
			}else{
				Services.getData("auth/certificate/user/realNameVerified",$scope.params,function(data){
					//$window.location.reload();
					TipService.setMessage($rootScope.lang.lang163, 'info');
					$scope.showAuthHigh = true;
					$scope.queryInfo();
				});
			}
			
		}
		$scope.currentTab = 1;
		//切换tab
		$scope.selectTab = function(type){
			if(type == 1){
				$scope.currentTab = type;
				$scope.showAuthHigh = false;
			}else if(type==2 && $scope.isRealName){//活体识别
				$scope.currentTab = type;
			}
		}

		$scope.queryInfo  = function(){
			//个人信息查询
	        Services.getJsonPost("auth/fiatAccount",{},function(data){
	        	//0:未认证，1：审核中，2：已认证，3：认证失败
	        	$scope.certification = data.data.certification;
	        	if($scope.certification == 0){
					$scope.currentStep = 0;
				}else if($scope.certification == 1){
					$scope.currentStep = 4;
				}else if($scope.certification == 2){
					$scope.currentStep = 7;
				}else{//审核失败
					$scope.currentStep = 5;
					$scope.queryReason();
				}
			});
		}
		$scope.dataParams = {};
		//返回
		$scope.back = function(){
		    $scope.currentStep = $scope.currentStep - 1;
		    $scope.dataParams.previewImgObj = "";
		}
		$scope.highParams = {};
		//下一步
		$scope.nextStep = function(){
			if($scope.currentStep == 0){
			  $scope.currentStep = 1;
			}else if($scope.currentStep == 1){
		      $scope.highParams['frontImg'] = $scope.dataParams.previewImgObj.previewImgFile;
		      $scope.highParams['frontName'] = $scope.dataParams.previewImgObj.fileName;
		      $scope.dataParams.previewImgObj = "";
		      $scope.currentStep = $scope.currentStep + 1;
		    }else if($scope.currentStep == 2){
		      $scope.highParams['backImg'] = $scope.dataParams.previewImgObj.previewImgFile;
		      $scope.highParams['backName'] = $scope.dataParams.previewImgObj.fileName;
		      $scope.dataParams.previewImgObj = "";
		      $scope.currentStep = $scope.currentStep + 1;
		    }else if($scope.currentStep == 3){
		      $scope.currentStep = 6;
		      $scope.highParams['handImg'] = $scope.dataParams.previewImgObj.previewImgFile;
		      $scope.highParams['handName'] = $scope.dataParams.previewImgObj.fileName;
		      //$scope.highParams['country'] = $scope.realNameVerified.country;
		      $scope.highParams['voice'] = "123";
		      Services.getJsonPost("auth/ac",$scope.highParams, function(data) {
		        $scope.currentStep = 4;
		        $scope.queryInfo();
		      })
		    }else if($scope.currentStep == 5){
		      $scope.currentStep = 1;
		    }
		}
		//查询审核失败的原因
		$scope.queryReason = function(){
			Services.getDataget("user/auth/result/3",function(data){
	        	$scope.result = data.body.result;
			});
		}
    }]);
});

