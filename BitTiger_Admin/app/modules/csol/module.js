define([
    '../../app'
], function(controllers) {
    controllers
        //点卡出售-活动列表
        .controller('CsollistController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.statusArr = ['启用', '停用', '修改', ]; //状态数组
            $scope.params = {};
            //查询所有币种
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("poinCard/cardProgramList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.pointCardPrograms.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.pointCardPrograms.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.pointCardPrograms.content; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "id" },
                        { "data": "programName" },
                        { "data": "startTime" },
                        { "data": "endTime" },
                        { "data": "status" },
                        { "data": "id" },  
                    ],
                    "columnDefs": [{
                        "targets": 2,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 3,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 4,
                        "render": function(data, type, row) {
                            if (data == 0) {
                                return "创建";
                            } else if (data == 1) {
                                return "启用";
                            } else if (data == 2) {
                                return "停用";
                            } else if (data == 3) {
                                return "抢购中";
                            }else {
                                 return "已结束";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 5,
                        "render": function(data, type, row) {
                            var buttons = '';
                            if (row.status == 1) {
                                buttons += '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;"  ng-click="viewDitail(' + data + ',' + row.status + ')">停用</button>';
                            } else {
                                buttons += '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ',' + row.status + ')">启用</button>'
                            }
                            return buttons += '<a class="btn btn-rounded btn-primary" ng-click="viewDil(' + data + ',' + row.id + ')" style="padding:2px 10px; margin-right:10px;">修改</a>';

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

            //添加活动弹出框
            $scope.addCoin = function() {
                $scope.zNodes = {};
                $('.add_coin').modal('show');
            }
            //添加活动提交
            $scope.savecoins = function() {
                Services.getData("poinCard/addCardProgram", $scope.zNodes, function(result) {
                    if (result.code == 0000) {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add_coin').modal('hide');
                    } else {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add_coin').modal('hide')
                    }
                })
            }
            //修改比赛弹出框
            $scope.viewDil = function(id) {
                $('.add_coinss').modal('show');
                Services.getData("poinCard/cardProgramDetail", { id: id}, function(datass) {
                    $scope.zNns = datass.data.pointCardProgram;
                    $scope.zNns.startTime = $filter('date')($scope.zNns.startTime, 'yyyy-MM-dd HH:mm:ss');
                    $scope.zNns.endTime = $filter('date')($scope.zNns.endTime, 'yyyy-MM-dd HH:mm:ss');
                })
            }
            //启用停用
            $scope.viewDitail = function(bid, type) {
                Services.getData("poinCard/fixCardProgramStatus", { id: bid, type: type == 1 ? '0' : '1' }, function(data) {
                    $("#example").dataTable().fnDraw(true);
                });
            }
            //修改提交
            $scope.amendDit = function(id) {
                var men = {
                    id: $scope.zNns.id,
                    programName: $scope.zNns.programName,
                    totalCredit: $scope.zNns.totalCredit,
                    startTime: $scope.zNns.startTime,
                    endTime: $scope.zNns.endTime,
                };
                Services.getData("poinCard/fixCardProgram", men, function(datas) {
                    if (datas.code == 0000) {
                        Services.alertshow(datas.msg, 200);
                        $("#example").dataTable().fnDraw(true);
                    } else {
                        Services.alertshow(datas.msg, 200);
                        $("#example").dataTable().fnDraw(true);
                    }
                    $('.add_coinss').modal('hide');
                })
            }


        }])
        .controller('ProductionController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.statusArr = ['编辑', '发布']; //状态数组
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("poinCard/cardActivityList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.cardActivityPage.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.cardActivityPage.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.cardActivityPage.content; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "id" },
                        { "data": "cardType" },
                        { "data": "cardProgramName" },
                        { "data": "cardAmount" },
                        { "data": "cardLeft" },
                        { "data": "cardBtcPrice" },
                        { "data": "cardEthPrice" },
                        { "data": "cardCredit" },
                        { "data": "buyLimit" },
                        { "data": "cardRmark" },
                        { "data": "status" },
                        { "data": "id" },  
                    ],
                    "columnDefs": [{
                        "targets": 1,
                        "render": function(data, type, row) {
                            if (data == 0) {
                                return "";
                            } else if (data == 1) {
                                return "王者卡";
                            } else if (data == 2) {
                                return "黄金卡";
                            } else {
                                return "白金卡";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 10,
                        "render": function(data, type, row) {
                            if (data == 0) {
                                return "未开始";
                            } else if (data == 1) {
                                return "抢购中";
                            } else if (data == 2) {
                                return "已售罄";
                            } else {
                                return "已结束";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 11,
                        "render": function(data, type, row) {
                            var buttons = '';
                            /* if (row.status == 0) {
                                 buttons += '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ',' + row.status + ')">下架</button>';
                             } else {
                                 buttons += '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ',' + row.status + ')">上架</button>'
                             }*/
                            return '<a class="btn btn-rounded btn-primary" ng-click="viewDil(' + data + ',' + row.id + ')" style="padding:2px 10px; margin-right:10px;">修改</a>'; /*+'<button class="btn btn-rounded  btn-success" style="padding:2px 10px;margin-right:10px;" ng-click="deletDit(' + row.id + ')"> 发布</button>'*/

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
            //查询所有关联活动
            Services.getData("poinCard/ableusecardProgramList", {}, function(datass) {
                $scope.poinList = datass.data.pointCardPrograms;
            });
            //添加活动弹出框
            $scope.addCoin = function() {
                $('.add_coin').modal('show');
            }
            //添加活动提交
            $scope.savecoin = function() {
                Services.getData("poinCard/addCardActivity", $scope.coinParams, function(result) {
                    if (result.code == 0000) {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add_coin').modal('hide');
                    } else {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add_coin').modal('hide')
                    }
                })
            }
            //上架下架
            /* $scope.viewDitail = function(bid, type) {
                 Services.getData("poinCard/fixCardProgramStatus", { id: bid, type: type == 1 ? '0' : '1' }, function(data) {
                     $("#example").dataTable().fnDraw(true);
                 });
             }*/
            //修改比赛弹出框
            $scope.viewDil = function(id) {
                $('.add_coinees').modal('show');
                Services.getData("poinCard/CardActivityDetail", { id: id }, function(data) {
                    $scope.zNnss = data.data.pointCardActivity;
                })
            }
            //修改提交
            $scope.amendDit = function(id) {
                var men = {
                    id: $scope.zNnss.id,
                    cardProgramId: $scope.zNnss.cardProgramId,
                    cardType: $scope.zNnss.cardType,
                    cardAmount: $scope.zNnss.cardAmount,
                    buyLimit: $scope.zNnss.buyLimit,
                    cardCredit: $scope.zNnss.cardCredit,
                    cardRmark: $scope.zNnss.cardRmark,
                    cardBtcPrice: $scope.zNnss.cardBtcPrice,
                    cardEthPrice: $scope.zNnss.cardEthPrice,
                };
                Services.getData("poinCard/fixCardActivity", men, function(datas) {
                    if (datas.code == 0000) {
                        Services.alertshow(datas.msg, 200);
                        $("#example").dataTable().fnDraw(true);
                    } else {
                        Services.alertshow(datas.msg, 200);
                        $("#example").dataTable().fnDraw(true);
                    }
                    $('.add_coinees').modal('hide');
                })
            }


        }])
});