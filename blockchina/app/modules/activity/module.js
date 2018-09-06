define( [
    '../../app' 
] , function ( controllers ) {
    controllers.controller( 'WorldcupController' , ['$scope', '$rootScope', 'Services','TipService','$filter',function ( $scope,$rootScope,Services,TipService,$filter) {
        //押注加减
    	$scope.changeNum = function(type){
            $scope.guessParams.count = $scope.guessParams.count || 1
    		if(type == 1){
    			$scope.guessParams.count = $scope.guessParams.count - 1 <= 0 ? 1 : $scope.guessParams.count - 1;
    		}else{
    			$scope.guessParams.count = $scope.guessParams.count*1 + 1 >= $scope.guessContent.credit ? parseInt($scope.guessContent.credit) : parseInt($scope.guessParams.count) + 1;
    		}
    	}
        //我的竞猜和历史竞猜切换
    	$scope.changeTab = function(type,event){
    		var e=window.event || event;
	        if(e.stopPropagation){
	            e.stopPropagation();
	        }else{
	            e.cancelBubble = true;
	        }

    		if($scope.currentTab == type){
    			$scope.currentTab  = false;
    		}else{
    			$scope.currentTab  = type;
    		}
            if(type == 1){
                $scope.myGuess();
            }else if(type == 2){
                $scope.guessHistory();
            }
    	}
        $scope.cancelClick = function(type,event){
            var e=window.event || event;
            if(e.stopPropagation){
                e.stopPropagation();
            }else{
                e.cancelBubble = true;
            }
        }
        //点击空白处关闭我的竞猜和历史竞猜切换
    	$scope.closeTab = function(event){
    		$scope.currentTab  = false;
    	} 

        //竞猜列表
        $scope.guessList = function(){
            Services.getData("api/guessList",{},function(data){
                $scope.pageList = data.body.page;
            })
        }
        $scope.guessList();
        //我的竞猜
        $scope.myGuess = function(){
            Services.getData("auth/myGuessInfo",{},function(data){
                $scope.myGuessList = data.body.dataList;
            })
        }
        //历史竞猜
        $scope.guessHistory = function(){
            Services.getData("auth/guessHistory",{index:1,size:64},function(data){
                $scope.historyList = data.body.data.dataList;
            })
        }
        //竞猜账户
        $scope.guessAccount = function(){
            Services.getData("auth/myGuessAccount",{},function(data){
                $scope.userinfo = data.body;
                var account = $scope.userinfo.nickName;
                if (account.indexOf("@") != -1) {
                    var accounts = account.split("@");
                    $scope.userinfo.nickName = $filter('limitTo')(accounts[0], accounts[0].length - 4) + "****@" + accounts[1];
                } else {
                    $scope.userinfo.nickName = $filter('limitTo')(account, 3) + "****" + $filter('limitTo')(account, -4);
                }
            })
        }
        $scope.guessAccount();
        //打开投注窗口
        $scope.openBetting = function(item){
            Services.getData("auth/guessContent"+item.id,{},function(data){
                $scope.guessContent = data.body.data;
                //初始化信息
                $scope.guessParams = {
                  "count": 1,//投注注数
                  "id": item.id, //竞猜赛场id 
                  "type": 0 //押注 0胜 1平 2负
                }
                $scope.currentType = 0;
            })
        }
        //猜胜负切换
        $scope.typeClick = function(type){
            $scope.currentType = type;
        }
        
        //立即投注
        $scope.BettingFun = function(){
            $scope.guessParams.type = $scope.currentType;
            Services.getData("auth/guess",$scope.guessParams,function(data){
                TipService.setMessage($rootScope.lang.lang453);
                $scope.guessAccount();
                $('#betting').modal('hide');
            })

        }

    }]);
});

