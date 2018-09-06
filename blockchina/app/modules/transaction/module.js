define(['../../app'], function(controllers) {
    controllers.controller('TransactionController', ['$scope', '$rootScope', 'Services', '$timeout', 'utilsService', 'TipService', '$state', '$filter', '$interval', function($scope, $rootScope, Services, $timeout, utilsService, TipService, $state, $filter, $interval) {
        $rootScope.$on('$stateChangeStart', function (event, toState, fromState){
            if (toState.url!="/transaction") {
                $rootScope.unsubscribe();
                $rootScope.unsubscribe1();
                $rootScope.unsubscribe2();
                $rootScope.unsubscribe3();
                if ($scope.islogin) {
                    $rootScope.unsubscribe4();
                }
            }
        });
       //  $scope.$on('$destroy',function(){  
       //     $interval.cancel(timeout_upd);  
       // })
        // 账户详情
        $scope.accountdata = {
            baseaccound: 0,
            marketaccound: 0
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
        $scope.transactionpair = [];
        // 当前市场类型
        $scope.object = {};
        //哪两个币的市场
        $scope.buyselltypes = [];
        //交易类型
        $scope.jytypes = [{
            name: $rootScope.lang.lang270,
            success: true
        }, {
            name: $rootScope.lang.lang271,
            success: false
        }, ];
        var myChart1 = echarts.init(document.getElementById("main1"));
        $scope.capitaldata = {
            index: "0",
            size: "100"
        }
        $scope.applytits = [{
            name: $rootScope.lang.lang98,
            type: 1,
            success: true
        }, {
            name: $rootScope.lang.lang99,
            type: 2,
            success: false
        }];
        $scope.cztypetits = [{
            name: $rootScope.lang.lang97,
            type: 3,
            success: true
        },{
            name: $rootScope.lang.lang70,
            type: 1,
            success: false
        },{
            name: $rootScope.lang.lang71,
            type: 2,
            success: false
        }];
        //获取登入状态
        $scope.islogin = sessionStorage.token;
        //生成用户唯一标示UUID
        var uuid = utilsService.generateUUID().id;
        // 获取K线参数
        $scope.data = {
            period: "1min",
            limit: "1000",
            symbol: "ETH/BTC"
        }
        //socket开关
        //var issocket = false;
        //var applyissocket = false;
        //var klineissocket = false;
        //订阅参数url
        var url1, url2;
        //K线类型配置
        $scope.klinetypes = [{
            name: "1min",
            success: true
        }, {
            name: "5min",
            success: false
        }, {
            name: "15min",
            success: false
        }, {
            name: "30min",
            success: false
        }, {
            name: "60min",
            success: false
        }, {
            name: "1day",
            success: false
        }, {
            name: "1week",
            success: false
        }, {
            name: "1mon",
            success: false
        }, ]
        //生成k线参数
        $scope.klinedata = {
            canvasId: "main",
            //显示K线的div id
            data: [],
            //K线数据
            price: 0,
            //当前价格
            index: 0
        }
        //提交买卖参数
        $scope.submitbuyselldata = {
            amount: 0,
            //交易数量
            baseCoinId: 1,
            //基础币种
            direct: 1,
            //交易方向
            price: 0,
            //交易价格
            transCoinId: 1,
            //交易币种
            transModel: 1,
            //市场类型
            transType: 1 //交易类型
        }
        //买入数据绑定
        $scope.buydata = {}
        //卖出数据绑定
        $scope.selldata = {}
        $scope.tradedata = {
            messageUser: uuid,
            transModel: '',
            transName: '',
            messageFrom: ''
        }
        //K线历史数据
        var rawData = [];
        //账户资产数据
        $scope.assetdatas = [];
        //获取部分委托数据
        $scope.postapplydata = {
            "direct": 3,
            "index": 0,
            "size": 10,
            "transPair": 2
        }
        //汇率对象
        $scope.exchangerate = {};
        //通知公告参数
        var noticedata = {
            language: 0,
            pageNumber: 1,
            pageSize: 6,
            type: 1
        }
        if ($rootScope.language == 1) {
            noticedata.language = 0;
        } else {
            noticedata.language = 1;
        }
        //价格数量精度
        $scope.accuracy = {};
        //账户总计折合
        $scope.accounttotle = {};
        $("html, body").animate({scrollTop: 85}, 100);
        // 挂买单单价格过滤

        $scope.buypriceNoNum = function(){
            var num;
            if ($scope.jytypes[0].success) {
                num = $scope.accuracy.minPriceDigitLimit;
            }else{
                num = $scope.accuracy.marketPriceDigitLimit;
            }
            var str = "";
            for (var i = 0; i <num; i++) {
                 str =  str + "\\d";
            }
            var regk = "/^(\\-)*(\\d+)\\.("+str+").*$/";//正则
            var reg = eval(regk);
            $scope.buydata.price = $scope.buydata.price.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
            $scope.buydata.price = $scope.buydata.price.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
            $scope.buydata.price = $scope.buydata.price.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
            $scope.buydata.price = $scope.buydata.price.replace(reg,'$1$2.$3');//只能输入两个小数  
            if($scope.buydata.price.indexOf(".")< 0 && $scope.buydata.price !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                $scope.buydata.price= parseFloat($scope.buydata.price); 
            } 
        }
        //挂买单数量过滤
        $scope.buynumNoNum = function(){
            var num = $scope.accuracy.minAmountDigitLimit;
            
            var str = "";
            for (var i = 0; i <num; i++) {
                 str =  str + "\\d";
            }
            var regk = "/^(\\-)*(\\d+)\\.("+str+").*$/";//正则
            var reg = eval(regk);
            $scope.buydata.number = $scope.buydata.number.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
            $scope.buydata.number = $scope.buydata.number.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
            $scope.buydata.number = $scope.buydata.number.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
            $scope.buydata.number = $scope.buydata.number.replace(reg,'$1$2.$3');//只能输入两个小数  
            if($scope.buydata.number.indexOf(".")< 0 && $scope.buydata.number !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                $scope.buydata.number= parseFloat($scope.buydata.number); 
            } 
        }
        // 挂卖单单价格过滤
        $scope.sellpriceNoNum = function(){
            var num = $scope.accuracy.minPriceDigitLimit;
            var str = "";
            for (var i = 0; i <num; i++) {
                 str =  str + "\\d";
            }
            var regk = "/^(\\-)*(\\d+)\\.("+str+").*$/";//正则
            var reg = eval(regk);
            $scope.selldata.price = $scope.selldata.price.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
            $scope.selldata.price = $scope.selldata.price.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
            $scope.selldata.price = $scope.selldata.price.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
            $scope.selldata.price = $scope.selldata.price.replace(reg,'$1$2.$3');//只能输入两个小数  
            if($scope.selldata.price.indexOf(".")< 0 && $scope.selldata.price !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                $scope.selldata.price= parseFloat($scope.selldata.price); 
            } 
        }
        //挂买单数量过滤
        $scope.sellnumNoNum = function(){
            var num;
            if ($scope.jytypes[0].success) {
                num = $scope.accuracy.minAmountDigitLimit;
            }else{
                num = $scope.accuracy.marketAmountDigitLimit;
            }
            var str = "";
            for (var i = 0; i <num; i++) {
                 str =  str + "\\d";
            }
            var regk = "/^(\\-)*(\\d+)\\.("+str+").*$/";//正则
            var reg = eval(regk);
            $scope.selldata.number = $scope.selldata.number.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
            $scope.selldata.number = $scope.selldata.number.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
            $scope.selldata.number = $scope.selldata.number.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
            $scope.selldata.number = $scope.selldata.number.replace(reg,'$1$2.$3');//只能输入两个小数  
            if($scope.selldata.number.indexOf(".")< 0 && $scope.selldata.number !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                $scope.selldata.number= parseFloat($scope.selldata.number); 
            } 
        }
        //获取市场类型
        Services.getData("market/type", "", function(data) {
            $scope.backdata = data.body.marketFliedRes;
            $scope.getejmarket($scope.backdata[0].marketCode, 0);

        })
        $scope.getejmarket = function(marketCode, index) {
            Services.getData("market/" + marketCode, "", function(ejdata) {
                $scope.transactionpair = ejdata.body.tradeMarketResList;
                for (var w = 0; w < $scope.backdata.length; w++) {
                    if (w == index) {
                        $scope.backdata[w].success = true;
                    } else {
                        $scope.backdata[w].success = false;
                    }
                }
                for (var u = 0; u < $scope.transactionpair.length; u++) {
                    var type = $scope.transactionpair[u].transName;
                    // type = type.toLowerCase();
                    $scope.transactionpair[u].type = type;
                }
                
                // if (issocket) {
                //     $rootScope.unsubscribe3();
                // }
                $rootScope.transaction3(function(marketsocketdata){
                    var msdata = angular.fromJson(marketsocketdata.body).tradeMarkets;
                    for (var m = 0; m < msdata.length; m++) {
                        for (var n = 0; n < $scope.transactionpair.length; n++) {
                            if (msdata[m].transName == $scope.transactionpair[n].transName) {
                                $scope.transactionpair[n].currentPrice = msdata[m].currentPrice;
                                $scope.transactionpair[n].oneDayGains = msdata[m].oneDayGains;
                            }
                        }
                    }
                }); 
                //获取汇率
                Services.getklineData(function(hldata){
                    var coinarr = [];
                    var exchangerate = hldata.rates;
                    for (var i = $scope.transactionpair.length - 1; i >= 0; i--) {
                        coinarr.push($scope.transactionpair[i].type.split("/")[0]);
                        coinarr.push($scope.transactionpair[i].type.split("/")[1]);
                    }
                    for (var l = coinarr.length - 1; l >= 0; l--) {
                        for (k in exchangerate) {
                            if (coinarr[l]==k) {
                                $scope.exchangerate[k] =  exchangerate.USDT / exchangerate[k]*exchangerate.CNY;
                            }
                        }
                    }
                    $timeout(function(){
                        $('[data-toggle="tooltip"]').tooltip();
                    },500)
                    Services.consoleserice("debug信息", $scope.exchangerate);

                });
                //获取账户资产
                if ($scope.islogin) {
                    //获取账户资产信息
                    $scope.getaccountinfo = function(active) {
                        Services.getData("auth/account/capital", $scope.capitaldata, function(capitalflowdata) {
                            $scope.assetdatas = capitalflowdata.body.data.dataList;
                            Services.consoleserice("debug信息", $scope.assetdatas);
                            Services.consoleserice("debug信息", $scope.assetdatas);
                            Services.getklineData(function(hldata){
                                var exchangerate = hldata.rates;
                                Services.consoleserice("debug信息", exchangerate);
                                $scope.accounttotle.btc = 0;
                                $scope.accounttotle.cny = 0;
                                for (var i = $scope.assetdatas.length - 1; i >= 0; i--) {
                                    if ($scope.assetdatas[i].coinAvailable!=0 || $scope.assetdatas[i].coinFreeze!=0) {
                                        if (exchangerate[$scope.assetdatas[i].coinName]) {
                                            $scope.accounttotle.btc = $scope.accounttotle.btc + ($scope.assetdatas[i].coinAvailable+$scope.assetdatas[i].coinFreeze)/exchangerate[$scope.assetdatas[i].coinName]*exchangerate.BTC;
                                            $scope.accounttotle.cny = $scope.accounttotle.cny + ($scope.assetdatas[i].coinAvailable+$scope.assetdatas[i].coinFreeze)/exchangerate[$scope.assetdatas[i].coinName]*exchangerate.CNY;
                                        }
                                    }
                                }
                                Services.consoleserice("debug信息", $scope.accounttotle);
                            })
                            // $scope.showtransactionpair = false;
                            if(active){
                                for (var m = 0; m < $scope.transactionpair.length; m++) {
                                    if ($scope.transactionpair[m].success) {
                                        $scope.changemarket(m);
                                    }
                                }
                            }else{
                                $scope.changemarket(0);
                            }
                        })
                    }
                    $scope.getaccountinfo(false);
                    var applytype = 1;
                    $scope.applytitfun = function(e) {
                        applytype = e + 1;
                        for (var o = 0; o < $scope.applytits.length; o++) {
                            if (o == e) {
                                $scope.applytits[o].success = true;
                            } else {
                                $scope.applytits[o].success = false;
                            }
                        }
                        $scope.authapply();
                    }
                    $scope.cztypetitfun = function(y) {
                        for (var p = 0; p < $scope.cztypetits.length; p++) {
                            if (p == y) {
                                $scope.cztypetits[p].success = true;
                                $scope.postapplydata.direct = $scope.cztypetits[p].type;
                            } else {
                                $scope.cztypetits[p].success = false;
                            }
                        }
                        $scope.authapply();
                    }
                    $scope.authapply = function() {
                        /*if (applyissocket) {
                            $rootScope.unsubscribe4();
                        }*/
                        
                        $timeout(function(){
                            Services.getData("auth/apply/" + applytype, $scope.postapplydata, function(capitalflowdata) {
                                $scope.pageapplydatas = capitalflowdata.body.data.dataList;
                                $rootScope.transaction4($scope.object.title,sessionStorage.userId,function(data){
                                    Services.getData("auth/apply/" + applytype, $scope.postapplydata, function(capitalflowdata) {
                                        //applyissocket = true;
                                        $scope.pageapplydatas = capitalflowdata.body.data.dataList;
                                    });
                                });
                            })
                        },200);
                    }
                    //撤单
                    $scope.dele = function(id) {
                        Services.getData("auth/undo/apply/" + id, {}, function(deledata) {
                            var errMsg = deledata.errMsg.split('|');
                            var msg = $rootScope.language == 1 ? errMsg[0] : errMsg[1];
                            TipService.setMessage(msg, 'info');
                            $scope.getaccountinfo(true);
                        })
                    }
                    $scope.cztypetitfun(0)
                    //提交买卖
                    $scope.buysellfun = function(type) {
                        //获取基础币种和交易币种
                        for (var h = $scope.assetdatas.length - 1; h >= 0; h--) {
                            if ($scope.buyselltypes[1].coinName == $scope.assetdatas[h].coinName) {
                                $scope.submitbuyselldata.baseCoinId = $scope.assetdatas[h].coinId;
                            }
                            if ($scope.buyselltypes[0].coinName == $scope.assetdatas[h].coinName) {
                                $scope.submitbuyselldata.transCoinId = $scope.assetdatas[h].coinId;
                            }
                        }
                        //判断买卖
                        if ($scope.submitbuyselldata.transType == 1) {
                            if (type == "buy") {
                                $scope.submitbuyselldata.direct = 1;
                                if (!$scope.buydata.price) {
                                    TipService.setMessage($rootScope.lang.lang298, 'error');
                                     return false;
                                }else{
                                    if (!$scope.buydata.number) {
                                        TipService.setMessage($rootScope.lang.lang300, 'error');
                                         return false;
                                    }else{
                                        if ($scope.buydata.price*1 > 1*$filter('number')($scope.pagerightdata.tradeMarketRes.currentPrice * 1.1, 6)) {
                                            TipService.setMessage($rootScope.lang.lang273, 'error');
                                            return false;
                                        } else if ($scope.buydata.price*1 < 1*$filter('number')($scope.pagerightdata.tradeMarketRes.currentPrice * 0.9, 6)) {
                                            TipService.setMessage($rootScope.lang.lang274, 'error');
                                            return false;
                                        }
                                    }
                                }
                                $scope.submitbuyselldata.price = $scope.buydata.price;
                                $scope.submitbuyselldata.amount = $scope.buydata.number;
                            } else {
                                $scope.submitbuyselldata.direct = 2;
                                if (!$scope.selldata.price) {
                                    TipService.setMessage($rootScope.lang.lang303, 'error');
                                     return false;
                                }else{
                                    if (!$scope.selldata.number) {
                                        TipService.setMessage($rootScope.lang.lang305, 'error');
                                         return false;
                                    }else{
                                        if ($scope.selldata.price*1 > 1*$filter('number')($scope.pagerightdata.tradeMarketRes.currentPrice * 1.1, 6)){
                                            TipService.setMessage($rootScope.lang.lang275, 'error');
                                            return false;
                                        } else if ($scope.selldata.price*1 < 1*$filter('number')($scope.pagerightdata.tradeMarketRes.currentPrice * 0.9, 6)) {
                                            TipService.setMessage($rootScope.lang.lang276, 'error');
                                            return false;
                                        }
                                    }
                                }
                                $scope.submitbuyselldata.price = $scope.selldata.price;
                                $scope.submitbuyselldata.amount = $scope.selldata.number;
                            }
                        } else {
                            if (type == "buy") {
                                $scope.submitbuyselldata.direct = 1;
                                $scope.submitbuyselldata.price = $scope.buydata.price;
                                $scope.submitbuyselldata.amount = "";
                            } else {
                                $scope.submitbuyselldata.direct = 2;
                                $scope.submitbuyselldata.price = "";
                                $scope.submitbuyselldata.amount = $scope.selldata.number;
                            }
                        }
                        //提交买卖请求
                        Services.getData("auth/transaction/trade/BuyAndSell", $scope.submitbuyselldata, function(buyselldata) {
                            TipService.setMessage($rootScope.lang.lang91, 'info');
                            $scope.getaccountinfo(true);
                        })
                    }
                    //买百分比
                    $scope.buynumfun = function(number){
                        Services.consoleserice("debug信息", number);
                        var bndata = $filter('number')(($scope.accountdata.marketaccound/$scope.buydata.price)*number, 4);
                        $scope.buydata.number = bndata.replace(/,/g,'');
                    }
                    //卖百分比
                    $scope.sellnumfun = function(number){
                        Services.consoleserice("debug信息", number);
                        var sndata = $filter('number')($scope.accountdata.baseaccound*number, 4);
                        $scope.selldata.number = sndata.replace(/,/g,'');
                    }
                }else{
                    $scope.changemarket(0)
                    $scope.accounttotle.btc = 0;
                    $scope.accounttotle.cny = 0;
                }
            })
            //获取公告数据
            Services.getData("publish", noticedata, function(noticedata) {
                $scope.noticelists = noticedata.body.article;
                $scope.linknotice = function(id) {
                    Services.consoleserice("debug信息", id);
                    $state.go("logged.noticedetail", { id: id });
                }
            })
        }

        $scope.Quicksellfun = function(price, number) {
            $scope.buydata.price = price;
            $scope.selldata.price = price;
        }

        $scope.jytypefun = function(index) {
            if (index==1) {
                $scope.buydata.price = null;
            }else{
                $scope.buydata.price = $scope.klinedata.price;
                $scope.selldata.price = $scope.klinedata.price;
            }
            $scope.selldata.number = null;
            $scope.submitbuyselldata.transType = index + 1;
            for (var c = 0; c < $scope.jytypes.length; c++) {
                if (index == c) {
                    $scope.jytypes[c].success = true;
                } else {
                    $scope.jytypes[c].success = false;
                }
            }
        }
        //选择市场类型
        $scope.changemarket = function(index) {
            /*if (issocket) {
                $rootScope.unsubscribe1();
                $rootScope.unsubscribe2();
            }*/
            /*if (klineissocket) {
                $rootScope.unsubscribe();
            }*/
            // if (applyissocket) {
            //     $rootScope.unsubscribe4();
            // }
            for (var i = 0; i < $scope.transactionpair.length; i++) {
                if (index == i) {
                    $scope.postapplydata.transPair = $scope.transactionpair[i].transModel;
                    $scope.transactionpair[i].success = true;
                    $scope.object.title = $scope.transactionpair[i].transName;
                    $scope.data.symbol = $scope.transactionpair[i].type;
                    var symbolArr = $scope.object.title.split("/");
                    $scope.buyselltypes[0]={coinName:symbolArr[0]};
                    $scope.buyselltypes[1]={coinName:symbolArr[1]};
                    Services.consoleserice("交易对信息", $scope.transactionpair[i]);
                    Services.getData("trans/"+$scope.transactionpair[i].transModel+"/params",{},function(data){
                        Services.consoleserice("价格数量精度", data);
                        $scope.accuracy = data.body.transPair;
                    });
                } else {
                    $scope.transactionpair[i].success = false;
                }
            }
            $scope.submitbuyselldata.transModel = $scope.transactionpair[index].transModel;
            $scope.tradedata.transModel = $scope.transactionpair[index].transModel;
            $scope.tradedata.transName = $scope.transactionpair[index].transName;
            for (var p = $scope.assetdatas.length - 1; p >= 0; p--) {
                if ($scope.buyselltypes[0].coinName == $scope.assetdatas[p].coinName) {
                    $scope.accountdata.baseaccound = $scope.assetdatas[p].coinAvailable;
                    $scope.buyselltypes[0].coinId = $scope.assetdatas[p].coinId;
                }
                if ($scope.buyselltypes[1].coinName == $scope.assetdatas[p].coinName) {
                    $scope.accountdata.marketaccound = $scope.assetdatas[p].coinAvailable;
                    $scope.buyselltypes[1].coinId = $scope.assetdatas[p].coinId;
                }
            }
            
            $scope.buydata.price = "";
            $scope.buydata.number = "";
            $scope.selldata.price = "";
            $scope.selldata.number = "";
            $scope.getmarketfun();
            if ($scope.islogin) {
                for (var c = 0;c < $scope.cztypetits.length; c++) {
                    if ($scope.cztypetits[c].success) {
                        $scope.cztypetitfun(c)
                    }
                }
            }
        }
        // $scope.starttime = 1527782400;
        //画K线和分时线
        // var timer;
        $scope.showkinefun = function(index) {
            var starttime = 1527782400;
            //图形加载等待
            myChart1.showLoading({
                text: "请稍后...",
                textColor: "#fff",
                maskColor: '#081957',
                //maskColor: 'rgba(0, 0, 0, 0.8)',
                color: "#659EFF"
            });
            if (index == 0) {
                $scope.data.period = $scope.klinetypes[0].name;
            } else {
                $scope.data.period = $scope.klinetypes[index].name;
            }
            /*url1 = $scope.data.period;
            url2 = $scope.data.symbol;*/
            // myChart1.hideLoading();
            // if (index == 0) {
            //     Services.minhouseline($scope.klinedata, myChart1);
            // } else {
            //     Services.drawkline(      $scope.klinedata, myChart1);
            // }

            //切换当前图像类型
            for (var i = 0; i < $scope.klinetypes.length; i++) {
                if (i == index) {
                    $scope.klinetypes[i].success = true;
                } else {
                    $scope.klinetypes[i].success = false;
                }
            }
            $scope.oldkline = [];
            var zoomstrt;
            var zoomend;
            function ajax_wx_pay_status(starttime) {
                var endtime = Date.parse(new Date())/1000;
                var params = {
                    "symbol": $scope.data.symbol,
                    "type": "kline",
                    "period": $scope.data.period,
                    "limit": $scope.data.limit,
                    "from": starttime,
                    "to": endtime
                }
                Services.getData("ws/kline",params,function(addressbackdata){
                    //图形加载等待隐藏
                    myChart1.hideLoading();
                    if (addressbackdata.body && addressbackdata.body.kline) {
                        $scope.oldkline = addressbackdata.body.kline.tick;
                        /*if (starttime == 1527782400 ) {
                            $scope.oldkline = addressbackdata.body.kline.tick;
                        }else{
                            if (addressbackdata.body.kline.tick.length>0) {
                                for (var m = 0; m < addressbackdata.body.kline.tick.length; m++) {
                                    $scope.oldkline.unshift(addressbackdata.body.kline.tick[m]);
                                }
                            }
                        }*/
                        rawData = [];
                        for (var i = $scope.oldkline.length - 1; i >= 0; i--) {
                            rawData.push([Services.timestampToTime($scope.oldkline[i].time * 1000), $scope.oldkline[i].open, $scope.oldkline[i].close, $scope.oldkline[i].low, $scope.oldkline[i].high, $scope.oldkline[i].amount])
                        }
                        // if (rawData[rawData.length - 1][1] == 0) {
                        //     for (var j = i; j >= 0; j--) {
                        //         if (rawData[j-1].close !=0) {
                        //             rawData[rawData.length - 1][1] = rawData[j-1][1];
                        //             rawData[rawData.length - 1][2] = rawData[j-1][2];
                        //             rawData[rawData.length - 1][3] = rawData[j-1][3];
                        //             rawData[rawData.length - 1][4] = rawData[j-1][4];
                        //             return false;
                        //         }
                        //     }
                        // }
                        $scope.klinedata.data = angular.copy(rawData);
                        if(rawData.length != 0){
                            $scope.klinedata.price = rawData[rawData.length - 1][2];
                        }
                        //$scope.klinedata.price = $scope.pagerightdata.tradeMarketRes.currentPrice;
                        $scope.buydata.price = $scope.pagerightdata.tradeMarketRes.currentPrice;
                        $scope.selldata.price = $scope.pagerightdata.tradeMarketRes.currentPrice;
                        if (rawData.length > 2 && rawData[rawData.length - 1][2]>=rawData[rawData.length - 2][2]) {
                            $scope.klinedata.color = "#25968D";
                        }else{
                            $scope.klinedata.color = "#d44b43";
                        }
                        $scope.klinedata.index = index;
                        if (!zoomstrt && zoomstrt != 0) {
                            if (rawData.length >= 2000) {
                                zoomstrt = 98;
                                zoomend = 100;
                            }else if(rawData.length >= 1700){
                                zoomstrt = 95;
                                zoomend = 100;
                            }else if(rawData.length >= 1500){
                                zoomstrt = 90;
                                zoomend = 100;
                            }else if(rawData.length >= 1000){
                                zoomstrt = 87;
                                zoomend = 100;
                            }else if(rawData.length >= 800){
                                zoomstrt = 85;
                                zoomend = 100;
                            }else if(rawData.length >= 300){
                                zoomstrt = 80;
                                zoomend = 100;
                            }else{
                                zoomstrt = 0;
                                zoomend = 100;
                            }
                        }
                        Services.drawkline($scope.klinedata, myChart1, zoomstrt, zoomend, function(data){
                            zoomstrt = data.start;
                            zoomend = data.end;
                        });
                        //oldtime = index;
                    }
                    var symbolArr = $scope.data.symbol.toLowerCase().split('/')
                    var symbol = symbolArr[0]+symbolArr[1];
                    
                   /* if (klineissocket) {
                        $rootScope.unsubscribe();
                    }*/
                    $rootScope.subscribe(symbol,$scope.data.period,function(data){
                        var transtr = $scope.object.title.replace("/","").toLowerCase();
                        var transsocket = data.headers.destination.split("/")[2];
                        if (transtr == transsocket) {
                            //klineissocket = true;
                            Services.consoleserice("debug信息", data);
                            data = angular.fromJson(data.body);
                            if(data.tick.length > 0){
                                if (Services.timestampToTime(data.tick[0].time*1000) == rawData[rawData.length-1][0]) {
                                    rawData[rawData.length-1][0] = Services.timestampToTime(data.tick[0].time *1000);
                                    rawData[rawData.length-1][1] = data.tick[0].open;
                                    rawData[rawData.length-1][2] = data.tick[0].close;
                                    rawData[rawData.length-1][3] = data.tick[0].low;
                                    rawData[rawData.length-1][4] = data.tick[0].high;
                                    rawData[rawData.length-1][5] = data.tick[0].amount;
                                }else{
                                    rawData.push([Services.timestampToTime(data.tick[0].time * 1000),data.tick[0].open, data.tick[0].close, data.tick[0].low, data.tick[0].high, data.tick[0].amount]);
                                }
                                
                                $scope.klinedata.data = angular.copy(rawData);
                                $scope.klinedata.price = rawData[rawData.length - 1][2];
                                if (rawData[rawData.length - 1][2]>=rawData[rawData.length - 2][2]) {
                                    $scope.klinedata.color = "#25968D";
                                }else{
                                    $scope.klinedata.color = "#d44b43";
                                }
                                Services.drawkline($scope.klinedata, myChart1, zoomstrt, zoomend, function(data){
                                    zoomstrt = data.start;
                                    zoomend = data.end;
                                });
                            }
                        }
                    })
                })
                /*Services.getklineData($scope.data.limit,$scope.data.period,$scope.data.symbol,starttime,endtime, function(addressbackdata) {
                    //图形加载等待隐藏
                    myChart1.hideLoading();
                    if (addressbackdata.body && addressbackdata.body.kline) {
                        if (starttime == 1527782400 ) {
                            $scope.oldkline = addressbackdata.body.kline.tick;
                        }else{
                            if (addressbackdata.body.kline.tick.length>0) {
                                for (var m = 0; m < addressbackdata.body.kline.tick.length; m++) {
                                    $scope.oldkline.unshift(addressbackdata.body.kline.tick[m]);
                                }
                            }
                        }
                        rawData = [];
                        for (var i = $scope.oldkline.length - 1; i >= 0; i--) {
                            rawData.push([Services.timestampToTime($scope.oldkline[i].time * 1000), $scope.oldkline[i].open, $scope.oldkline[i].close, $scope.oldkline[i].low, $scope.oldkline[i].high, $scope.oldkline[i].amount])
                        }
                        if (rawData[rawData.length - 1][1] == 0) {
                            for (var j = i; j >= 0; j--) {
                                if (rawData[j-1].close !=0) {
                                    rawData[rawData.length - 1][1] = rawData[j-1][1];
                                    rawData[rawData.length - 1][2] = rawData[j-1][2];
                                    rawData[rawData.length - 1][3] = rawData[j-1][3];
                                    rawData[rawData.length - 1][4] = rawData[j-1][4];
                                    return false;
                                }
                            }
                        }
                        $scope.klinedata.data = rawData;
                        $scope.klinedata.price = $scope.pagerightdata.tradeMarketRes.currentPrice;
                        // $scope.buydata.price = $scope.pagerightdata.tradeMarketRes.currentPrice;
                        // $scope.selldata.price = $scope.pagerightdata.tradeMarketRes.currentPrice;
                        $scope.klinedata.color = "#25968D";
                        $scope.klinedata.index = index;
                        if (!zoomstrt && zoomstrt != 0) {
                            if (rawData.length >= 2000) {
                                zoomstrt = 98;
                                zoomend = 100;
                            }else if(rawData.length >= 1700){
                                zoomstrt = 95;
                                zoomend = 100;
                            }else if(rawData.length >= 1500){
                                zoomstrt = 90;
                                zoomend = 100;
                            }else if(rawData.length >= 1000){
                                zoomstrt = 87;
                                zoomend = 100;
                            }else if(rawData.length >= 800){
                                zoomstrt = 85;
                                zoomend = 100;
                            }else if(rawData.length >= 300){
                                zoomstrt = 80;
                                zoomend = 100;
                            }else{
                                zoomstrt = 0;
                                zoomend = 100;
                            }
                        }
                        Services.drawkline($scope.klinedata, myChart1, zoomstrt, zoomend, function(data){
                            zoomstrt = data.start;
                            zoomend = data.end;
                        });
                        oldtime = index;
                    }
                })*/
                //$scope.starttime = endtime;
            }
            /*if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function(){ajax_wx_pay_status($scope.starttime)},3000);*/
            ajax_wx_pay_status(starttime);
        }
        //获取市场详情和订单详情参数
        $scope.getmarketfun = function() {
            // if (issocket) {
            //     $rootScope.unsubscribe();
            //     $rootScope.unsubscribe1();
            //     $rootScope.unsubscribe2();
            // }
            for (var n = 0; n < $scope.transactionpair.length; n++) {
                if ($scope.transactionpair[n].success) {
                    $scope.tradedata.transModel = $scope.transactionpair[n].transModel;
                    $scope.tradedata.transName = $scope.transactionpair[n].transName;
                    $scope.tradedata.messageFrom = $scope.transactionpair[n].transName + '/' + uuid;
                }
            }
            Services.consoleserice("debug信息", $scope.tradedata)
            /*$timeout(function(){},500)*/
            Services.getData("coin/realTimeData", $scope.tradedata, function(applydata) {
                Services.consoleserice("debug信息", applydata);
                var pagerightdata = applydata.body.realTimeData;

                $scope.depthfun(pagerightdata);
                // var depthdata = applydata.body.realTimeData;
                if (pagerightdata.applyIn) {
                    $scope.pagerightdata.applyIn = pagerightdata.applyIn.slice(0, 10);
                }
                if (pagerightdata.applyOut) {
                    if (pagerightdata.applyOut.length>10) {
                        $scope.pagerightdata.applyOut = pagerightdata.applyOut.slice(pagerightdata.applyOut.length-10, pagerightdata.applyOut.length).reverse();
                    }else{
                        $scope.pagerightdata.applyOut = pagerightdata.applyOut.reverse();
                    }
                }
                Services.consoleserice("debug信息", $scope.pagerightdata.applyOut);
                $scope.pagerightdata.orders = pagerightdata.orders;
                $scope.pagerightdata.tradeMarketRes = pagerightdata.tradeMarketRes;
                $scope.pagerightdata.maxinprice = 0;
                $scope.pagerightdata.maxoutprice = 0;
                for (var o = 0; o < $scope.pagerightdata.applyIn.length; o++) {
                    if ($scope.pagerightdata.applyIn[o].totalAmount>$scope.pagerightdata.maxinprice) {
                        $scope.pagerightdata.maxinprice = $scope.pagerightdata.applyIn[o].totalAmount;
                    }
                }
                for (var o = 0; o < $scope.pagerightdata.applyOut.length; o++) {
                    if ($scope.pagerightdata.applyOut[o].totalAmount>$scope.pagerightdata.maxoutprice) {
                        $scope.pagerightdata.maxoutprice = $scope.pagerightdata.applyOut[o].totalAmount;
                    }
                }
                for (var n = 0; n < $scope.klinetypes.length; n++) {
                    if ($scope.klinetypes[n].success) {
                        $scope.showkinefun(n)
                    }
                }
                $rootScope.transaction1($scope.tradedata.transName + '/apply', function(dyapplydata) {
                    //issocket = true;
                    Services.consoleserice("debug信息", dyapplydata);
                    var pagerightdataapply = angular.fromJson(dyapplydata.body);
                    $scope.depthfun(pagerightdataapply);
                    Services.consoleserice("debug信息", pagerightdataapply);
                    if (pagerightdataapply.applyIn) {
                        $scope.pagerightdata.applyIn = pagerightdataapply.applyIn.slice(0, 10);
                    }
                    if (pagerightdataapply.applyOut) {
                        if (pagerightdata.applyOut.length>10) {
                            $scope.pagerightdata.applyOut = pagerightdataapply.applyOut.slice(pagerightdataapply.applyOut.length-10, pagerightdataapply.applyOut.length).reverse();
                        }else{
                            $scope.pagerightdata.applyOut = pagerightdataapply.applyOut.reverse();
                        }
                    }
                    for (var o = 0; o < $scope.pagerightdata.applyIn.length; o++) {
                        if ($scope.pagerightdata.applyIn[o].totalAmount>$scope.pagerightdata.maxinprice) {
                            $scope.pagerightdata.maxinprice = $scope.pagerightdata.applyIn[o].totalAmount;
                        }
                    }
                    for (var o = 0; o < $scope.pagerightdata.applyOut.length; o++) {
                        if ($scope.pagerightdata.applyOut[o].totalAmount>$scope.pagerightdata.maxoutprice) {
                            $scope.pagerightdata.maxoutprice = $scope.pagerightdata.applyOut[o].totalAmount;
                        }
                    }

                    Services.consoleserice("debug信息", $scope.pagerightdata);
                    $scope.$apply();
                })
                $rootScope.transaction2($scope.tradedata.transName + '/order', function(dyorderdata) {
                    //issocket = true;
                    var orderdataobj = angular.fromJson(dyorderdata.body);
                    Services.consoleserice("debug信息", orderdataobj);
                    $scope.pagerightdata.orders = orderdataobj.orders;
                    $scope.pagerightdata.tradeMarketRes = orderdataobj.tradeMarketRes;
                    $scope.klinedata.price = $scope.pagerightdata.tradeMarketRes.currentPrice;
                    $scope.$apply();
                })
            })

        }
        $scope.depthfun = function(depthdata){

            $timeout(function(){
                var chartdiv = echarts.init(document.getElementById("chartdiv"));
                Services.depthline(depthdata,chartdiv);
            },200);
            // Services.getDataget(transModel+"/realTimeDepth", function(depthdata) {
            //     $scope.depthdata = depthdata.body.depth;
            //     console.log($scope.depthdata);
            //     $timeout(function(){
            //         var chartdiv = echarts.init(document.getElementById("chartdiv"));
            //         Services.depthline($scope.depthdata,chartdiv);
            //     },200);
            // })


            // var chart = AmCharts.makeChart("chartdiv", {
            //     "type": "serial",
            //     "theme": "dark",
            //     "dataLoader": {
            //         "url": $rootScope.baseUrl+transModel+"/realTimeDepth",
            //         "format": "json",
            //         "reload": 60,
            //         "postProcess": function(data) {

            //             // Function to process (sort and calculate cummulative volume)

            //             function processData(list, type, desc) {

            //                 // Convert to data points
            //                 for (var i = 0; i < list.length; i++) {
            //                     list[i] = {
            //                         value: Number(list[i][0]),
            //                         volume: Number(list[i][1]),
            //                     }
            //                 }

            //                 // Sort list just in case
            //                 list.sort(function(a, b) {
            //                     if (a.value > b.value) {
            //                         return 1;
            //                     } else if (a.value < b.value) {
            //                         return -1;
            //                     } else {
            //                         return 0;
            //                     }
            //                 });

            //                 // Calculate cummulative volume
            //                 if (desc) {
            //                     for (var i = list.length - 1; i >= 0; i--) {
            //                         if (i < (list.length - 1)) {
            //                             list[i].totalvolume = list[i + 1].totalvolume + list[i].volume;
            //                         } else {
            //                             list[i].totalvolume = list[i].volume;
            //                         }
            //                         var dp = {};
            //                         dp["value"] = list[i].value;
            //                         // dp[type + "volume"] = list[i].volume;
            //                         dp[type + "totalvolume"] = list[i].totalvolume;
            //                         res.unshift(dp);
            //                     }
            //                 } else {
            //                     for (var i = 0; i < list.length; i++) {
            //                         if (i > 0) {
            //                             list[i].totalvolume = list[i - 1].totalvolume + list[i].volume;
            //                         } else {
            //                             list[i].totalvolume = list[i].volume;
            //                         }
            //                         var dp = {};
            //                         dp["value"] = list[i].value;
            //                         // dp[type + "volume"] = list[i].volume;
            //                         dp[type + "totalvolume"] = list[i].totalvolume;
            //                         res.push(dp);
            //                     }
            //                 }

            //             }

            //             // Init
            //             var res = [];
            //             processData(data.body.depth.bids, "bids", true);
            //             processData(data.body.depth.asks, "asks", false);

            //             Services.consoleserice("debug信息", res);
            //             return res;
            //         }
            //     },
            //     "graphs": [{
            //         "id": "bids",
            //         "fillAlphas": 0.3,
            //         "lineAlpha": 1,
            //         "lineThickness": 2,
            //         "lineColor": "#25968D",
            //         "type": "step",
            //         "valueField": "bidstotalvolume",
            //         "balloonFunction": balloon
            //     }, {
            //         "id": "asks",
            //         "fillAlphas": 0.3,
            //         "lineAlpha": 1,
            //         "lineThickness": 2,
            //         "lineColor": "#bd4e4e",
            //         "type": "step",
            //         "valueField": "askstotalvolume",
            //         "balloonFunction": balloon
            //     }, {
            //         "lineAlpha": 0,
            //         "fillAlphas": 0.2,
            //         "lineColor": "#fff",
            //         "type": "column",
            //         "clustered": false,
            //         "valueField": "bidsvolume",
            //         "showBalloon": false
            //     }, {
            //         "lineAlpha": 0,
            //         "fillAlphas": 0.2,
            //         "lineColor": "#fff",
            //         "type": "column",
            //         "clustered": false,
            //         "valueField": "asksvolume",
            //         "showBalloon": false
            //     }],
            //     "categoryField": "value",
            //     "chartCursor": {},
            //     "balloon": {
            //         "textAlign": "left"
            //     },
            //     "valueAxes": [{
            //         "title": "",
            //         "color": "#fff"
            //     }],
            //     "categoryAxis": {
            //         "title": "",
            //         "minHorizontalGap": 100,
            //         "startOnAxis": true,
            //         "showFirstLabel": false,
            //         "showLastLabel": false,
            //         "color": "#fff"
            //     },
            //     // "export": {
            //     //     "enabled": true
            //     // }
            // });

            // function balloon(item, graph) {
            //     var txt;
            //     if (graph.id == "asks") {
            //         txt = "卖出价: <strong>" + formatNumber(item.dataContext.value, graph.chart, 6) + "</strong><br />" + "交易量: <strong>" + formatNumber(item.dataContext.askstotalvolume, graph.chart, 6) + "</strong>";
            //     } else {
            //         txt = "买入价: <strong>" + formatNumber(item.dataContext.value, graph.chart, 6) + "</strong><br />" + "交易量: <strong>" + formatNumber(item.dataContext.bidstotalvolume, graph.chart, 6) + "</strong>";
            //     }
            //     return txt;
            // }

            // function formatNumber(val, chart, precision) {
            //     return AmCharts.formatNumber(
            //     val, {
            //         precision: precision ? precision : chart.precision,
            //         decimalSeparator: chart.decimalSeparator,
            //         thousandsSeparator: chart.thousandsSeparator
            //     });
            // }
        }
        $scope.depthlink = function(){
            $state.go("logged.handicap",{transModel:$scope.tradedata.transModel, messageFrom:encodeURI($scope.tradedata.messageFrom), messageUser:$scope.tradedata.messageUser, transName:encodeURI($scope.tradedata.transName)});
        }

    }]);
});