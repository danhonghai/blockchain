define([
    '../../app'
], function(controllers) {
    controllers
        //广告列表
        .controller('AdvertisinglistController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {};
            //查询所有币种
            Services.getData("fund/coinList", {}, function(data) {
                $scope.coinList = data.data.coinList;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    //lengthMenu:[2],
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("fiat/advertisementList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements;
                            returnData.recordsFiltered = result.data.totalElements;
                            /*             returnData.recordsTotal = result.data.totalPages * result.data.pageSize; //返回数据全部记录
                                         returnData.recordsFiltered = result.data.pageNumber; //后台不实现过滤功能，每次查询均视作全部结果*/
                            returnData.data = result.data.fiatApply; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段logged.foregroundUser
                    columns: [{ "data": "id" }, { "data": "nickName" }, { "data": "fiatType" }, { "data": "direct" }, { "data": "amount" }, { "data": "perPrice" }, { "data": "priceLimit" }, { "data": "transMode" }, { "data": "isAdvance" }, { "data": "amountDeal" }, { "data": "transTotalMoney" }, { "data": "dealCount" }, { "data": "publishStatus" }, { "data": "applyTime" }],
                    "columnDefs": [{
                        "targets": 2,
                        "render": function(data, type, row) {
                            if (row.advanceType == 1) {
                                return "普通交易";
                            } else {
                                return "大额交易";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 3,
                        "render": function(data, type, row) {
                            if (row.direct == 1) {
                                return "买入";
                            } else {
                                return "卖出";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            if (row.isAdvance == 0) {
                                return "无";
                            } else {
                                return "有";
                            }
                        },
                    }, {
                        "targets": 11,
                        "render": function(data, type, row) {
                            return '<td>' + '<a style="color: #1fb5ad;cursor:pointer" >' + row.dealCount + '笔</a>' + '<td>';
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 12,
                        "render": function(data, type, row) {
                            if (row.publishStatus == 1) {
                                return "发布中";
                            } else if (row.publishStatus == 2) {
                                return "已作废";
                            } else {
                                return "已完结";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 13,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
                        },
                    }]
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
        // 交易详情
        .controller('TransactionlistController', ['$scope', '$rootScope', '$state', '$stateParams', '$interval', '$timeout', 'Services', '$compile', '$filter', function($scope, $rootScope, $state, $stateParams, $interval, $timeout, Services, $compile, $filter) {
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    //lengthMenu:[2],
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("fiat/orderList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements;
                            returnData.recordsFiltered = result.data.totalElements;
                            /*             returnData.recordsTotal = result.data.totalPages * result.data.pageSize; //返回数据全部记录
                                         returnData.recordsFiltered = result.data.pageNumber; //后台不实现过滤功能，每次查询均视作全部结果*/
                            returnData.data = result.data.fiatOrder; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段logged.foregroundUser
                    columns: [{ "data": "orderNo" }, { "data": "advanceId" }, { "data": "sourceName" }, { "data": "targetName" }, { "data": "direct" }, { "data": "transPerPrice" }, { "data": "transAmount" }, { "data": "transTotalMoney" }, { "data": "status" }, { "data": "createTime" }],
                    "columnDefs": [{
                        "targets": 4,
                        "render": function(data, type, row) {
                            if (row.direct == 1) {
                                return "买入";
                            } else {
                                return "卖出";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            if (row.status == 0) {
                                return "未付款";
                            } else if (row.status == 1) {
                                return "已取消";
                            } else if (row.status == 2) {
                                return "已付款";
                            } else if (row.status == 3) {
                                return "申诉中";
                            } else {
                                return "已完结";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 9,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }]
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