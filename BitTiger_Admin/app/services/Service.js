/**
 * 公共服务。
 * 每次切换状态（state）时都会检查用户是否已登录，
 * 若没有则跳到登录界面。
 */
define(['../app'], function(services) {
    services.factory('Services', ['$q', '$state', '$http', '$rootScope', '$timeout', function($q, $state, $http, $rootScope, $timeout) {
        return {
            alertshow: function(msg, time) {
                if (!msg) {
                    msg = "系统异常";
                }
                if (!time) {
                    time = 3000;
                }
                $rootScope.alertshow = true;
                $rootScope.alertmsg = msg;
                $timeout(function() {
                    $rootScope.alertshow = false;
                }, time);
            },
            //获取日期列表
            getdatearrs: function(startDate, endDate) {
                var d1 = new Date(startDate);
                var d2 = new Date(endDate);
                var datearrs = [];
                var seriesdatas1 = [];
                var seriesdatas2 = [];
                var seriesdatas3 = [];
                var seriesdatas4 = [];
                for (var i = d1.getTime(); i < d2.getTime(); i += 24 * 60 * 60 * 1000) {
                    var d3 = new Date(i);
                    var d = new Date(d3);
                    var youWant = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
                    datearrs.push(youWant)
                }
                return datearrs;
            },
            //主要数据接口POST
            getData: function(apiurl, params, backfun) {
                var _self = this;
                var token = "";
                if (sessionStorage.token) {
                    var token = sessionStorage.token;
                }
                $http.post($rootScope.baseUrl + apiurl, params, { headers: { 'token': token } })
                    .then(function successCallback(response) {
                        if (response.status == "200") {
                            if (response.data.code == "0000") {
                                return backfun(response.data);
                            } else if (response.data.code == "1019") {
                                //错误消息提示
                                $state.go("login")
                                sessionStorage.pageMenusNum = "[0,0,0]";
                                return false;
                            } else {
                                _self.alertshow(response.data.msg, 2000)
                                return false;
                            }
                        }
                    }, function errorCallback(response) {
                        if (response.status == "9999") {
                            _self.alertshow(null, 2000)
                            return false;
                        } else if (response.status == "401") {
                            $state.go("login")
                            sessionStorage.pageMenusNum = "[0,0,0]";
                            return false;
                        }
                    });
            },
            //Ajax封装方法
            ajaxData: function(apiurl, params, backfun) {
                var _self = this;
                var token = "";
                if (sessionStorage.token) {
                    var token = sessionStorage.token;
                }
                $http({
                    method: 'POST',
                    url: $rootScope.baseUrl + apiurl,
                    data: params,
                    headers: { 'Content-Type': undefined, 'token': token },
                    transformRequest: angular.identity
                }).then(function successCallback(response) {
                    if (response.status == "200") {
                        if (response.data.code == "0000") {
                            return backfun(response.data);
                        } else if (response.data.code == "1019") {
                            //错误消息提示
                            $state.go("login")
                            sessionStorage.pageMenusNum = "[0,0,0]";
                            return false;
                        } else {
                            _self.alertshow(response.data.msg, 2000)
                            return false;
                        }
                    }
                }, function errorCallback(response) {
                    if (response.status == "9999") {
                        _self.alertshow(null, 2000)
                        return false;
                    } else if (response.status == "401") {
                        $state.go("login")
                        sessionStorage.pageMenusNum = "[0,0,0]";
                        return false;
                    }
                });
            },
            //主要数据接口GETd
            getDataget: function(apiurl, params, backfun) {
                var _self = this;
                var token = "";
                if (sessionStorage.token) {
                    var token = sessionStorage.token;
                }
                $http.get($rootScope.baseUrl + apiurl, { params: params, headers: { 'token': token } })
                    .then(function successCallback(response) {
                        if (response.status == "200") {
                            if (response.data.code == "0000") {
                                return backfun(response.data);
                            } else {
                                //错误消息提示
                                alert(response.data.msg)
                                return false;
                            }
                        }
                    }, function errorCallback(response) {
                        if (response.status == "9999") {
                            _self.alertshow(null, 2000)
                            return false;
                        } else if (response.status == "401") {
                            $state.go("login")
                            sessionStorage.pageMenusNum = "[0,0,0]";
                            return false;
                        }
                        if (response.data.code == "7777") {
                            return backfun(response.data);
                            return false;
                        }
                    });
            }
        }

    }]).run(['$rootScope', '$urlRouter', 'Services', '$timeout', function($rootScope, $urlRouter, Services, $timeout) {
        window.baseUrl
        //基础路径配置
        $rootScope.baseUrl = "/apis/api/";
        //$rootScope.baseUrl = "/api/"; //生产环境
        window.baseUrl = $rootScope.baseUrl;
        /* 监听路由的状态变化 */
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $timeout(function() {
                //初始化时间选着控件
                $(".form_datetime").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii',
                    showMeridian: true,
                    autoclose: true,
                    todayBtn: true
                });
                $(".form_date").datetimepicker({
                    format: 'yyyy-mm-dd',
                    autoclose: true,
                    todayBtn: true
                });
                $(".form_datetimess").datetimepicker({
                    format: 'yyyy-mm-dd hh:ii:ss',
                    showMeridian: true,
                    autoclose: true,
                    todayBtn: true
                });
            }, 200);
        });
        /*
         * 全局配置 dataTable 
         * Auth by wuyf Time: 2017-12-19
         */
        $.extend($.fn.dataTable.defaults, {
            "serverSide": true, //启用服务器端分页
            "bLengthChange": false,
            "searching": false,
            "ordering": false,
            "language": {
                "lengthMenu": "每页 _MENU_ 条记录",
                "sZeroRecords": "没有找到记录",
                "infoEmpty": "无记录",
                //"info": "当前第 _START_ - _END_ 条　共计 _TOTAL_ 条;第 _PAGE_ 页 ( 共 _PAGES_ 页 )",  
                "info": "  _PAGE_ / _PAGES_  ( 共计 _TOTAL_ 条 ) ",
                "infoFiltered": "(从 _MAX_ 条记录过滤)",
                "paginate": {
                    first: "首页",
                    last: "最后",
                    previous: "上一页",
                    next: "下一页"
                }
            }
        });

        //时间控件国际化
        $.fn.datetimepicker.dates['en'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            monthsShort: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
            meridiem: ["上午", "下午"],
            suffix: ["st", "nd", "rd", "th"],
            today: "Today"
        };

        //退出登录
        $rootScope.loginOut = function() {
            $rootScope.userInfo = "";
            $state.go('login');
        }

    }]).filter('mpidcard', function() { //身份证号过滤器，隐藏中间8位年月日
        return function(value) {
            if (!value) return '';
            var mpidcard = value.substr(0, 6) + '********' + value.substr(14);
            return mpidcard
        };
    }).filter('mphone', function() { //手机号过滤器，隐藏中间4位
        return function(value) {
            if (!value) return '';
            var mphone = value.substr(0, 3) + '****' + value.substr(7);
            return mphone
        };
    }).filter('sphone', function() { //手机号只显示后四位
        return function(value) {
            if (!value) return '';
            var sphone = value.substr(7);
            return sphone
        };
    }).filter('mcardno', function() { //银行卡号过滤器，隐藏中间12位
        return function(value) {
            if (!value) return '';
            var mphone = value.substr(0, 4) + ' **** **** **** ' + value.substr(16);
            return mphone
        };
    }).filter('cut', function() { //字符串截取
        return function(value, len) {
            if (!value) return '';
            if (!value) {
                return '';
            } else if (value.length < len) {
                return value;
            } else {
                return value.substr(0, len) + '...';
            }
        };
    });
});