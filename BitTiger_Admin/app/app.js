define([
    'angular'
], function(angular) {
    return angular.module('application', [])
        .config([
            '$stateProvider',
            '$httpProvider',
            '$locationProvider',
            function($stateProvider, $httpProvider, $locationProvider) {

                $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
                $httpProvider.defaults.transformRequest = function(obj) {
                    var str = [];
                    for (var p in obj) {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    }
                    return str.join("&");
                }
                $locationProvider.html5Mode(true);
                // 设置路由
                $stateProvider.state('login', {
                        url: '/login',
                        templateUrl: 'modules/login/login.html',
                        controller: 'LoginController',
                        resolve: {
                            load: loadDeps([
                                'modules/login/module',
                                'css!./styles/login.css'
                            ])
                        }
                    })
                    .state('logged', {
                        abstract: true,
                        templateUrl: 'views/header.html',
                        controller: 'HeaderController',
                        resolve: {
                            load: loadDeps([
                                'modules/header/module',
                                'css!styles/header.css',
                                'js/jquery-accordion-menu',
                                'css!styles/jquery-accordion-menu.css'
                            ])
                        }
                    })
                    .state('logged.index', { //首页
                        url: '/index',
                        templateUrl: 'modules/index/index.html',
                        controller: 'IndexController',
                        resolve: {
                            load: loadDeps([
                                'modules/index/module',
                                'css!./styles/index.css'
                            ])
                        }
                    })
                    .state('logged.userslist', { //用户管理--用户列表
                        url: '/userslist?id',
                        templateUrl: 'modules/usercontrol/userslist.html',
                        controller: 'UserslistControl',
                        resolve: {
                            load: loadDeps([
                                'modules/usercontrol/module'
                                /*'css!./styles/usercontrol.css'*/
                            ])
                        }
                    })
                    .state('logged.invitedrecord', { //用户管理--邀请记录
                        url: '/invitedrecord',
                        templateUrl: 'modules/usercontrol/invitedrecord.html',
                        controller: 'invitedrecordControl',
                        resolve: {
                            load: loadDeps([
                                'modules/usercontrol/module'
                            ])
                        }
                    })
                    .state('logged.userdetails', { //用户管理--用户详情
                        url: '/userdetails?userId',
                        templateUrl: 'modules/usercontrol/userdetails.html',
                        controller: 'UserdetailsControl',
                        resolve: {
                            load: loadDeps([
                                'modules/usercontrol/module'
                            ])
                        }
                    })
                    .state('logged.backuser', { //后台用户
                        url: '/backuser',
                        templateUrl: 'modules/systemsetup/backuser.html',
                        controller: 'BackuserControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module'
                            ])
                        }
                    })
                    .state('logged.preferences', { //参数设置
                        url: '/preferences?id',
                        templateUrl: 'modules/systemsetup/preferences.html',
                        controller: 'PreferencesControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module',
                                'css!./styles/business.css'
                            ])
                        }
                    })
                    .state('logged.dailycash', { //钱包管理
                        url: '/dailycash?userId',
                        templateUrl: 'modules/systemsetup/dailycash.html',
                        controller: 'DailycashControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module'
                            ])
                        }
                    })
                    .state('logged.rolelist', { //角色管理
                        url: '/rolelist',
                        templateUrl: 'modules/systemsetup/rolelist.html',
                        controller: 'RolelistControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module'
                            ])
                        }
                    })
                    .state('logged.petskillbonus', { //角色增加
                        url: '/petskillbonus',
                        templateUrl: 'modules/systemsetup/petskillbonus.html',
                        controller: 'PetskillbonusControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module',
                                'css!./styles/zTreeStyle.css',
                                'vendor/ztree/jquery.ztree.all.min'
                            ])
                        }
                    })
                    .state('logged.setRoleAuthority', { //修改角色
                        url: '/setRoleAuthority?id',
                        templateUrl: 'modules/systemsetup/setRoleAuthority.html',
                        controller: 'SetRoleAuthorityControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module',
                                'css!./styles/zTreeStyle.css',
                                'vendor/ztree/jquery.ztree.all.min'
                            ])
                        }
                    })
                    .state('logged.menuManager', { //菜单管理
                        url: '/menuManager',
                        templateUrl: 'modules/systemsetup/menuManager.html',
                        controller: 'MenuManagerControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module',
                                'css!./styles/zTreeStyle.css',
                                'css!./styles/xlk.css',
                                'vendor/ztree/jquery.ztree.all.min'
                            ])
                        }
                    })
                    .state('logged.receptionist', { //前台管理
                        url: '/receptionist',
                        templateUrl: 'modules/systemsetup/receptionist.html',
                        controller: 'ReceptionistControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module',
                                'css!./vendor/fileInput/fileinput.css',
                                'vendor/fileInput/zh'
                            ])
                        }
                    })
                    .state('logged.announcements', { //公告管理
                        url: '/announcements',
                        templateUrl: 'modules/systemsetup/announcements.html',
                        controller: 'AnnouncementsControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module',
                                'css!./styles/pageBase.css'
                            ])
                        }
                    })
                    .state('logged.publishArticle', { //公告编辑/公告发布
                        url: '/publishArticle/:id',
                        templateUrl: 'modules/systemsetup/publishArticle.html',
                        controller: 'PublishArticleControl',
                        resolve: {
                            load: loadDeps([
                                'modules/systemsetup/module',
                                'css!./vendor/fileinput/fileinput.css',
                                'vendor/fileinput/zh',
                                'css!./styles/pageBase.css',
                                'assets/switch/bootstrap-switch.min',
                                'css!./vendor/switch/bootstrap-switch.min.css', //是否开关按钮
                            ])
                        }
                    })
                    .state('logged.entryOrder', { //挂单列表
                        url: '/entryOrder',
                        templateUrl: 'modules/transaction/entry_order.html',
                        controller: 'EntryOrderController',
                        resolve: {
                            load: loadDeps([
                                'modules/transaction/module',
                                'css!./styles/transaction.css'
                            ])
                        }
                    })
                    .state('logged.businessList', { //成交列表
                        url: '/businessList',
                        templateUrl: 'modules/transaction/business_list.html',
                        controller: 'BusinessListController',
                        resolve: {
                            load: loadDeps([
                                'modules/transaction/module',
                                'css!./styles/transaction.css'
                            ])
                        }
                    })
                    .state('logged.rechargeList', { //充币列表
                        url: '/rechargeList',
                        templateUrl: 'modules/capital/recharge_list.html',
                        controller: 'RechargeListController',
                        resolve: {
                            load: loadDeps([
                                'modules/capital/module',
                                'css!./styles/transaction.css',
                                'css!./vendor/fileInput/fileinput.css',
                                'vendor/fileInput/zh',
                            ])
                        }
                    })
                    .state('logged.withdrawalsList', { //提币列表
                        url: '/withdrawalsList',
                        templateUrl: 'modules/capital/withdrawals_list.html',
                        controller: 'WithdrawalsListController',
                        resolve: {
                            load: loadDeps([
                                'modules/capital/module',
                                'css!./styles/transaction.css'
                            ])
                        }
                    })
                    .state('logged.marketList', { //市场管理
                        url: '/marketList',
                        templateUrl: 'modules/market/market_list.html',
                        controller: 'MarketListController',
                        resolve: {
                            load: loadDeps([
                                'modules/market/module',
                                'css!./styles/transaction.css'
                            ])
                        }
                    })
                    .state('logged.currencyList', { //币种管理
                        url: '/currencyList',
                        templateUrl: 'modules/market/currency_list.html',
                        controller: 'CurrencyListController',
                        resolve: {
                            load: loadDeps([
                                'modules/market/module',
                                'css!./styles/transaction.css'
                            ])
                        }
                    })
                    .state('logged.addCoin', { //新增编辑币种
                        url: '/addCoin?id',
                        templateUrl: 'modules/market/coin_add.html',
                        controller: 'AddCoinController',
                        resolve: {
                            load: loadDeps([
                                'modules/market/module',
                                'css!./styles/transaction.css',
                                'css!./vendor/fileInput/fileinput.css',
                                'vendor/fileInput/zh',
                            ])
                        }
                    })
                    .state('logged.viewCoin', { //查看币种
                        url: '/viewCoin?id',
                        templateUrl: 'modules/market/coin_view.html',
                        controller: 'ViewCoinController',
                        resolve: {
                            load: loadDeps([
                                'modules/market/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    })
                    .state('logged.advertisinglist', { //法币交易--广告列表
                        url: '/advertisinglist',
                        templateUrl: 'modules/fiatdeal/advertisinglist.html',
                        controller: 'AdvertisinglistController',
                        resolve: {
                            load: loadDeps([
                                'modules/fiatdeal/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    })
                    .state('logged.transactionlist', { //法币交易--交易列表
                        url: '/transactionlist',
                        templateUrl: 'modules/fiatdeal/transactionlist.html',
                        controller: 'TransactionlistController',
                        resolve: {
                            load: loadDeps([
                                'modules/fiatdeal/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    })
                    .state('logged.certificationlist', { //审核管理--认证列表
                        url: '/certificationlist',
                        templateUrl: 'modules/auditsManagement/certificationlist.html',
                        controller: 'CertificationlistController',
                        resolve: {
                            load: loadDeps([
                                'modules/auditsManagement/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    })
                    .state('logged.complaintlist', { //审核管理--申诉列表
                        url: '/complaintlist',
                        templateUrl: 'modules/auditsManagement/complaintlist.html',
                        controller: 'ComplaintlistController',
                        resolve: {
                            load: loadDeps([
                                'modules/auditsManagement/module',
                                'css!./styles/transaction.css',
                                'css!./vendor/fileInput/fileinput.css',
                                'vendor/fileInput/zh',
                            ])
                        }
                    })
                    .state('logged.activitylist', { //活动管理
                        url: '/activitylist',
                        templateUrl: 'modules/activity/activitylist.html',
                        controller: 'ActivitylistController',
                        resolve: {
                            load: loadDeps([
                                'modules/activity/module',
                                'css!./styles/transaction.css',
                                'css!./vendor/fileInput/fileinput.css',
                                'vendor/fileInput/zh',
                            ])
                        }
                    })
                    .state('logged.csollist', { //点卡出售-活动列表
                        url: '/csollist',
                        templateUrl: 'modules/csol/csollist.html',
                        controller: 'CsollistController',
                        resolve: {
                            load: loadDeps([
                                'modules/csol/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    })
                    .state('logged.production', { //产品列表
                        url: '/production',
                        templateUrl: 'modules/csol/production.html',
                        controller: 'ProductionController',
                        resolve: {
                            load: loadDeps([
                                'modules/csol/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    })
                    .state('logged.tradingdig', { //交易挖矿-挖矿设置
                        url: '/tradingdig',
                        templateUrl: 'modules/tradingdig/tradingdig.html',
                        controller: 'TradingdigController',
                        resolve: {
                            load: loadDeps([
                                'modules/tradingdig/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    })
                    .state('logged.diglist', { //挖矿列表
                        url: '/diglist',
                        templateUrl: 'modules/tradingdig/diglist.html',
                        controller: 'DiglistController',
                        resolve: {
                            load: loadDeps([
                                'modules/tradingdig/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    })
                    .state('logged.commissionlist', { //返佣列表
                        url: '/commissionlist',
                        templateUrl: 'modules/tradingdig/commissionlist.html',
                        controller: 'CommissionlistController',
                        resolve: {
                            load: loadDeps([
                                'modules/tradingdig/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    }).state('logged.winuserlist', { //获奖用户列表
                        url: '/winuserlist',
                        templateUrl: 'modules/activity/winuserlist.html',
                        controller: 'WinuserlistController',
                        resolve: {
                            load: loadDeps([
                                'modules/activity/module',
                                'css!./styles/transaction.css',
                            ])
                        }
                    });

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
                            $state.go('login');
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

            }
        ]);
});