define([

    'angular'

], function(angular) {

    return angular.module('application', [])

        .config(['$stateProvider', '$httpProvider', '$locationProvider', function($stateProvider, $httpProvider, $locationProvider) {

            /*$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

            var param = function(obj) {

                var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

                for(name in obj) {

                    value = obj[name];

                    if(value instanceof Array) {

                        for(i=0; i<value.length; ++i) {

                            subValue = value[i];

                            fullSubName = name + '[' + i + ']';

                            innerObj = {};

                            innerObj[fullSubName] = subValue;

                            query += param(innerObj) + '&';

                        }

                    }

                    else if(value instanceof Object) {

                        for(subName in value) {

                            subValue = value[subName];

                            fullSubName = name + '[' + subName + ']';

                            innerObj = {};

                            innerObj[fullSubName] = subValue;

                            query += param(innerObj) + '&';

                        }

                    }

                    else if(value !== undefined && value !== null)

                        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';

                }

                return query.length ? query.substr(0, query.length - 1) : query;

            };*/

            // Override $http service's default transformRequest

            /*$httpProvider.defaults.transformRequest = [function(data) {

                return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;

            }];*/



            $locationProvider.html5Mode(true); //html5模式路由
            window.vtime = "1532078336021";

            // 设置路由

            $stateProvider.state('logged', {

                    abstract: true,

                    cache: false,

                    templateUrl: 'views/header.html?v=' + vtime,

                    controller: 'HeaderController',

                    resolve: {

                        load: loadDeps([

                            'modules/header/module.js?v=' + vtime,

                            'css!styles/header.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.index', { //首页

                    url: '/index',

                    templateUrl: 'modules/index/index.html?v=' + vtime,

                    controller: 'IndexController',

                    resolve: {

                        load: loadDeps([

                            'modules/index/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/index.css?v=' + vtime,

                        ])

                    }

                })
                .state('logged.register', { //注册

                    url: '/register?inviteCode',

                    templateUrl: 'modules/register/register.html?v=' + vtime,

                    controller: 'RegisterController',

                    resolve: {

                        load: loadDeps([

                            'modules/register/module.js?v=' + vtime,

                            './vendor/geometry',

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/register.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.login', { //登入

                    url: '/login',

                    templateUrl: 'modules/login/login.html?v=' + vtime,

                    controller: 'LoginController',

                    resolve: {

                        load: loadDeps([

                            'modules/login/module.js?v=' + vtime,

                            './vendor/geometry',

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/login.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.forgetpassword', { //忘记密码

                    url: '/forgetpassword',

                    templateUrl: 'modules/forgetpassword/forgetpassword.html?v=' + vtime,

                    controller: 'ForgetpasswordController',

                    resolve: {

                        load: loadDeps([

                            'modules/forgetpassword/module.js?v=' + vtime,

                            './vendor/geometry',

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/forgetpassword.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.transaction', { //币币交易

                    url: '/transaction',

                    cache: false,

                    templateUrl: 'modules/transaction/transaction.html?v=' + vtime,

                    controller: 'TransactionController',

                    resolve: {

                        load: loadDeps([

                            'modules/transaction/module.js?v=' + vtime,

                            'css!./styles/transaction.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.handicap', { //币币交易

                    url: '/handicap?transModel&messageFrom&messageUser$transName',

                    cache: false,

                    templateUrl: 'modules/handicap/handicap.html?v=' + vtime,

                    controller: 'HandicapController',

                    resolve: {

                        load: loadDeps([

                            'modules/handicap/module.js?v=' + vtime,

                            'css!./styles/handicap.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.assetscentre_capital', { //资产中心

                    url: '/assetscentre',

                    cache: false,

                    templateUrl: 'modules/assetscentre/assetscentre.html?v=' + vtime,

                    controller: 'AssetscentreController',

                    resolve: {

                        load: loadDeps([

                            'modules/assetscentre/module.js?v=' + vtime,

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.recharge_capital', { //充值

                    url: '/recharge?id&coinName',

                    cache: false,

                    templateUrl: 'modules/recharge/recharge.html?v=' + vtime,

                    controller: 'RechargeController',

                    resolve: {

                        load: loadDeps([

                            'modules/recharge/module.js?v=' + vtime,

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.withdrawals_capital', { //提现

                    url: '/withdrawals?id',

                    cache: false,

                    templateUrl: 'modules/withdrawals/withdrawals.html?v=' + vtime,

                    controller: 'WithdrawalsController',

                    resolve: {

                        load: loadDeps([

                            'modules/withdrawals/module.js?v=' + vtime,

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.address_capital', { //地址管理

                    url: '/address',

                    cache: false,

                    templateUrl: 'modules/address/address.html?v=' + vtime,

                    controller: 'AddressController',

                    resolve: {

                        load: loadDeps([

                            'modules/address/module.js?v=' + vtime,

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.userinfo', { //基本信息

                    url: '/userinfo',

                    cache: false,

                    templateUrl: 'modules/userinfo/userinfo.html?v=' + vtime,

                    controller: 'UserinfoController',

                    resolve: {

                        load: loadDeps([

                            'modules/userinfo/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.invitefriends', { //邀请好友

                    url: '/invitefriends',

                    cache: false,

                    templateUrl: 'modules/userinfo/invitefriends.html?v=' + vtime,

                    controller: 'invitefriendsController',

                    resolve: {

                        load: loadDeps([

                            'modules/userinfo/module.js?v=' + vtime,

                            'css!./styles/invitefriends.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.realname_userinfo', { //实名认证

                    url: '/realname',

                    cache: false,

                    templateUrl: 'modules/realname/realname.html?v=' + vtime,

                    controller: 'RealnameController',

                    resolve: {

                        load: loadDeps([

                            'modules/realname/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.security_userinfo', { //安全设置

                    url: '/security',

                    cache: false,

                    templateUrl: 'modules/security/security.html?v=' + vtime,

                    controller: 'SecurityController',

                    resolve: {

                        load: loadDeps([

                            'modules/security/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.capitalflow_capital', { //资金流水

                    url: '/capitalflow',

                    cache: false,

                    templateUrl: 'modules/capitalflow/capitalflow.html?v=' + vtime,

                    controller: 'CapitalflowController',

                    resolve: {

                        load: loadDeps([

                            'modules/capitalflow/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.entrustment', { //委托管理

                    url: '/entrustment',

                    cache: false,

                    templateUrl: 'modules/entrustment/entrustment.html?v=' + vtime,

                    controller: 'EntrustmentController',

                    resolve: {

                        load: loadDeps([

                            'modules/entrustment/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/entrustment.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.setmobile_userinfo', { //绑定修改手机

                    url: '/setmobile',

                    cache: false,

                    templateUrl: 'modules/security/setmobile.html?v=' + vtime,

                    controller: 'SetmobileController',

                    resolve: {

                        load: loadDeps([

                            'modules/security/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.updatepwd_userinfo', { //修改登录密码

                    url: '/updatepwd',

                    cache: false,

                    templateUrl: 'modules/security/updatepwd.html?v=' + vtime,

                    controller: 'UpdatepwdController',

                    resolve: {

                        load: loadDeps([

                            'modules/security/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.setfundpwd_userinfo', { //设置资金密码

                    url: '/setfundpwd',

                    cache: false,

                    templateUrl: 'modules/security/setfundpwd.html?v=' + vtime,

                    controller: 'SetfundpwdController',

                    resolve: {

                        load: loadDeps([

                            'modules/security/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.setemail_userinfo', { //绑定修改邮箱

                    url: '/setemail',

                    cache: false,

                    templateUrl: 'modules/security/setemail.html?v=' + vtime,

                    controller: 'SetemailController',

                    resolve: {

                        load: loadDeps([

                            'modules/security/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.verifygoogle_userinfo', { //绑定修改谷歌验证器

                    url: '/verifygoogle',

                    cache: false,

                    templateUrl: 'modules/security/verifygoogle.html?v=' + vtime,

                    controller: 'VerifygoogleController',

                    resolve: {

                        load: loadDeps([

                            'modules/security/module.js?v=' + vtime,

                            /*'css!./vendor/swiper/swiper.min.css?v='+ vtime,*/

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.useragreement', { //用户协议

                    url: '/useragreement',

                    cache: false,

                    templateUrl: 'modules/agreement/useragreement.html?v=' + vtime,

                    controller: 'UseragreementController',

                    resolve: {

                        load: loadDeps([

                            'modules/agreement/module.js?v=' + vtime,

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                }).state('logged.privacypolicy', { //隐私条款

                    url: '/privacypolicy',

                    cache: false,

                    templateUrl: 'modules/agreement/privacypolicy.html?v=' + vtime,

                    controller: 'PrivacypolicyController',

                    resolve: {

                        load: loadDeps([

                            'modules/agreement/module.js?v=' + vtime,

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                }).state('logged.legislation', { //法律声明

                    url: '/legislation',

                    cache: false,

                    templateUrl: 'modules/agreement/legislation.html?v=' + vtime,

                    controller: 'LegislationController',

                    resolve: {

                        load: loadDeps([

                            'modules/agreement/module.js?v=' + vtime,

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                }).state('logged.aboutus', { //关于我们

                    url: '/aboutus',

                    cache: false,

                    templateUrl: 'modules/agreement/aboutus.html?v=' + vtime,

                    controller: 'AboutusController',

                    resolve: {

                        load: loadDeps([

                            'modules/agreement/module.js?v=' + vtime,

                            'css!./styles/recharge.css?v=' + vtime,

                        ])

                    }

                }).state('logged.rate', { //费率

                    url: '/rate',

                    cache: false,

                    templateUrl: 'modules/agreement/rate.html?v=' + vtime,

                    controller: 'RateController',

                    resolve: {

                        load: loadDeps([

                            'modules/agreement/module.js?v=' + vtime,

                            'css!./styles/rate.css?v=' + vtime,

                        ])

                    }

                }).state('logged.helpcenter', { //帮助中心

                    url: '/helpcenter',

                    cache: false,

                    templateUrl: 'modules/agreement/helpcenter.html?v=' + vtime,

                    controller: 'HelpcenterController',

                    resolve: {

                        load: loadDeps([

                            'modules/agreement/module.js?v=' + vtime,

                            'css!./styles/helpcenter.css?v=' + vtime,

                        ])

                    }

                })

                /*.state('logged.worldcup', { //世界杯

                    url: '/worldcup',

                    cache: false,

                    templateUrl: 'modules/activity/worldcup.html?v=' + vtime,

                    controller: 'WorldcupController',

                    resolve: {

                        load: loadDeps([

                            'modules/activity/module.js?v=' + vtime,

                            'css!./styles/activity.css?v=' + vtime,

                        ])

                    }

                })*/

                .state('logged.noticelist', { //世界杯

                    url: '/noticelist',

                    cache: false,

                    templateUrl: 'modules/notice/noticelist.html?v=' + vtime,

                    controller: 'NoticelistController',

                    resolve: {

                        load: loadDeps([

                            'modules/notice/module.js?v=' + vtime,

                            'css!./styles/noticelist.css?v=' + vtime,

                        ])

                    }

                })

                .state('logged.noticedetail', { //世界杯

                    url: '/noticedetail?id',

                    cache: false,

                    templateUrl: 'modules/notice/noticedetail.html?v=' + vtime,

                    controller: 'NoticedetailController',

                    resolve: {

                        load: loadDeps([

                            'modules/notice/module.js?v=' + vtime,

                            'css!./styles/noticelist.css?v=' + vtime,

                        ])

                    }

                })

                .state('mregister', { //移动端注册

                    url: '/mregister?inviteCode',

                    cache: false,

                    templateUrl: 'modules/h5/register.html?v=' + vtime,

                    controller: 'RegisterController',

                    resolve: {

                        load: loadDeps([

                            'modules/h5/module.js?v=' + vtime,

                            'css!./styles/mobile.css?v=' + vtime,

                        ])

                    }

                })

                .state('magreement', { //移动端注册协议

                    url: '/magreement',

                    cache: false,

                    templateUrl: 'modules/h5/agreement.html?v=' + vtime,

                    resolve: {

                        load: loadDeps([

                            'css!./styles/mobile.css?v=' + vtime,

                        ])

                    }

                })

                .state('registerok', { //移动端注册成功

                    url: '/registerok',

                    cache: false,

                    templateUrl: 'modules/h5/registerok.html?v=' + vtime,

                    resolve: {

                        load: loadDeps([

                            'css!./styles/mobile.css?v=' + vtime,

                        ])

                    }

                })

            /* .state('logged.dashboard', { //售卖点卡

                 url: '/dashboard',

                 cache: false,

                 templateUrl: 'modules/dashboard/dashboard.html?v=' + vtime,

                 controller: 'DashboardController',

                 resolve: {

                     load: loadDeps([

                         'modules/dashboard/module.js?v=' + vtime,

                         'css!./styles/dashboard.css?v=' + vtime

                     ])

                 }

             })

             .state('logged.purchase', { //购买页面

                 url: '/purchase?activityId&credit&activityCardType',

                 cache: false,

                 templateUrl: 'modules/dashboard/purchase.html?v=' + vtime,

                 controller: 'PurchaseController',

                 resolve: {

                     load: loadDeps([

                         'modules/dashboard/module.js?v=' + vtime,

                         'css!./styles/dashboard.css?v=' + vtime



                     ])

                 }

             })*/
            ;



            // 不能使用下面这句代码：

            // $urlRouterProvider.otherwise( '/index' );

            // 见 http://stackoverflow.com/questions/25065699/why-does-angularjs-with-ui-router-keep-firing-the-statechangestart-event

            // 另外，这段代码必须放在最后一个路由，否则直接在链接中到 #/路由 会无效

            $stateProvider.state('otherwise', {

                url: '*path',

                template: '',

                controller: [

                    '$state',

                    function($state) {

                        $state.go('logged.index');

                    }

                ]

            });

            /**

             * 加载依赖的辅助函数

             * @param deps

             * @returns {*[]}

             */

            function loadDeps(deps) {

                return [

                    '$q',

                    function($q) {

                        var def = $q.defer();

                        require(deps, function() {

                            def.resolve();

                        });

                        return def.promise;

                    }

                ];

            }

        }])

        .directive('myPagination', ['$rootScope', function($rootScope) {

            return {

                restrict: 'EA',

                replace: true,

                scope: {

                    option: '=pageOption'

                },

                template: '<div><ul class="pagination" style="display: inline-flex;">' +

                    '<li ng-click="pageClick(p)" ng-repeat="p in page" class="page-item {{option.curr==p?\'active\':\'\'}}">' +

                    '<a class="page-link div-block font-1" href="javascript:;">{{p}}</a>' +

                    '</li>' +

                    '</ul>' +

                    '<span class="font-1">&nbsp&nbsp&nbsp{{lang344}}&nbsp;{{option.all}}&nbsp;{{lang345}}&nbsp;{{option.total}}&nbsp;{{lang346}}<span></div>',

                link: function($scope) {



                    $scope.lang344 = $rootScope.lang.lang344;

                    $scope.lang345 = $rootScope.lang.lang345;

                    $scope.lang346 = $rootScope.lang.lang346;



                    //容错处理

                    if (!$scope.option.curr || isNaN($scope.option.curr) || $scope.option.curr < 1) $scope.option.curr = 0;

                    if (!$scope.option.all || isNaN($scope.option.all) || $scope.option.all < 1) $scope.option.all = 0;

                    if ($scope.option.curr > $scope.option.all) $scope.option.curr = $scope.option.all;

                    if (!$scope.option.count || isNaN($scope.option.count) || $scope.option.count < 1) $scope.option.count = 1;

                    if (!$scope.option.total || isNaN($scope.option.total) || $scope.option.total < 1) $scope.option.total = 10;





                    //得到显示页数的数组

                    $scope.page = getRange($scope.option.curr, $scope.option.all, $scope.option.count);



                    //绑定点击事件

                    $scope.pageClick = function(page) {

                        if (page == $rootScope.lang.lang347) {

                            page = parseInt($scope.option.curr) - 1;

                        } else if (page == $rootScope.lang.lang348) {

                            page = parseInt($scope.option.curr) + 1;

                        }

                        if (page < 1) page = 1;

                        else if (page > $scope.option.all) page = $scope.option.all;

                        //点击相同的页数 不执行点击事件

                        if (page == $scope.option.curr) return;

                        if ($scope.option.click && typeof $scope.option.click === 'function') {

                            $scope.option.click(page);

                            $scope.option.curr = page;

                            $scope.page = getRange($scope.option.curr, $scope.option.all, $scope.option.count);

                        }

                    };



                    //返回页数范围（用来遍历）

                    function getRange(curr, all, count) {

                        //计算显示的页数

                        curr = parseInt(curr);

                        all = parseInt(all);

                        count = parseInt(count);

                        var from = curr - parseInt(count / 2);

                        var to = curr + parseInt(count / 2) + (count % 2) - 1;

                        //显示的页数容处理

                        if (from <= 0) {

                            from = 1;

                            to = from + count - 1;

                            if (to > all) {

                                to = all;

                            }

                        }

                        if (to > all) {

                            to = all;

                            from = to - count + 1;

                            if (from <= 0) {

                                from = 1;

                            }

                        }

                        var range = [];

                        for (var i = from; i <= to; i++) {

                            range.push(i);

                        }

                        range.push($rootScope.lang.lang348);

                        range.unshift($rootScope.lang.lang347);

                        return range;

                    }

                    //监听total变化，重新渲染分页

                    $scope.$watch('option.total', function() {

                        $scope.page = getRange($scope.option.curr, $scope.option.all, $scope.option.count);

                    });



                }

            }

        }]).run(['$rootScope', '$state', 'utilsService', 'Services', function($rootScope, $state, utilsService, Services) {　 //解决ui-sref底部导航跳转时页面不能回到顶部

            $rootScope.$on('$stateChangeSuccess', function(event, unfoundState, fromState, fromParams) {

                document.body.scrollTop = document.documentElement.scrollTop = 0;

            });

            //生产环境下改为false;
            $rootScope.debug = false;

            var socket = new SockJS("http://192.168.3.108:3103/tradePoint");

            //生产环境http://www.hayekex.com

            //var socket = new SockJS("/ws/tradePoint");

            var mysubid0 = utilsService.generateUUID().id;

            var mysubid1 = utilsService.generateUUID().id;

            var mysubid2 = utilsService.generateUUID().id;

            var mysubid3 = utilsService.generateUUID().id;

            var mysubid4 = utilsService.generateUUID().id;

            // var socket = new SockJS("/apis/Api-WebSocket/tradePoint");

            // 获取 STOMP 子协议的客户端对象
            var socketbool = false;
            var stompClient = Stomp.over(socket);

            // 向服务器发起websocket连接并发送CONNECT帧

            stompClient.connect({},

                function connectCallback(frame) {

                    // 连接成功时（服务器响应 CONNECTED 帧）的回调方法
                    Services.consoleserice("debug信息", "连接成功");
                    socketbool = true;
                    // stompClient.subscribe('/app/subscribeTest', function (response) {

                    //     Services.consoleserice("debug信息", "已成功订阅/app/subscribeTest");

                    //     var returnData = JSON.parse(response.body);

                    //     conso  le.log("/app/subscribeTest 你接收到的消息为:" + returnData.responseMessage);

                    // });

                },

                function errorCallBack(error) {

                    // 连接失败时（服务器响应 ERROR 帧）的回调方法
                    Services.consoleserice("debug信息", "连接失败");
                }

            );



            //发送消息

            $rootScope.send = function(message) {

                var messageJson = JSON.stringify(message);

                stompClient.send("/trade/info", {}, messageJson);

                Services.consoleserice("debug信息", "/app/sendTest 你发送的消息:" + message);

            }

            //订阅消息

            var aaa;

            var oldprice = 0;

            //订阅K线

            $rootScope.subscribe = function(tranpair, lineType, backfun) {

                var sockettime = setInterval(function() {
                    if (socketbool) {
                        clearInterval(sockettime);
                        if(aaa){
                            aaa.unsubscribe();
                        }
                        aaa = stompClient.subscribe('/topic/' + tranpair + '/' + lineType + '/kline', function(response) {
                            return backfun(response)
                        }, { id: mysubid0 });
                    }
                }, 500);
            };

            var bbb;

            //订阅市场详情和订单

            $rootScope.transaction1 = function(applyurl, backfun) {
                var sockettime = setInterval(function() {
                    if (socketbool) {
                        clearInterval(sockettime);
                        if(bbb){
                            bbb.unsubscribe();
                        }
                        bbb = stompClient.subscribe('/topic/' + applyurl, function(response) {
                            Services.consoleserice("debug信息", "apply");
                            Services.consoleserice("topic debug信息", response)
                            return backfun(response)
                        }, { id: mysubid1 });
                    }
                }, 500);
            };

            var ccc;

            //订阅市场详情和订单

            $rootScope.transaction2 = function(applyurl, backfun) {
                
                var sockettime = setInterval(function() {
                    if (socketbool) {
                        clearInterval(sockettime);
                        if(ccc){
                            ccc.unsubscribe();
                        }
                        ccc = stompClient.subscribe('/topic/' + applyurl, function(response) {
                            Services.consoleserice("debug信息", "order");
                            Services.consoleserice("debug信息", response)
                            return backfun(response)
                        }, { id: mysubid2 });
                    }
                }, 500);
            };

            var ddd;



            $rootScope.transaction3 = function(backfun) {
                var sockettime = setInterval(function() {
                    if (socketbool) {
                        clearInterval(sockettime);
                        if(ddd){
                            ddd.unsubscribe();
                        }
                        ddd = stompClient.subscribe('/topic/trades/all', function(response) {
                            Services.consoleserice("debug信息", "index:"+response);
                            return backfun(response)
                        }, { id: mysubid3 });
                    }
                }, 500);
            };

            var eee;



            $rootScope.transaction4 = function(pair, userId, backfun) {
                var sockettime = setInterval(function() {
                    if (socketbool) {
                        clearInterval(sockettime);
                        if(eee){
                            eee.unsubscribe();
                        }
                        eee = stompClient.subscribe('/topic/' + pair + '/' + userId + '/apply', function(response) {
                            Services.consoleserice("debug信息", "当前委托");
                            return backfun(response)
                        }, { id: mysubid4 });
                    }
                }, 500);
            };

            //退订

            $rootScope.unsubscribe = function() {
                if (aaa) {
                    aaa.unsubscribe();
                }

            };

            $rootScope.unsubscribe1 = function() {
                if (bbb) {
                    bbb.unsubscribe();
                }
            };

            $rootScope.unsubscribe2 = function() {
                if (ccc) {
                    ccc.unsubscribe();
                }
            };

            $rootScope.unsubscribe3 = function() {
                if (ddd) {
                    ddd.unsubscribe();
                }
            };

            $rootScope.unsubscribe4 = function() {
                if (eee) {
                    eee.unsubscribe();
                }

            };

        }])

        .directive('alertBar', [function() {



            return {

                restrict: 'EA',

                templateUrl: 'modules/alertBar.html',

                scope: {

                    message: "=",

                    type: "="

                },

                link: function(scope, element, attrs) {



                    scope.hideAlert = function() {

                        scope.message = null;

                        scope.type = null;

                    };



                }

            };

        }])

        .directive('fdcFilter', [function() {

            return {

                require: "ngModel",

                link: function(scope, element, attrs, ngModel) {

                    var nextnum;

                    element.bind('keyup', function(value) {
                        Services.consoleserice("debug信息", value.target.value);
                        var num = value.target.value;

                        var reg = /^(([1-9]\d*(\.\d{0,6})?)|(0\.\d{0,5}[1-9]))$/;

                        if (reg.test(num)) {

                            nextnum = num;

                            return true;

                        } else {

                            if (value.target.value != "") {

                                value.target.value = nextnum;

                            }

                            return false;

                        }

                    });

                }

            }

        }])
        .directive('dateFormat', ['$filter', function($filter) {
          return {
            require: 'ngModel',
            link: function(scope, elm, attrs, ctrl) {
                ctrl.$parsers.push(function parser() {
                    console.log(ctrl);
                    var str = "";
                    for (var i = 0; i <6; i++) {
                         str =  str + "\\d";
                    }
                    var regk = "/^(\\-)*(\\d+)\\.("+str+").*$/";//正则
                    var reg = eval(regk);
                    ctrl.$viewValue = ctrl.$viewValue.replace(/[^\d.]/g,"");  //清除“数字”和“.”以外的字符  
                    ctrl.$viewValue = ctrl.$viewValue.replace(/\.{2,}/g,"."); //只保留第一个. 清除多余的  
                    ctrl.$viewValue = ctrl.$viewValue.replace(".","$#$").replace(/\./g,"").replace("$#$","."); 
                    ctrl.$viewValue = ctrl.$viewValue.replace(reg,'$1$2.$3');//只能输入两个小数  
                    if(ctrl.$viewValue.indexOf(".")< 0 && ctrl.$viewValue !=""){//以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额 
                        return ctrl.$viewValue = parseFloat(ctrl.$viewValue);
                    } 
                  });
                  ctrl.$parsers.push(function parser() {
                    return ctrl.$modelValue;
                  });
            }
          };
        }])

});