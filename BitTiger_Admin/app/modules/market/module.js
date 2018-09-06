define([
    '../../app',
    '../../directives/ckeditor'
], function(controllers) {
    controllers
        //市场管理
        .controller('MarketListController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', '$rootScope', function($scope, $compile, $state, $filter, $timeout, Services, $rootScope) {
            $scope.params = {};
            $scope.statusArr = ['交易开启中', '交易暂停', '删除', '修改', ]; //状态数组
            //查询所有市场
            Services.getDataget("getMarket", {}, function(data) {
                $scope.params = data.data.market;
            });
            //查询所有币种
            Services.getData("fund/coinList", {}, function(data) {
                $scope.coinList = data.data.coinList;
            });
            //市场管理列表
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getDataget("showTransMarketInfo", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.transMarketList; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "transMarketStr" },
                        { "data": "transPair" },
                        { "data": "openPrice" },
                        { "data": "serviceCharge" },
                        { "data": "entrustOrderHour" },
                        { "data": "minPrice" },
                        { "data": "minAmount" },
                        { "data": "amountDecimalLimit" },
                        { "data": "minTurnover" },
                        { "data": "turnoverDecimalLimit" },
                        { "data": "marketTurnoverPrice" },
                        { "data": "marketTurnoverDecimalLimit" },
                        { "data": "marketMinAmount" },
                        { "data": "marketAmountDecimalLimit" },
                        { "data": "statusStr" },
                        { "data": "id" } 
                    ],
                    "columnDefs": [{
                            "targets": 2,
                            "render": function(data, type, row) {
                                if (row.openPrice == null) {
                                    return '--';
                                } else {
                                    /* return '<div>' + $filter('limitTo')(data, data.length / 2) + '</div><div>' + $filter('limitTo')(data, -data.length / 2) + '</div>';*/
                                    return '<div>' + data + '</div>';
                                }
                            },
                        },{
                        "targets": 15,
                        "render": function(data, type, row) {
                            var buttons = '';
                            if (row.status == 0) {
                                buttons += '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ', 1)">交易暂停</button>';
                            } else {
                                buttons += '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ',0)">交易开启中</button>';
                            }
                            return buttons += '<button class="btn btn-rounded  btn-danger" style="padding:2px 10px;margin-right:10px;" ng-click="deletDit(' + data + ')"> 删除</button>' + '<a class="btn btn-rounded btn-primary" ng-click="viewDil(' + data + ')" style="padding:2px 10px; margin-right:10px;">修改</a>';

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
            //启用停用
            $scope.viewDitail = function(bid, status) {
                Services.getData("optTransPair", { id: bid, optType: status }, function(data) {
                    $("#example").dataTable().fnDraw(true);
                });
            }
            //添交易对弹出框
            $scope.addCoin = function(data) {
                $('.add_coin').modal('show');
            };
            // 添加交易对提交地址  
            $scope.addition = function() {
                $('.add_coin').modal('hide');
                $scope.additionpar = {
                    transMarket: $scope.params.transMarket,
                    coinId: $scope.coinList.coinId,
                    openPrice: $scope.coinParams.openPrice,
                    serviceCharge: $scope.coinParams.serviceCharge,
                    entrustOrderHour: $scope.coinParams.entrustOrderHour,
                    minPrice: $scope.coinParams.minPrice,
                    minAmount: $scope.coinParams.minAmount,
                    amountDecimalLimit: $scope.coinParams.amountDecimalLimit,
                    minTurnover: $scope.coinParams.minTurnover,
                    turnoverDecimalLimit: $scope.coinParams.turnoverDecimalLimit,
                    marketTurnoverPrice: $scope.coinParams.marketTurnoverPrice,
                    marketTurnoverDecimalLimit: $scope.coinParams.marketTurnoverDecimalLimit,
                    marketMinAmount: $scope.coinParams.marketMinAmount,
                    marketAmountDecimalLimit: $scope.coinParams.marketAmountDecimalLimit,
                    priceDecimalLimit: $scope.coinParams.priceDecimalLimit,
                };
                Services.getData("addTransPair", $scope.additionpar, function(data) {
                    if (data.code == 0000) {
                        Services.alertshow(data.msg, 2000)
                        $("#example").dataTable().fnDraw(true);
                        $scope.params.transMarket = "";
                        $scope.coinList.coinId = "";
                        $scope.coinParams.openPrice = "";
                        $scope.coinParams.serviceCharge = "";
                        $scope.coinParams.entrustOrderHour = "";
                        $scope.coinParams.minPrice = "";
                        $scope.coinParams.minAmount = "";
                        $scope.coinParams.amountDecimalLimit = "";
                        $scope.coinParams.minTurnover = "";
                        $scope.coinParams.turnoverDecimalLimit = "";
                        $scope.coinParams.marketTurnoverPrice = "";
                        $scope.coinParams.marketTurnoverDecimalLimit = "";
                        $scope.coinParams.marketMinAmount = "";
                        $scope.coinParams.marketAmountDecimalLimit = "";
                        $scope.coinParams.priceDecimalLimit = "";

                    } else {
                        Services.alertshow(result.msg, 1000);
                        $("#example").dataTable().fnDraw(true);
                        $scope.params.transMarket = "";
                        $scope.coinList.coinId = "";
                        $scope.coinParams.openPrice = "";
                        $scope.coinParams.serviceCharge = "";
                        $scope.coinParams.entrustOrderHour = "";
                        $scope.coinParams.minPrice = "";
                        $scope.coinParams.minAmount = "";
                        $scope.coinParams.amountDecimalLimit = "";
                        $scope.coinParams.minTurnover = "";
                        $scope.coinParams.turnoverDecimalLimit = "";
                        $scope.coinParams.marketTurnoverPrice = "";
                        $scope.coinParams.marketTurnoverDecimalLimit = "";
                        $scope.coinParams.marketMinAmount = "";
                        $scope.coinParams.marketAmountDecimalLimit = "";
                        $scope.coinParams.priceDecimalLimit = "";
                    }
                })
            }
            //删除弹出框
            $scope.deletDit = function(data, status) {
                $('.info-modal').modal('show');
                $scope.data = data;
            }
            // 删除交易对提交方法
            $scope.deleteFun = function(data) {
                Services.getData("optTransPair", { id: $scope.data, optType: 2 }, function(data) {
                    Services.alertshow(data.msg, 2000)
                    $("#example").dataTable().fnDraw(true);
                    $('.info-modal').modal('hide');
                    $scope.data = "";
                })
            }
            //修改易对弹出框
            $scope.viewDil = function(bid) {
                $scope.update = bid;
                Services.getDataget("getMarketDetail", { id: $scope.update }, function(data) {
                    $('.add_coinss').modal('show');
                    $scope.conparms = data.data.market;
                })
            };
            //修好提交
            $scope.additi = function(bid) {
                $('.add_coinss').modal('hide');
                var artick = {
                    id: $scope.update,
                    openPrice:$scope.conparms.openPrice,
                    serviceCharge: $scope.conparms.serviceCharge,
                    entrustOrderHour: $scope.conparms.entrustOrderHour,
                    minPrice: $scope.conparms.minPrice,
                    minAmount: $scope.conparms.minAmount,
                    amountDecimalLimit: $scope.conparms.amountDecimalLimit,
                    minTurnover: $scope.conparms.minTurnover,
                    turnoverDecimalLimit: $scope.conparms.turnoverDecimalLimit,
                    marketTurnoverPrice: $scope.conparms.marketTurnoverPrice,
                    marketTurnoverDecimalLimit: $scope.conparms.marketTurnoverDecimalLimit,
                    marketMinAmount: $scope.conparms.marketMinAmount,
                    marketAmountDecimalLimit: $scope.conparms.marketAmountDecimalLimit,
                    priceDecimalLimit: $scope.conparms.priceDecimalLimit,
                };
                Services.getData("updateTransPair", artick, function(result) {
                    if (result.code == 0000) {
                        Services.alertshow(result.msg, 1000);
                        $("#example").dataTable().fnDraw(true);
                    } else {
                        Services.alertshow(result.msg, 1000);
                        $("#example").dataTable().fnDraw(true);

                    }
                })
            }

        }])
        //币种管理
        .controller('CurrencyListController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {};

            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("findAllCoin", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.coins; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "name" },
                        { "data": "rechargeAddress" },
                        { "data": "leastRecharge" },
                        { "data": "leastDraw" },
                        { "data": "mostDrawOnce" },
                        { "data": "mostDrawDay" },
                        { "data": "drawFee" },
                        { "data": "status" },
                        { "data": "putawayTime" },
                        { "data": "id" },  
                    ],
                    "columnDefs": [{
                        "targets": 7,
                        "render": function(data, type, row) {
                            //充币状态 0 下架,1 上架
                            if (data == 1) {
                                return "上架";
                            } else {
                                return "下架";
                            }
                        }
                    }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd HH:mm');
                        },
                    }, {
                        "targets": 9,
                        "render": function(data, type, row) {
                            var resultStr = '<a class="btn btn-rounded btn-success" style="padding:2px 10px; margin-right:10px;" ui-sref="logged.addCoin({id:' + data + '})">修改</a>' +
                                '<button class="btn btn-rounded btn-primary" style="padding:2px 10px; margin-right:10px; " ng-click="upOrDownCoin(' + data + ',2)">删除</button>' +
                                '<button class="btn btn-rounded btn-info" style="padding:2px 10px;" ui-sref="logged.viewCoin({id:' + data + '})">查看</button>';
                            if (row.status == 0) {
                                return '<button class="btn btn-rounded btn-warning" style="padding:2px 10px; margin-right:10px;" ng-click="upOrDownCoin(' + data + ',1)">上架</button>' + resultStr;
                            } else {
                                return '<button class="btn btn-rounded btn-danger" style="padding:2px 10px; margin-right:10px;" ng-click="upOrDownCoin(' + data + ',0)">下架</button>' + resultStr;
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

            //1上架，0下架,2删除
            $scope.upOrDownCoin = function(id, status) {
                $scope.currentStatus = status;
                $scope.currentId = id;
                $('.confirm_modal').modal('show');
            }

            $scope.coinConfirm = function() {
                Services.getData("upOrDownCoin", { id: $scope.currentId, status: $scope.currentStatus }, function(data) {
                    $('.confirm_modal').modal('hide');
                    Services.alertshow("操作成功");
                    $scope.searchFun(0)
                });
            }

        }])
        //新增币种
        .controller('AddCoinController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {
                "blockQuery": "",
                "circulationCount": "",
                "defaultUnit": "",
                "drawFee": "",
                "issueCount": "",
                "issueTimeReq": "",
                "leastDraw": "",
                "leastRecharge": "",
                "logoFile": "",
                "mostDrawDay": "",
                "mostDrawOnce": "",
                "name": "",
                "nameCn": "",
                "officialWebsite": "",
                "putawayTimeReq": "",
                "raisePrice": "",
                "rechargeAddress": "",
                "remark": "",
                "status": 0,
                "whiteBook": "",
                "isFiat": 0,
                "drawDecimalLimit": "",
            };

            var id = $state.params.id || "";
            if (id) {
                Services.getData("findOneById", { id: id }, function(data) {
                    Object.keys(data.data.coin).forEach(function(key) {
                        if (data.data.coin[key]) {
                            $scope.params[key] = data.data.coin[key];
                        }
                    });
                    $scope.params.isRemoveLogo = 0;
                    $scope.params.issueTimeReq = $filter('date')(data.data.coin.issueTime, 'yyyy-MM-dd HH:mm');
                    $scope.params.putawayTimeReq = $filter('date')(data.data.coin.putawayTime, 'yyyy-MM-dd HH:mm');
                    var tradeImg = data.data.coin.logo;
                    $scope.params.logoFile = 1;
                    $timeout(function() {
                        //单个文件上传
                        $('.imgFile').fileinput({ //营业执照
                            language: 'zh', //设置语言
                            showUpload: false, //是否显示上传按钮
                            showRemove: true,
                            showPreview: false, //隐藏预览
                            allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                            showClose: false, //是否显示关闭按钮
                            dropZoneEnabled: false,
                            maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                            initialPreview: tradeImg ? [tradeImg] : [],
                            initialPreviewAsData: true,
                            autoReplace: true,
                            layoutTemplates: {
                                actionDelete: '', //预览缩略图中删除按钮
                            },
                        }).on("filebatchselected", function(event, files) {
                            $scope.params.logoFile = files[0];
                            $scope.params.isRemoveLogo = 0;
                        }).on('fileselectnone', function(event) {
                            $scope.params.logoFile = "";
                            $scope.params.isRemoveLogo = 1;
                        }).on('filecleared', function(event) {
                            $scope.params.logoFile = "";
                            $scope.params.isRemoveLogo = 1;
                        });
                    }, 200);
                });
            } else {
                $timeout(function() {
                    //单个文件上传
                    $('.imgFile').fileinput({ //营业执照
                        language: 'zh', //设置语言
                        showUpload: false, //是否显示上传按钮
                        showRemove: true,
                        showPreview: false, //隐藏预览
                        allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                        showClose: false, //是否显示关闭按钮
                        dropZoneEnabled: false,
                        maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                        initialPreviewAsData: true,
                        autoReplace: true,
                        layoutTemplates: {
                            actionDelete: '', //预览缩略图中删除按钮
                        },
                    }).on("filebatchselected", function(event, files) {
                        $scope.params.logoFile = files[0];
                    }).on('fileselectnone', function(event) {
                        $scope.params.logoFile = "";
                    }).on('filecleared', function(event) {
                        $scope.params.logoFile = "";
                    });
                }, 200);
            }

            //新增(编辑),充币记录
            $scope.addCoin = function() {
                var url = "";
                var formFile = new FormData();
                for (var key in $scope.params) {
                    if (key != "logo" && key != "logoFile") {
                        formFile.append(key, $scope.params[key]);
                    }
                }
                if ($scope.params.id) { //修改
                    url = "editorCoin";
                    if ($scope.params.logoFile != 1 && $scope.params.logoFile) {
                        formFile.append("logoFile", $scope.params.logoFile); //加入文件对象
                    }
                } else {
                    url = "createCoin";
                    if ($scope.params.logoFile) {
                        formFile.append("logoFile", $scope.params.logoFile); //加入文件对象
                    }
                }
                Services.ajaxData(url, formFile, function(result) {
                    Services.alertshow("操作成功");
                    $state.go('logged.currencyList');
                })
            }
        }])
        //查看币种
        .controller('ViewCoinController', ['$scope', '$filter', '$state', '$sce', '$timeout', 'Services', function($scope, $filter, $state, $sce, $timeout, Services) {
            $scope.params = {};
            var id = $state.params.id || "";
            if (id) {
                Services.getData("findOneById", { id: id }, function(data) {
                    $scope.params = data.data.coin;
                    $scope.params.issueTimeReq = $filter('date')(data.data.coin.issueTime, 'yyyy-MM-dd HH:mm');
                    $scope.params.putawayTimeReq = $filter('date')(data.data.coin.putawayTime, 'yyyy-MM-dd HH:mm');
                    $scope.params.remark = $sce.trustAsHtml(data.data.coin.remark);
                    /*Object.keys(data.data.coin).forEach(function(key){
                        if(data.data.coin[key]){
                            $scope.params[key] = data.data.coin[key];
                        }
                    });*/
                });
            }
        }]);
});