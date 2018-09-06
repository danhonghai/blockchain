define([
    '../../app'
], function(controllers) {
    controllers
        //点卡出售-活动列表
        .controller('TradingdigController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {};
            $scope.trans = {};
            $scope.transType = [];
            //查询所有支持交易对
            Services.getDataget("getTransPair", {}, function(data) {
                $scope.transList = data.data.transPair;
                //交易挖矿配置详情
                Services.getData("tradeDig/digConfigDetail", $scope.params, function(datas) {
                    $scope.trans = datas.data.data;
                    for (var i = 0; i < $scope.transList.length; i++) {
                        for (var j = 0; j < $scope.trans.transPair.length; j++) {
                            if ($scope.transList[i].id == $scope.trans.transPair[j].marketId) {
                                $scope.transType[i] = $scope.trans.transPair[j].marketId;
                            }
                        }
                    }
                })
            });
            //交易挖矿配置
            $scope.savecoins = function() {
                Services.getData("tradeDig/addDigConfig", $scope.trans, function(result) {
                    if (result.code == 0000) {
                        Services.alertshow(result.msg, 2000);
                    } else {
                        Services.alertshow(result.msg, 2000);
                    }
                })
            }
            //交易挖矿统计
            Services.getData("tradeDig/digCensus", $scope.params, function(dat) {
                $scope.translat = dat.data;
            })
            $scope.transType = [];
            //交易挖矿配置修改
            $scope.savecxg = function() {
                //多选
                $scope.transArray = [];
                for (var i = 0; i < $scope.transType.length; i++) {
                    if ($scope.transType[i]) {
                        $scope.transArray.push($scope.transType[i]);
                    }
                }
                $scope.trans.transPair = $scope.transArray.join(',')
                Services.getData("tradeDig/fixDigConfig", $scope.trans, function(result) {
                    if (result.code == 0000) {
                        Services.alertshow(result.msg, 2000);
                    } else {
                        Services.alertshow(result.msg, 2000);
                    }
                })
            }
            //挖矿停止
            $scope.stope = function() {
                Services.getData("tradeDig/digStop", { id: $scope.trans.id }, function(result) {
                    if (result.code == 0000) {
                        Services.alertshow(result.msg, 2000);
                    } else {
                        Services.alertshow(result.msg, 2000);
                    }
                })
            }
        }])
        .controller('DiglistController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            //查询所有支持交易对
            Services.getDataget("getTransPair", {}, function(data) {
                $scope.transList = data.data.transPair;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("tradeDig/digTradeLogList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.data.content; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "orderNo" },
                        { "data": "phone" },
                        { "data": "transPair" },
                        { "data": "transType" },
                        { "data": "price" },
                        { "data": "amount" },
                        { "data": "tradeTotal" },
                        { "data": "finishTime" },
                        { "data": "fee" },
                        { "data": "rakeBackRate" },
                        { "data": "rakeBackTotal" },
                        { "data": "status" },  
                    ],
                    "columnDefs": [{
                        "targets": 1,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            if (row.phone == null) {
                                return "--";
                            } else {
                                return statusStr += '<td>' + data + '</td>';
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 3,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            if (row.transType == 1) {
                                return "限价交易";
                            } else {
                                return "市价交易";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 7,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd HH:mm');
                        },
                    }, {
                        "targets": 11,
                        "render": function(data, type, row) {
                            if (row.status == 0) {
                                return "待发放";
                            } else {
                                return "已发放";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }]
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
        }])
        .controller('CommissionlistController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            //查询所有支持交易对
            Services.getDataget("getTransPair", {}, function(data) {
                $scope.transList = data.data.transPair;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("tradeDig/rakeBackLogList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.data.content; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "orderNo" },
                        { "data": "invitePhone" },
                        { "data": "phone" },
                        { "data": "transPair" },
                        { "data": "transType" },
                        { "data": "price" },
                        { "data": "amount" },
                        { "data": "tradeTotal" },
                        { "data": "finishTime" },
                        { "data": "fee" },
                        { "data": "rakeBackRate" },
                        { "data": "rakeBackTotal" },
                        { "data": "status" },  
                    ],
                    "columnDefs": [{
                        "targets": 1,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            if (row.invitePhone == null) {
                                return "--";
                            } else {
                                return statusStr += '<td>' + data + '</td>';
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 4,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            if (row.transType == 1) {
                                return "限价交易";
                            } else {
                                return "市价交易";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd HH:mm');
                        },
                    }, {
                        "targets": 12,
                        "render": function(data, type, row) {
                            if (row.status == 0) {
                                return "待发放";
                            } else {
                                return "已发放";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }]
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
        }])
});