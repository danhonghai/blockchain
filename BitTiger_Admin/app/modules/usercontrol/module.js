define([
    '../../app'
], function(controllers) {
    controllers
        .controller('UserslistControl', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {};
            //查询实名认证状态
            Services.getDataget("getAuthenticationStatus", {}, function(data) {
                $scope.coinList = data.data.authentication;
            });
            //查询谷歌验证码绑定状态
            Services.getDataget("getvVerificationStatus", {}, function(data) {
                $scope.coinLists = data.data.verification;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    //lengthMenu:[2],
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("showUserList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements;
                            returnData.recordsFiltered = result.data.totalElements;
                            /*             returnData.recordsTotal = result.data.totalPages * result.data.pageSize; //返回数据全部记录
                                         returnData.recordsFiltered = result.data.pageNumber; //后台不实现过滤功能，每次查询均视作全部结果*/
                            returnData.data = result.data.users; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段logged.foregroundUser
                    columns: [{ "data": "phone" },   { "data": "email" },   { "data": "authenticationStatusStr" },   { "data": "verificationStatusStr" }, { "data": "registerTime" },   { "data": "time" },   { "data": "ip" },   { "data": "id" }],
                    "columnDefs": [{
                            "targets": 2,
                            "render": function(data, type, row) {
                                var statusStr = '';
                                return statusStr += '<td>' + data + '</td>';
                            },
                            fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                $compile(nTd)($scope);
                            }
                        }, {
                            "targets": 3,
                            "render": function(data, type, row) {
                                var statusStr = '';
                                return statusStr += '<td>' + data + '</td>';
                            },
                            fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                $compile(nTd)($scope);
                            }
                        }, {
                            "targets": 4,
                            "render": function(data, type, row) {
                                var statusStr = "";
                                return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>'; /*HH:mm:ss*/
                            },
                        }, {
                            "targets": 5,
                            "render": function(data, type, row) {
                                if (row.timeStr == null) {
                                    return '--';
                                } else {
                                    return '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
                                }


                            },
                        }, {
                            "targets": 7,
                            "render": function(data, type, row) {
                                var username = row.username;
                                var _id = row.id;
                                return '<a style="color: #1fb5ad;cursor:pointer"  ui-sref="logged.userdetails({userId:' + row.id + '})">' + '查看' + '</a>';
                            },
                            fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                $compile(nTd)($scope);
                            }
                        }

                    ]
                })
            }, 100);
            // 搜索方法
            $scope.exportParams = {};
            $scope.isSearch = false;
            $scope.searchFun = function(index) {
                if (index == 0) {
                    $scope.isSearch = true;
                } else if (index == 1) {

                    $scope.isSearch = false;
                    $scope.params = {};
                }
                angular.copy($scope.params, $scope.exportParams);
                $("#example").dataTable().fnDraw(true);
            }
        }])
        // 用户详情
        .controller('UserdetailsControl', ['$scope', '$rootScope', '$state', '$stateParams', '$interval', '$timeout', 'Services', function($scope, $rootScope, $state, $stateParams, $interval, $timeout, Services) {
            console.log($stateParams.userId);
            $scope.data = {};
            var params = {
                userId: $stateParams.userId
            }
            Services.getData("showUserDetailInfo", params, function(result) {
                $scope.userdetail = result.data.user;
                $scope.userdetaillist = result.data.user.pageAccountList
                console.log($scope.userdetail)
            })
        }])
        // 邀请记录
        .controller('invitedrecordControl', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {};
            //查询实名认证状态
            Services.getDataget("getAuthenticationStatus", {}, function(data) {
                $scope.coinList = data.data.authentication;
            });
            //查询谷歌验证码绑定状态
            Services.getDataget("getvVerificationStatus", {}, function(data) {
                $scope.coinLists = data.data.verification;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    //lengthMenu:[2],
                    ajax: function(data, callback, settings) {
                        var params = { invite: 1 };
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("showInvite", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements;
                            returnData.recordsFiltered = result.data.totalElements;
                            /*             returnData.recordsTotal = result.data.totalPages * result.data.pageSize; //返回数据全部记录
                                         returnData.recordsFiltered = result.data.pageNumber; //后台不实现过滤功能，每次查询均视作全部结果*/
                            returnData.data = result.data.users; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段logged.foregroundUser
                    columns: [{ "data": "phone" }, { "data": "email" }, { "data": "inviteName" }, { "data": "authenticationStatusStr" },   { "data": "verificationStatusStr" }, { "data": "registerTime" }],
                    "columnDefs": [{
                            "targets": 3,
                            "render": function(data, type, row) {
                                var statusStr = '';
                                return statusStr += '<td>' + data + '</td>';
                            },
                            fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                $compile(nTd)($scope);
                            }
                        }, {
                            "targets": 4,
                            "render": function(data, type, row) {
                                var statusStr = "";
                                return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>'; /*HH:mm:ss*/
                            },
                        }, {
                            "targets": 5,
                            "render": function(data, type, row) {
                                var statusStr = "";
                                return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
                            },
                        }

                    ]
                })
            }, 100);
            // 搜索方法
            $scope.exportParams = {};
            $scope.isSearch = false;
            $scope.searchFun = function(index) {
                if (index == 0) {
                    $scope.isSearch = true;
                } else if (index == 1) {

                    $scope.isSearch = false;
                    $scope.params = {};
                }
                angular.copy($scope.params, $scope.exportParams);
                $("#example").dataTable().fnDraw(true);
            }



        }]);
});