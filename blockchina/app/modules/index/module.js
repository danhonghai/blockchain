define([
    '../../app'
], function(controllers) {
    controllers.controller('IndexController', ['$scope', 'Services', '$rootScope', 'TipService', '$timeout', '$state', function($scope, Services, $rootScope, TipService, $timeout, $state) {
        //var issocket = false;
        var data = {};
        if ($rootScope.language == 1) {
            data.language = 0;
        } else {
            data.language = 1;
        }
        var noticedata = {
            language: 0,
            pageNumber: 1,
            pageSize: 10,
            type: 1
        }
        if ($rootScope.language == 1) {
            noticedata.language = 0;
        } else {
            noticedata.language = 1;
        }
        Services.getDataget("home/page/loopPic/0/" + data.language, function(data) {
            Services.consoleserice("debug信息", data);
            $scope.banners = data.body.pageBanner;
            $('#carouselExampleIndicators').carousel({
                pause: true,
                interval: 5000
            });
            //获取市场类型
            Services.getData("market/type", "", function(data) {
                $scope.backdata = data.body.marketFliedRes;
                $scope.getejmarket($scope.backdata[0].marketCode, 0);
                //获取公告数据
                Services.getData("publish", noticedata, function(noticedata) {
                    $scope.noticelists = noticedata.body.article;
                    /*$timeout(function(){
                        var len = $(".scroll-con li").length;
                        if(len > 1){
                            textRoll=function(){
                                $(".scroll-wrap").find(".scroll-con").animate({
                                    marginTop : "-3rem"
                                },500,function(){
                                    $(this).css({marginTop : "0px"}).find("li:first").appendTo(this);
                                });
                            };
                            clearInterval(roll);
                            var roll= setInterval('textRoll()',5000);
                            $(".scroll-con li").hover(function() {
                                clearInterval(roll);
                            }).mouseout(function(){
                                clearInterval(roll);
                                roll= setInterval('textRoll()',5000);
                            });
                        }
                    },500);*/
                })
            })
        })
        $scope.linknotice = function(id) {
            Services.consoleserice("debug信息", id);
            $state.go("logged.noticedetail", { id: id });
        }
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
               /* if (issocket) {
                    $rootScope.unsubscribe3();
                }*/
                $rootScope.transaction3(function(marketsocketdata) {
                    //issocket = true;
                    var msdata = angular.fromJson(marketsocketdata.body).tradeMarkets;
                    for (var m = 0; m < msdata.length; m++) {
                        for (var n = 0; n < $scope.transactionpair.length; n++) {
                            if (msdata[m].transName == $scope.transactionpair[n].transName) {
                                $scope.transactionpair[n].currentPrice = msdata[m].currentPrice;
                                $scope.transactionpair[n].oneDayGains = msdata[m].oneDayGains;
                                $scope.transactionpair[n].oneDayMaxPrice = msdata[m].oneDayMaxPrice;
                                $scope.transactionpair[n].oneDayMinPrice = msdata[m].oneDayMinPrice;
                                $scope.transactionpair[n].oneDayDealNum = msdata[m].oneDayDealNum;
                                $scope.$apply();
                            }
                        }
                    }
                });
            })
        }
        $scope.gotTop = function() {
            //window.scroll(0, 0)
            $("html, body").animate({ scrollTop: 0 }, 100);
        }
        $scope.isLogin = false;
        //判断是否登录
        if (sessionStorage.token) {
            $scope.isLogin = true;
        }

    }]);
});