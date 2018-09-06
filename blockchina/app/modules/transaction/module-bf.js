define( [
    '../../app' 
] , function ( controllers ) {
    controllers.controller( 'TransactionController' , ['$scope', '$rootScope', 'Services','$timeout', 'utilsService', 'TipService', function ( $scope, $rootScope, Services,$timeout, utilsService, TipService) {
        // 账户详情
        $scope.accountdata = {
            baseaccound:0,
            marketaccound:0
        };
        var cuur = true;
        window.onblur = function() {
            cuur = false;
        };
        window.onfocus = function() {
            cuur = true;
        }
        //页面渲染数据
        $scope.pagerightdata = {};
        // 初始化市场类型
        $scope.marketypes = [];
        // 当前市场类型
        $scope.object = {};
        //哪两个币的市场
        $scope.buyselltypes = [];
        //交易类型
        $scope.jytypes = [
            {name:"限价交易",success:true},
            {name:"市价交易",success:false},
        ];
        //获取市场类型
        Services.getDataget("getTransModel",function(marketdata){
            Services.consoleserice("debug信息", marketdata);
            var backdata = marketdata.body.transModel;
            $scope.object.title = backdata[0].name
            $scope.buyselltypes = $scope.object.title.split("/");
            for (var m = 0; m < backdata.length; m++) {
                var type =  backdata[m].name.replace("/","");
                    type = type.toLowerCase();
                    Services.consoleserice("debug信息", type)
                $scope.marketypes.push(
                    {name:backdata[m].name, value:backdata[m].value, type:type, success:m==0}
                );
            }
            Services.consoleserice("debug信息", $scope.marketypes);
            //获取账户资产
            if ($scope.islogin) {
                //获取账户资产信息
                $scope.getaccountinfo = function(){
                    Services.getData("auth/account/capital",$scope.capitaldata,function(capitalflowdata){
                        $scope.assetdatas = capitalflowdata.body.data.dataList;
                        Services.consoleserice("debug信息", $scope.assetdatas);
                        $scope.showmarketypes = false;
                        for (var m = 0; m<$scope.marketypes.length; m++) {
                            if ($scope.marketypes[m].success) {
                                $scope.changemarket(m);
                            }
                        }          
                    })
                }
                $scope.getaccountinfo();
                //获取部分委托数据
                $scope.postapplydata = {
                    "direct": 3,
                    "index": 0,
                    "size": 6
                }
                var applytype = 1;
                $scope.applytitfun = function(e){
                    applytype = e+1;
                    for (var o = 0; o < $scope.applytits.length; o++) {
                        if (o == e) {
                            $scope.applytits[o].success = true;
                        }else{
                            $scope.applytits[o].success = false;
                        }
                    }
                    $scope.authapply();
                }
                $scope.cztypetitfun = function(y){
                    $scope.postapplydata.direct = y+1;
                    for (var p = 0; p < $scope.cztypetits.length; p++) {
                        if (p == y) {
                            $scope.cztypetits[p].success = true;
                        }else{
                            $scope.cztypetits[p].success = false;
                        }
                    }
                    $scope.authapply();
                }
                $scope.authapply = function(){
                    Services.getData("auth/apply/" + applytype, $scope.postapplydata, function(capitalflowdata) {
                        $scope.pageapplydatas = capitalflowdata.body.data.dataList;
                    })
                }
                //撤单
                $scope.dele = function(id) {
                    Services.getData("auth/undo/apply/" + id, {}, function(deledata) {
                        if (deledata.code == 0000) {
                            TipService.setMessage(deledata.errMsg, 'success');
                        } else {
                            TipService.setMessage(deledata.errMsg, 'success');
                        }
                        $scope.authapply();
                        $scope.getaccountinfo();
                    })
                }
                $scope.authapply();
                //提交买卖
                $scope.buysellfun = function(type){
                    
                    //获取基础币种和交易币种
                    for (var h = $scope.assetdatas.length - 1; h >= 0; h--) {
                        if ($scope.buyselltypes[1] == $scope.assetdatas[h].coinName) {
                            $scope.submitbuyselldata.baseCoinId = $scope.assetdatas[h].coinId;
                        }
                        if ($scope.buyselltypes[0] == $scope.assetdatas[h].coinName) {
                            $scope.submitbuyselldata.transCoinId = $scope.assetdatas[h].coinId;
                        }
                    }
                    //判断买卖
                    if (type == "buy") {
                        $scope.submitbuyselldata.direct = 1;
                        if ($scope.buydata.price>$scope.klinedata.price*1.1) {
                            alert("买入价格不能大于市价的110%");
                            return false;
                        }else if ($scope.buydata.price<$scope.klinedata.price*0.9) {
                            alert("买入价格不能小于市价的90%");
                            return false;
                        }
                        $scope.submitbuyselldata.price = $scope.buydata.price;
                        $scope.submitbuyselldata.amount = $scope.buydata.number;
                    }else{
                        $scope.submitbuyselldata.direct = 2;
                        if ($scope.selldata.price>$scope.klinedata.price*1.1) {
                            alert("卖出价格不能大于市价的110%");
                            return false;
                        }else if ($scope.selldata.price<$scope.klinedata.price*0.9) {
                            alert("卖出价格不能小于市价的90%");
                            return false;
                        }
                        $scope.submitbuyselldata.price = $scope.selldata.price;
                        $scope.submitbuyselldata.amount = $scope.selldata.number;
                    }
                    //提交买卖请求
                    Services.getData("auth/transaction/trade/BuyAndSell",$scope.submitbuyselldata,function(buyselldata){
                        TipService.setMessage(buyselldata.errMsg, 'success');
                        $scope.authapply();
                        $scope.getaccountinfo();
                    })
                }
            }else{
                $scope.changemarket(0);
            }
        })
        $scope.Quicksellfun = function(price,number){
            $scope.buydata.price = price;
            $scope.buydata.number = number;
        }
        $scope.Quickbuyfun = function(price,number){
            $scope.selldata.price = price;
            $scope.selldata.number = number;
        }
        // 是否显示市场类型下拉框
        $scope.showmarketypes = false;
        //获取登入状态
        $scope.islogin = sessionStorage.token;
        //生成用户唯一标示UUID
        var uuid = utilsService.generateUUID().id;
        // 获取K线参数
        $scope.data = {
            clientId:uuid,
            period:"1min",
            size:"1000",
            symbol:"ethbtc"
        }
        //socket开关
        var issocket = false;
        //订阅参数url
        var url1, url2;
        //K线类型配置
        $scope.klinetypes = [
            {name:"分时", success:false},
            {name:"1min", success:true},
            {name:"5min", success:false},
            {name:"15min", success:false},
            {name:"30min", success:false},
            {name:"60min", success:false},
            {name:"1day", success:false},
            {name:"1week", success:false},
            {name:"1mon", success:false},
        ]
        //生成k线参数
        $scope.klinedata = {
            canvasId:"main",    //显示K线的div id
            data:[],            //K线数据
            price:0,             //当前价格
            index:0
        }
        //提交买卖参数
        $scope.submitbuyselldata = {
          amount: 0,        //交易数量
          baseCoinId: 1,    //基础币种
          direct: 0,        //交易方向
          price: 0,         //交易价格
          transCoinId: 1,   //交易币种
          transModel: 1,    //市场类型
          transType: 1      //交易类型
        }
        //买入数据绑定
        $scope.buydata = {
        }
        //卖出数据绑定
        $scope.selldata = {
        }
        $scope.tradedata = {
            messageUser:uuid,
            transModel:'',
            transName:'',
            messageFrom:''
        }
        //K线历史数据
        var rawData = [];
        //账户资产数据
        $scope.assetdatas = [];

            $scope.jytypefun = function(index){
                $scope.submitbuyselldata.transType = index+1;
                for (var c = 0; c < $scope.jytypes.length;c++) {
                    if (index == c) {
                        $scope.jytypes[c].success = true;
                    }else{
                        $scope.jytypes[c].success = false;
                    }
                }
            }
        var myChart = echarts.init(document.getElementById("main"));
        $scope.capitaldata = {
            index:"0",
            size:"10"
        }
        $scope.applytits = [
            {name:"当前委托",type:1, success:true},
            {name:"历史委托",type:2, success:false}
        ];
        $scope.cztypetits = [
            {name:"买入",type:1, success:false},
            {name:"卖出",type:2, success:false},
            {name:"全部",type:3, success:true}
        ];
        //切换市场类型
        $scope.changemartype = function(){
            $scope.showmarketypes = !$scope.showmarketypes;
        }
        //选择市场类型
        $scope.changemarket = function(index){
            $scope.showmarketypes = false;
            for (var i = 0; i < $scope.marketypes.length; i++) {
                if (index == i) {
                    $scope.marketypes[i].success = true;
                    $scope.object.title = $scope.marketypes[i].name;
                    $scope.data.symbol = $scope.marketypes[i].type;
                    $scope.buyselltypes = $scope.object.title.split("/");
                }else{
                    $scope.marketypes[i].success = false;
                }
            }
            $scope.submitbuyselldata.transModel = $scope.marketypes[index].value;
            $scope.tradedata.transModel = $scope.marketypes[index].value;
            $scope.tradedata.transName = $scope.marketypes[index].name;
            for (var p = $scope.assetdatas.length - 1; p >= 0; p--) {
                if ($scope.buyselltypes[0] == $scope.assetdatas[p].coinName) {
                    $scope.accountdata.baseaccound = $scope.assetdatas[p].coinAvailable;
                }
                if ($scope.buyselltypes[1] == $scope.assetdatas[p].coinName) {
                    $scope.accountdata.marketaccound = $scope.assetdatas[p].coinAvailable;
                }
            }
            if (issocket) {
                $rootScope.unsubscribe1();
                $rootScope.unsubscribe2();
            }
            $scope.buydata.price = "";
            $scope.buydata.number = "";
            $scope.selldata.price = "";
            $scope.selldata.number = "";
            $scope.showkinefun(0)
            $scope.getmarketfun();
        }
        //画K线和分时线
        $scope.showkinefun = function(index){
            //图形加载等待
            myChart.showLoading({
                text:"请稍后...",
                textColor:"#fff",
                maskColor: 'rgba(0, 0, 0, 0.8)',
                color:"#659EFF"
            });
            //关闭之前的订阅
            if (issocket) {
                $rootScope.unsubscribe();
            }
            if (index==0) {
                $scope.data.period = $scope.klinetypes[1].name;
            }else{
                $scope.data.period = $scope.klinetypes[index].name;
            }
            url1 = $scope.data.period;
            url2 = $scope.data.symbol;
            //获取图像历史数据
            Services.getData("websocket/kline",$scope.data,function(addressbackdata){
                //图形加载等待隐藏
                myChart.hideLoading();
                if (addressbackdata.body && addressbackdata.body.kline) {
                    var oldkline = addressbackdata.body.kline;
                    rawData = [];
                    for (var i = oldkline.length - 1; i >= 0; i--) {
                        rawData.push([Services.timestampToTime(oldkline[i].id*1000),oldkline[i].open,oldkline[i].close,oldkline[i].low,oldkline[i].high])
                    }
                    $scope.klinedata.data = rawData;
                    $scope.klinedata.price = rawData[rawData.length-1][1];
                    $scope.klinedata.color = "#25968D";
                    $scope.klinedata.index = index;
                    //判断是分时图还是K线图
                    if (index==0) {
                        Services.minhouseline($scope.klinedata,myChart);
                    }else{
                        Services.drawkline($scope.klinedata,myChart);
                    }
                    //切换当前图像类型
                    for (var i = 0; i < $scope.klinetypes.length; i++) {
                        if (i==index) {
                            $scope.klinetypes[i].success = true;
                        }else{
                            $scope.klinetypes[i].success = false;
                        }
                    }
                    //订阅新的图像
                    $rootScope.subscribe($scope.data.symbol,$scope.data.period, uuid, function(socketdata){
                        issocket = true;
                        socketdata = angular.fromJson(socketdata.body)
                        if ($scope.klinedata.price>socketdata.tick.close) {
                            $scope.klinedata.color = "#ae4e54";
                        }else{
                            $scope.klinedata.color = "#25968D";
                        }
                        $scope.klinedata.price = socketdata.tick.close;
                        if (index==0) {
                            rawData.push([Services.timestampToTime(socketdata.tick.id*1000),socketdata.tick.open,socketdata.tick.close,socketdata.tick.low,socketdata.tick.high]);
                            rawData.shift();
                            Services.minhouseline($scope.klinedata,myChart);
                        }else{
                            rawData[rawData.length-1].close = socketdata.tick.close;
                            Services.drawkline($scope.klinedata,myChart);
                        }
                        if (cuur) {
                            document.title = "哈耶克交易所，全球领先的数字资产交易平台";
                        }else{
                            document.title = $scope.klinedata.price + $scope.object.title+"当前价格";
                        }
                        $scope.$apply();
                    }) 
                }
            })
        }
        //获取市场详情和订单详情参数
        $scope.getmarketfun = function(){
            for (var n = 0; n < $scope.marketypes.length; n++) {
                if ($scope.marketypes[n].success) {
                        $scope.tradedata.transModel = $scope.marketypes[n].value;
                        $scope.tradedata.transName = $scope.marketypes[n].name;
                        $scope.tradedata.messageFrom = $scope.marketypes[n].name + '/' + uuid;
                }
            }
            Services.consoleserice("debug信息", $scope.tradedata)
            /*$timeout(function(){},500)*/
                Services.getData("coin/realTimeData",$scope.tradedata,function(applydata){
                    Services.consoleserice("debug信息", applydata);
                    $scope.pagerightdata = applydata.body.realTimeData;
                    $rootScope.transaction1($scope.tradedata.transName+'/apply',function(dyapplydata){
                        var applydataobj = angular.fromJson(dyapplydata.body);
                        Services.consoleserice("debug信息", applydataobj);
                        $scope.pagerightdata.applyIn = applydataobj.applyIn;
                        $scope.pagerightdata.applyOut = applydataobj.applyOut;
                        $scope.$apply();
                        if ($scope.islogin) {
                            $scope.cztypetitfun(2)
                        }
                    })
                    $rootScope.transaction2($scope.tradedata.transName+'/order',function(dyorderdata){
                        var orderdataobj = angular.fromJson(dyorderdata.body);
                        Services.consoleserice("debug信息", orderdataobj);
                        $scope.pagerightdata.orders = orderdataobj.orders;
                        $scope.pagerightdata.tradeMarketRes = orderdataobj.tradeMarketRes;
                        $scope.$apply();
                    })
                })
            
        }
    }]);
});

