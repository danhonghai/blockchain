define([
    '../../app'
], function(controllers) {
    controllers
        //挂单列表
        .controller('EntryOrderController', ['$scope', '$rootScope', '$state', '$compile', '$timeout', 'Services', '$filter', function($scope, $rootScope, $state, $compile, $timeout, Services, $filter) {
            $scope.params = {};
            //查询交易市场
            Services.getDataget("getMarket", {}, function(data) {
                $scope.market = data.data.market;
            });
            //查询委托方向
            Services.getDataget("getEntrustType", {}, function(data) {
                $scope.entrustType = data.data.entrustType;
            });
            //查询交易状态
            Services.getDataget("getTransStatus", {}, function(data) {
                $scope.transStatus = data.data.transStatus;
            });
            //查询委托类型
            Services.getDataget("getTransType", {}, function(data) {
                $scope.transType = data.data.transType;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("showApplyList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.applys; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "applyOrderId" },
                        { "data": "phone" },
                        { "data": "email" },
                        { "data": "transMarket" },
                        { "data": "transPair" },
                        { "data": "applyTime" },
                        { "data": "transTypeStr" },
                        { "data": "price" },
                        { "data": "amountApply" },
                        { "data": "totalPrice" },
                        { "data": "directStr" },
                        { "data": "statusStr" },
                        { "data": "id" },  
                    ],
                    "columnDefs": [{
                            "targets": 0,
                            "render": function(data, type, row) {
                                if (row.applyOrderId == null) {
                                    return '--';
                                } else {
                                    /* return '<div>' + $filter('limitTo')(data, data.length / 2) + '</div><div>' + $filter('limitTo')(data, -data.length / 2) + '</div>';*/
                                    return '<div>' + data + '</div>';
                                }

                            },
                        }, {
                            "targets": 3,
                            "render": function(data, type, row) {
                                if (row.transMarket == 0) {
                                    return "BTC市场";
                                } else {
                                    return "USDT市场";
                                }

                            },
                        }, {
                            "targets": 5,
                            "render": function(data, type, row) {
                                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                            },
                        },
                        {
                            "targets": 12,
                            "render": function(data, type, row) {
                                //交易状态，0申请 1全撤销 2部分成交 3部分撤销 4已成交
                                if (row.status == 0 || row.status == 2) {
                                    return '<button class="btn btn-rounded btn-success" style="padding:2px 10px; margin-right:10px;" ng-click="cancelFun(' + data + ')">撤单</button>';
                                } else {
                                    // return '<button class="btn btn-rounded btn-info" style="padding:2px 10px;" ng-click="viewDitail(' + data + ')">查看</button>';
                                    return '--';
                                }

                            },
                            fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                $compile(nTd)($scope);
                            }
                        }
                    ]
                })
            }, 100);

            //查询方法
            $scope.isSearch = false;
            $scope.searchFun = function(flag) {
                if (flag == 0) { //查询
                    $scope.isSearch = true;
                } else { //重置
                    $scope.isSearch = false;
                    $scope.params = {};
                }
                $("#example").dataTable().fnDraw(true);
            };

            //撤单弹窗
            $scope.cancelFun = function(applyOrderId) {
                $scope.currentId = applyOrderId;
                $('.cancel_modal').modal('show');
            }
            //撤单方法
            $scope.cancelApply = function() {
                Services.getData("cancelApply", { applyId: $scope.currentId }, function(data) {
                    Services.alertshow("操作成功");
                    $scope.searchFun(1);
                    $('.cancel_modal').modal('hide');
                });
            }

        }])
        //成交列表
        .controller('BusinessListController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {};
            //查询市场类型
            /*Services.getDataget("getMarket", {}, function(data) {
                $scope.transModel = data.data.market;
            });*/
            //查询交易对
            Services.getDataget("getTransPair", {}, function(data) {
                $scope.transModel = data.data.transPair;
            });
            //查询委托方向
            Services.getDataget("getEntrustType", {}, function(data) {
                $scope.entrustType = data.data.entrustType;
            });
            //查询交易类型
            Services.getDataget("getTransType", {}, function(data) {
                $scope.transType = data.data.transType;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("showOrderList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.orders; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "transOrderId" },
                        { "data": "applyOrderId" },
                        { "data": "phone" },
                        { "data": "email" },
                        { "data": "marketType" },
                        { "data": "applyTime" },
                        { "data": "finishTime" },
                        { "data": "transTypeStr" },
                        { "data": "price" },
                        { "data": "amount" },
                        { "data": "totalPrice" },
                        { "data": "directStr" },
                        { "data": "fee" },
                        /*{ "data": "id" },*/
                         
                    ],
                    "columnDefs": [{
                            "targets": 0,
                            "render": function(data, type, row) {
                                /* return '<div>' + $filter('limitTo')(data, data.length / 2) + '</div><div>' + $filter('limitTo')(data, -data.length / 2) + '</div>';*/
                                return '<div>' + data + '</div>';
                            }
                        }, {
                            "targets": 1,
                            "render": function(data, type, row) {
                                /*
                                return '<div>' + $filter('limitTo')(data, data.length / 2) + '</div><div>' + $filter('limitTo')(data, -data.length / 2) + '</div>';*/
                                 return '<div>' + data + '</div>';
                            }
                        }, {
                            "targets": 5,
                            "render": function(data, type, row) {
                                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                            }
                        }, {
                            "targets": 6,
                            "render": function(data, type, row) {
                                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                            }
                        }
                        /*,
                                            {
                                                "targets": 13,
                                                "render": function(data, type, row) {
                                                    return '<button class="btn btn-rounded btn-info" style="padding:2px 10px;" ng-click="viewDitail(' + data + ')">查看</button>';

                                                },
                                                fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                                    $compile(nTd)($scope);
                                                }
                                            }*/
                    ]
                })
            }, 100);

            //导出参数
            $scope.exportParams = {};

            //查询方法
            $scope.isSearch = false;
            $scope.searchFun = function(flag) {
                if (flag == 0) { //查询
                    $scope.isSearch = true;
                } else { //重置
                    $scope.isSearch = false;
                    $scope.params = {
                        status: 0,
                    };
                }
                $("#example").dataTable().fnDraw(true);
            };

        }]);
});