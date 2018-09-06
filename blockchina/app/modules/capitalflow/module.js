define( [
    '../../app' 
] , function ( controllers ) {
    controllers.controller( 'CapitalflowController' , ['$scope','Services','$timeout','$rootScope',function ( $scope,Services,$timeout,$rootScope) {       
        //查询参数
        $scope.data = {
        	index:"0",
        	size:"10",
        	type:"1",
        	beginTime:"",
        	endTime:"",
            startTime:"",
            overTime:"",
        }
        //查询筛选条件
        $scope.operations = [
        	{name:$rootScope.lang.lang68, success:true},
        	{name:$rootScope.lang.lang69, success:false},
        	{name:$rootScope.lang.lang70, success:false},
        	{name:$rootScope.lang.lang71, success:false}
        ]
        $scope.times = [
        	{name:$rootScope.lang.lang72, day:1, success:false},
        	{name:$rootScope.lang.lang73, day:7, success:false},
        	{name:$rootScope.lang.lang74, day:30, success:false}
        ]
        //类型按钮事件
        $scope.operationsfun = function(index){
        	for (var i = 0; i < $scope.operations.length; i++) {
        		if (i==index) {
        			$scope.operations[i].success = true;
        		}else{
        			$scope.operations[i].success = false;
        		}
        	}
        	$scope.data.type = index+1;
            $scope.screenfun(1);
        }
        //时间按钮事件
        $scope.timesfun = function(index){
        	for (var j = 0; j < $scope.times.length; j++) {
        		if (j==index) {
        			$scope.times[j].success = true;
                    Services.consoleserice("debug信息", Date.parse(new Date()));
                    $scope.data.endTime = Date.parse(new Date());
                    $scope.data.beginTime = Date.parse(new Date())-86400000*($scope.times[j].day);
                    $scope.data.startTime = Services.timestampToTime($scope.data.beginTime)
                    $scope.data.overTime = Services.timestampToTime($scope.data.endTime)
        		}else{
        			$scope.times[j].success = false;
        		}
        	}
            Services.timestampToTime(1528333502000)
            $scope.screenfun(1);
        }
        //设置分页的参数
        $scope.option = {
            curr: 1,
            all: 9999,
            count: $scope.data.size,
            total:999,
            click: function (page) {
                $scope.data.index++;
                $scope.screenfun(page);
            }
        }
        //查询函数
        $scope.screenfun = function(page){

            $scope.data.index = page-1;
        	Services.consoleserice("debug信息", $scope.data);
            $scope.data.beginTime = Services.timestamp($scope.data.startTime);
            $scope.data.endTime = Services.timestamp($scope.data.overTime);
            Services.getData("auth/account/capital/water",$scope.data,function(capitalflowdata){
                Services.consoleserice("debug信息", capitalflowdata);
                $scope.pagedata = capitalflowdata.body.data;
                $scope.option.curr = $scope.data.index+1;
                $scope.option.all = Math.ceil($scope.pagedata.total/$scope.data.size);
                $scope.option.count = $scope.pagedata.totalIndex>10?10:$scope.pagedata.totalIndex;
                $scope.option.total = $scope.pagedata.total;
            })
        }
        $scope.screenfun(1);
        //开始日期插件
        $("#startTime").datetimepicker({
            rtl: false,                    // false   默认显示方式   true timepicker和datepicker位置变换
            format:    'Y-m-d H:i',     // 设置时间年月日时分的格式 如: 2016/11/15 18:00
            formatTime:    'H:i',       // 设置时间时分的格式
            formatDate:    'Y-m-d',     // 设置时间年月日的格式       // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
            step: 60, 
            timepicker: true,
            maxDate:new Date(),
            endDate: Date(),
            onSelect:function(dateText,inst){
               $("#endTime").datepicker("option","minDate",dateText);
            }
        });
        //结束日期插件
        $("#endTime").datetimepicker({
            rtl: false,                    // false   默认显示方式   true timepicker和datepicker位置变换
            format:    'Y-m-d H:i',     // 设置时间年月日时分的格式 如: 2016/11/15 18:00
            formatTime:    'H:i',       // 设置时间时分的格式
            formatDate:    'Y-m-d',     // 设置时间年月日的格式     // new Date(), '1986/12/08', '-1970/01/05','-1970/01/05',
            step: 60, 
            timepicker: true,
            maxDate:new Date(),
            endDate: Date(),
            onSelect:function(dateText,inst){
                $("#startTime").datepicker("option","maxDate",dateText);
            }
        });
    }]);
});

