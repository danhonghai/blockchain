define([
    '../../app'
], function(controllers) {
    controllers
        //充币
        .controller('RechargeListController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {};
            //查询所有币种
            Services.getData("fund/coinList", {}, function(data) {
                $scope.coinList = data.data.coinList;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("fund/chargeCoinList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.chargeCoin; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "id" },
                        { "data": "phone" },
                        { "data": "email" },
                        { "data": "coinName" },
                        { "data": "coinAddress" },
                        { "data": "charge" },
                        { "data": "status" },
                        { "data": "chargeTime" },
                        { "data": "finishTime" }
                    ],
                    "columnDefs": [{
                            "targets": 4,
                            "render": function(data, type, row) {
                                var statusStr = "";
                                if (row.coinAddress == null) {
                                    return "--";
                                } else {
                                    return statusStr += '<td>' + data+ '</td>';
                                }
                            }
                        }, {
                            "targets": 6,
                            "render": function(data, type, row) {
                                //充币状态 0 待审核 1：充币中 2：充币成功 3：充币失败 4：驳回撤销
                                if (data == 0) {
                                    return "待审核";
                                } else if (data == 1) {
                                    return "充币中";
                                } else if (data == 2) {
                                    return "充币成功";
                                } else if (data == 3) {
                                    return "充币失败";
                                } else {
                                    return "驳回撤销";
                                }
                            }
                        }, {
                            "targets": 7,
                            "render": function(data, type, row) {
                                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                            }
                        }, {
                            "targets": 8,
                            "render": function(data, type, row) {
                                return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                            },
                        }
                        /* {
                                                    "targets": 9,
                                                    "render": function(data, type, row) {
                                                        //充币状态 0 待审核 1：充币中 2：充币成功 3：充币失败 4：驳回撤销
                                                        if (row.status == 0) {
                                                            return '<a class="btn btn-rounded btn-success" style="padding:2px 10px; margin-right:10px;" ng-click="addCoin(' + data + ')">修改</a>' +
                                                                '<button class="btn btn-rounded btn-primary" style="padding:2px 10px; " ng-click="auditFun(' + data + ')">审核</button>';
                                                        }
                                                        if (row.status == 1) {
                                                            return '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;" ng-click="confirmFun(' + data + ')">确认</button>';
                                                        } else {
                                                            return '<button class="btn btn-rounded btn-info" style="padding:2px 10px;" ng-click="auditFun(' + data + ')">查看</button>';
                                                        }

                                                    },
                                                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                                        $compile(nTd)($scope);
                                                    }
                                                }*/
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

            //新增(编辑),充币记录
            $scope.addCoin = function(id) {
                $scope.coinParams = {};
                //初始化上传组件，解决回显文件后，关闭弹窗，再次打开数据没有初始化
                $('.imgFileWrap').empty().append('<input name="pFile" type="file" class="file imgFile" >');
                if (id) {
                    Services.getData("fund/rechargeDetail", { id: id }, function(data) {
                        $scope.coinParams = data.data.chargeCoinDetail;
                        $scope.coinParams.id = id;
                        $scope.coinParams.userName = data.data.chargeCoinDetail.phone ? data.data.chargeCoinDetail.phone : data.data.chargeCoinDetail.email;
                        $scope.coinParams.from = data.data.chargeCoinDetail.sourceAccount;
                        var tradeImg = data.data.chargeCoinDetail.tradeImg;
                        $scope.coinParams.chargeCoinFile = 1;
                        //单个文件上传
                        $('.imgFile').fileinput({ //营业执照
                            language: 'zh', //设置语言
                            showUpload: false, //是否显示上传按钮
                            showRemove: false,
                            allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                            showClose: false, //是否显示关闭按钮
                            dropZoneEnabled: false,
                            maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                            initialPreview: [tradeImg],
                            initialPreviewAsData: true,
                            autoReplace: true,
                            layoutTemplates: {
                                actionDelete: '', //预览缩略图中删除按钮
                            },
                        }).on("filebatchselected", function(event, files) {
                            $scope.coinParams.chargeCoinFile = files[0];
                        }).on('fileselectnone', function(event) {
                            $scope.coinParams.chargeCoinFile = "";
                        });
                    });
                } else {
                    //单个文件上传
                    $('.imgFile').fileinput({ //营业执照
                        language: 'zh', //设置语言
                        showUpload: false, //是否显示上传按钮
                        showRemove: false,
                        allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                        showClose: false, //是否显示关闭按钮
                        dropZoneEnabled: false,
                        maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                        initialPreview: [],
                        initialPreviewAsData: true,
                        autoReplace: true,
                    }).on("filebatchselected", function(event, files) {
                        $scope.coinParams.chargeCoinFile = files[0];
                    }).on('fileselectnone', function(event) {
                        $scope.coinParams.chargeCoinFile = "";
                    });
                }
                $('.add_coin').modal('show');

            }

            //用户校验
            $scope.checkUserName = function() {
                $scope.coinParams.realName = "";
                if ($scope.coinParams.userName) {
                    Services.getData("fund/checkUserName", { userName: $scope.coinParams.userName }, function(data) {
                        if (data.code == "0000") {
                            $scope.coinParams.realName = data.data.realName;
                        }

                    });
                }
            }

            //保存充币记录
            $scope.savecoin = function() {
                if (!$scope.coinParams.chargeCoinFile) {
                    Services.alertshow("请选择充币凭据");
                    return false;
                }
                var url = "";
                var formFile = new FormData();
                formFile.append("userName", $scope.coinParams.userName);
                formFile.append("coinId", $scope.coinParams.coinId);
                formFile.append("charge", $scope.coinParams.charge);
                formFile.append("from", $scope.coinParams.from);
                formFile.append("tradeNo", $scope.coinParams.tradeNo);
                if ($scope.coinParams.id) { //修改
                    url = "fund/fixChargeRecord";
                    formFile.append("id", $scope.coinParams.id);
                    if ($scope.coinParams.chargeCoinFile != 1) {
                        formFile.append("chargeCoinFile", $scope.coinParams.chargeCoinFile); //加入文件对象
                    }
                } else {
                    url = "fund/addChargeRecord";
                    formFile.append("chargeCoinFile", $scope.coinParams.chargeCoinFile); //加入文件对象
                }
                Services.ajaxData(url, formFile, function(result) {
                    Services.alertshow("操作成功");
                    $scope.searchFun(1);
                    $('.add_coin').modal('hide');
                })
            }

            //审核记录
            $scope.auditFun = function(id) {
                $scope.currentId = id;
                Services.getData("fund/rechargeDetail", { id: id }, function(data) {
                    $scope.auditParams = data.data.chargeCoinDetail;
                    $scope.auditParams.userName = data.data.chargeCoinDetail.phone ? data.data.chargeCoinDetail.phone : data.data.chargeCoinDetail.email;
                    $scope.auditParams.id = id;
                });
                $('.audit_modal').modal('show');
            }
            //审核操作
            $scope.verify = function(status) {
                if (!$scope.auditParams.verifyMsg) {
                    Services.alertshow("请输入审核意见");
                    return false;
                }
                //status 0:不通过 1:通过
                Services.getData("fund/verify", { id: $scope.currentId, status: status, verifyMsg: $scope.auditParams.verifyMsg }, function(data) {
                    Services.alertshow("操作成功");
                    $scope.searchFun(1);
                    $('.audit_modal').modal('hide');
                });
            }

            //确认
            $scope.confirmFun = function(id) {
                $scope.currentId = id;
                $('.confirm_modal').modal('show');
            }
            //确认方法
            $scope.coinConfirm = function(status) {
                //status 0:失败 1:成功
                Services.getData("fund/confirm", { id: $scope.currentId, status: status }, function(data) {
                    Services.alertshow("操作成功");
                    $scope.searchFun(1);
                    $('.confirm_modal').modal('hide');
                });
            }
        }])
        //提币
        .controller('WithdrawalsListController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
            $scope.params = {};
            //查询所有币种
            Services.getData("fund/coinList", {}, function(data) {
                $scope.coinList = data.data.coinList;
            });
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("fund/drawCoinList", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.pageDrawCoin; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [
                        { "data": "txid" },
                        { "data": "phone" },
                        { "data": "email" },
                        { "data": "coinName" },
                        { "data": "coinAddress" },
                        { "data": "draw" },
                        { "data": "fee" },
                        { "data": "status" },
                        { "data": "drawTime" },
                        { "data": "finishTime" },
                        { "data": "remark" },
                        { "data": "id" },
                    ],
                    "columnDefs": [{
                            "targets": 0,
                            "render": function(data, type, row) {
                                if (data == null) {
                                    return '--';
                                }else if(data.length <= 10){
                                    return data;
                                }else {
                                    return '<div>' + $filter('limitTo')(data, data.length / 2) + '</div><div>' + $filter('limitTo')(data, -data.length / 2) + '</div>';
                                }

                            }
                        },{
                            "targets": 4,
                            "render": function(data, type, row) {
                                if (data == null) {
                                    return '--';
                                }else if(data.length <= 10){
                                    return data;
                                }else {
                                    return '<div>' + $filter('limitTo')(data, data.length / 2) + '</div><div>' + $filter('limitTo')(data, -data.length / 2) + '</div>';
                                }

                            }
                        },{
                        "targets": 7,
                        "render": function(data, type, row) {
                            //提币状态，0申请,1撤销2成功 3失败,4提币中
                            if (data == 0) {
                                return "申请";
                            } else if (data == 1) {
                                return "撤销";
                            } else if (data == 2) {
                                return "成功";
                            } else if (data == 3) {
                                return "失败";
                            } else if (data == 4) {
                                return "提币中";
                            }
                        }
                    }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                        }
                    }, {
                        "targets": 9,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss');
                        }
                    },{
                        "targets": 10,
                        "render": function(data, type, row) {
                            if (data == null) {
                                return '--';
                            }else if(data.length <= 8){
                                return data;
                            }else {
                                return '<div title="'+data+'">' + $filter('limitTo')(data, 8) + '......</div>';
                            }

                        }
                    },{
                        "targets": 11,
                        "render": function(data, type, row) {
                            if (row.status == 0) {
                                return '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;" ng-click="confirmFun(' + data + ')">审核</button>';
                            } else {
                                return '--';
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
            //确认
            $scope.confirmFun = function(id) {
                $scope.currentId = id;
                $('.confirm_modal').modal('show');
                $scope.auditParams = {
                    id:$scope.currentId
                }
            }
            //确认方法
            $scope.drawCoinConfirm = function(status) {
                $scope.auditParams.auditOpinion = status;
                //status 0:失败 1:成功
                Services.getData("fund/drawCoinConfirm", $scope.auditParams, function(data) {
                    Services.alertshow("操作成功");
                    $scope.searchFun(1);
                    $('.confirm_modal').modal('hide');
                });
            }
        }]);
});