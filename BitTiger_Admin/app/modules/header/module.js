define([
    '../../app'
], function(controllers) {
    controllers
        .controller('HeaderController', ['$scope', '$rootScope', '$state', '$interval', '$timeout', 'Services', function($scope, $rootScope, $state, $interval, $timeout, Services) {
            if (!sessionStorage.token ) {
                $state.go('login');
                return false;
            }
            $scope.userName = sessionStorage.getItem("userName");
            /*window.onscroll = function() {
                var t = document.documentElement.scrollTop || document.body.scrollTop;
                var sessionmenu = angular.fromJson(sessionStorage.pageMenusNum);
                if (sessionmenu[0] != 0) {
                    if (t >= 107) {
                        $(".left-nav").css({ position: "fixed", top: '0px' });
                        $(".rightcon").css({ margin: "0 0 0 250px" });
                    } else {
                        $(".left-nav").css({ position: "inherit", top: '' });
                        $(".rightcon").css({ margin: "0" });
                    }
                }
            }*/

            $scope.subMenus = [];
            var pageMenusNum = [];
            //请求菜单数据
            if (sessionStorage.pageMenusNum) {
                pageMenusNum = angular.fromJson(sessionStorage.pageMenusNum);
            } else {
                pageMenusNum = [0, 0, 0]

            }
            $scope.forfun = function() {
                for (var i = 0; i < $scope.pageMenus.length; i++) {
                    if (i == pageMenusNum[0]) {
                        $scope.pageMenus[i].success = true;
                    } else {
                        $scope.pageMenus[i].success = false;
                    }
                    if ($scope.pageMenus[i].subMenu) {
                        for (var j = 0; j < $scope.pageMenus[i].subMenu.length; j++) {
                            if (j == pageMenusNum[1]) {
                                $scope.pageMenus[i].subMenu[j].success = true;
                            } else {
                                $scope.pageMenus[i].subMenu[j].success = false;
                            }
                            if ($scope.pageMenus[i].subMenu[j].subMenu) {
                                for (var k = 0; k < $scope.pageMenus[i].subMenu[j].subMenu.length; k++) {
                                    if (k == pageMenusNum[2]) {
                                        $scope.pageMenus[i].subMenu[j].subMenu[k].success = true;
                                    } else {
                                        $scope.pageMenus[i].subMenu[j].subMenu[k].success = false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            Services.getData("menu/show_menu", {}, function(data) {
                $scope.pageMenus = data.data.menuList;
                //$scope.pageMenus.unshift({ icon: 'icon-home', name: '首页', data: 'index' })
                $scope.forfun();
                $scope.subMenus = $scope.pageMenus[pageMenusNum[0]].subMenu;
                $timeout(function() {
                    $('#demo-list>li').eq(pageMenusNum[1]).find('ul').css('display', 'block')
                    $('#demo-list>li').eq(pageMenusNum[1]).find('li').eq(pageMenusNum[2]).find('ul').css('display', 'block')
                }, 300);
                sessionStorage.pageMenus = angular.toJson($scope.pageMenus);
                $scope.myfn = function(e) {
                    window.event ? window.event.cancelBubble = true : e.stopPropagation();
                }
                $scope.loginout = function() {
                    Services.getData("noauth/logout", {}, function(data){
                        sessionStorage.token = "";
                        sessionStorage.userName = "";
                        sessionStorage.pageMenusNum = '[0,0,0]';
                        $state.go('login');
                    })
                }
                $scope.menulink2 = function(para1, data, erlength) {
                    pageMenusNum[1] = para1;
                    sessionStorage.pageMenusNum = angular.toJson(pageMenusNum);
                    console.log(erlength);
                    if (erlength == 0) {
                        $scope.forfun();
                        $state.go('logged.' + data);
                    }
                }
                $rootScope.menulink3 = function(para2, data, params) {
                    pageMenusNum[2] = para2;
                    sessionStorage.pageMenusNum = angular.toJson(pageMenusNum);
                    $scope.forfun();
                    var params = params || {};
                    $state.go('logged.' + data, params);
                }
                $timeout(function() {
                    var dleft = $('.lavalamp li.active').offset().left - $('.lavalamp').offset().left;
                    var dwidth = 90 + "px";

                    $('.floatr').css({
                        "left": dleft + "px"
                    });
                    $('.lavalamp li').hover(function() {


                            var left = $(this).offset().left - ($(this).parents('.lavalamp').offset().left);
                            var width = $(this).width() + "px";
                            var sictranslate = "translate(" + left + "px, 0px)";
                            $('.floatr').css({
                                "left": left + "px"
                            });

                        },

                        function() {
                            if (!$(this).hasClass("active")) {
                                var left = $(this).siblings('li.active').offset().left - ($(this).parents('.lavalamp').offset().left);
                                var width = $(this).siblings('li.active').width() + "px";

                                var sictranslate = "translate(" + left + "px, 0px)";
                                $('.floatr').css({
                                    "left": left + "px"
                                });
                            }
                        }).click(function() {
                        var index = 0
                        for (var i = 0; i < $scope.pageMenus.length; i++) {
                            if (i == index) {
                                $scope.pageMenus[i].success = true;
                            } else {
                                $scope.pageMenus[i].success = false;
                            }
                        }
                        $scope.subMenus = $scope.pageMenus[index].subMenu;
                        $scope.$apply();
                        var index = $(this).index();
                        pageMenusNum = [index, 0, 0];
                        $scope.forfun();
                        sessionStorage.pageMenusNum = angular.toJson(pageMenusNum);

                        for (var i = 0; i < $scope.pageMenus.length; i++) {
                            if (i == index) {
                                $scope.pageMenus[i].success = true;
                            } else {
                                $scope.pageMenus[i].success = false;
                            }
                        }
                        $scope.subMenus = $scope.pageMenus[index].subMenu;

                        $(this).siblings('li').removeClass('active');
                        $(this).addClass('active');
                        $scope.$apply();
                        jQuery("#jquery-accordion-menu").jqueryAccordionMenu();
                        $('#demo-list>li').eq(pageMenusNum[1]).find('ul').css('display', 'block')
                        $('#demo-list>li').eq(pageMenusNum[1]).find('li').eq(pageMenusNum[2]).find('ul').css('display', 'block')
                        $state.go('logged.' + $scope.pageMenus[index].data);
                        return false;

                    });
                }, 200);


                $timeout(function() {
                    jQuery("#jquery-accordion-menu").jqueryAccordionMenu();
                    //顶部导航切换

                }, 100);

                $timeout(function() {
                    $("#demo-list li").on('click', function() {
                        $("#demo-list li.active").removeClass("active")
                        $(this).addClass("active");
                    })
                }, 300);
            });
            
            //修改密码
            $scope.updatePass = function(){
                $scope.adminParams = {};
                $('.update_pass').modal('show');
            }
            //确认修改密码
            $scope.saveAdmin = function(){
                console.log($scope.adminParams);
                Services.getData("updatePassword",$scope.adminParams,function(data){
                    Services.alertshow("操作成功");
                    $('.update_pass').modal('hide');
                });
            }
        }]);
});