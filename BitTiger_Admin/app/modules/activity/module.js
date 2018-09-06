define([
    '../../app'
], function(controllers) {
    controllers
    //世界杯
    .controller('ActivitylistController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
        $scope.statusArr = ['修改', '查看', '发布', '结束']; //状态数组
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
                    Services.getData("guess/guessList", params, function(result) {
                        //封装返回数据
                        var returnData = {};
                        returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.data.page.totalElements; //返回数据全部记录
                        returnData.recordsFiltered = result.data.page.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data.page.content; //返回的数据列表
                        //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                        //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                        callback(returnData);
                    });
                },
                //列表表头字段
                columns: [
                    { "data": "id" },
                    { "data": "masterTeam" },
                    { "data": "masterTeamEn" },
                    { "data": "guestTeam" },
                    { "data": "guestTeamEn" },
                    { "data": "period" },
                    { "data": "winOdds" },
                    { "data": "status" },
                    { "data": "deadline" },
                    { "data": "joinCount" },
                    { "data": "id" },  
                ],
                "columnDefs": [{
                        "targets": 5,
                        "render": function(data, type, row) {
                            if (data == 0) {
                                return "小组赛";
                            } else if (data == 1) {
                                return "8强赛";
                            } else if (data == 2) {
                                return "4强赛";
                            } else if (data == 3) {
                                return "半决赛";
                            } else {
                                return "决赛";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 6,
                        "render": function(data, type, row) {
                            return '<span style="margin-right: 1rem;">' + '胜:' + row.winOdds + '</span>' + '<span style="margin-right: 1rem;">' + '平:' + row.flatOdds + '</span>' + '<span>' + '负:' + row.failOdds + '</span>'
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 7,
                        "render": function(data, type, row) {
                            if (data == 0) {
                                return "未启用";
                            } else if (data == 1) {
                                return "进行中";
                            } else if (data == 2) {
                                return "已关闭";
                            } else {
                                return "已结束";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd');
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    },
                    {
                        "targets": 10,
                        "render": function(data, type, row) {
                            if (row.status == 0) {
                                return '<a class="btn btn-rounded btn-danger" style="padding:2px 10px; margin-right:10px;" ng-click="viewDil(' + data + ')">修改</a>' +
                                    '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="sort(' + data + ')">查看</button>' +
                                    '<button class="btn btn-rounded btn-success" style="padding:2px 10px; " ng-click="vfy(' + data + ')">发布</button>';
                            } else if (row.status == 1) {
                                return '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDil(' + data + ')">修改</button>' +
                                    '<button class="btn btn-rounded btn-info" style="padding:2px 10px;" ng-click="sort(' + data + ')">查看</button>';
                            } else if (row.status == 2) {
                                return '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="sort(' + data + ')">查看</button>' +
                                    '<button class="btn btn-rounded btn-primary" style="padding:2px 10px; " ng-click="end(' + data + ')">结束</button>';
                            } else {
                                return '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="sort(' + data + ')">查看</button>' +
                                    '<button class="btn btn-rounded " style="padding:2px 10px;"  disabled="disabled">结束</button>';
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

        //添加比赛弹出框
        $scope.addCoin = function() {
            $scope.coinParams = {};
            //初始化上传组件，解决回显文件后，关闭弹窗，再次打开数据没有初始化
            $('.imgFileWrap').empty().append('<input name="masterPic" type="file" class="file imgFile" >');
            $('.imgFileWraps').empty().append('<input name="guestPic" type="file" class="file imgFiles" >');
            $scope.coinParams = { status: 0 };
            $('.imgFile').fileinput({ //营业执照
                language: 'zh', //设置语言
                showUpload: false, //是否显示上传按钮
                showRemove: false,
                allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                showClose: false, //是否显示关闭按钮
                dropZoneEnabled: false,
                maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                initialPreview: [],
                hiddenThumbnailContent: true,
            }).on("filebatchselected", function(event, files) {
                $scope.coinParams.masterPic = files[0];
            }).on('fileselectnone', function(event) {
                $scope.coinParams.masterPic = "";
            });
            $('.imgFiles').fileinput({ //营业执照
                language: 'zh', //设置语言
                showUpload: false, //是否显示上传按钮
                showRemove: false,
                allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                showClose: false, //是否显示关闭按钮
                dropZoneEnabled: false,
                maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                initialPreview: [],
                hiddenThumbnailContent: true,
            }).on("filebatchselected", function(event, files) {
                $scope.coinParams.guestPic = files[0];
            }).on('fileselectnone', function(event) {
                $scope.coinParams.guestPic = "";
            });
            $('.add_coin').modal('show');
        }
        //添加提交按钮
        $scope.savecoin = function() {
            if (!$scope.coinParams.masterPic || !$scope.coinParams.guestPic) {
                Services.alertshow("请选择国旗");
                return false;
            }
            var url = "";
            var formFile = new FormData();
            formFile.append("masterTeam", $scope.coinParams.masterTeam);
            formFile.append("masterTeamEn", $scope.coinParams.masterTeamEn);
            formFile.append("guestTeam", $scope.coinParams.guestTeam);
            formFile.append("guestTeamEn", $scope.coinParams.guestTeamEn);
            formFile.append("winOdds", $scope.coinParams.winOdds);
            formFile.append("flatOdds", $scope.coinParams.flatOdds);
            formFile.append("failOdds", $scope.coinParams.failOdds);
            formFile.append("deadline", $scope.coinParams.deadline);
            formFile.append("period", $scope.coinParams.period);
            formFile.append("status", $scope.coinParams.status);
            formFile.append("masterPic", $scope.coinParams.masterPic); //加入文件对象
            formFile.append("guestPic", $scope.coinParams.guestPic); //加入文件对象
            Services.ajaxData("guess/addGuessConfig", formFile, function(result) {
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
            $scope.condition = {};
            //初始化上传组件，解决回显文件后，关闭弹窗，再次打开数据没有初始化
            $('.imgFileWrap').empty().append('<input name="masterPic" type="file" class="file imgFile">');
            $('.imgFileWraps').empty().append('<input name="guestPic" type="file" class="file imgFiles">');
            Services.getData("guess/guessDetail", { id: id }, function(data) {
                $scope.condition = data.data.chargeCoinDetail;
                var tradeImg = data.data.chargeCoinDetail.guestPic; //历史图片显示
                var tradeImgs = data.data.chargeCoinDetail.masterPic; //历史图片显示
                $scope.condition.masterPic = 1; //判断提交时用户是否重选了图片
                $scope.condition.guestPic = 2; //判断提交时用户是否重选了图片
                $('.imgFile').fileinput({ //营业执照
                    language: 'zh', //设置语言
                    showUpload: false, //是否显示上传按钮
                    showRemove: false,
                    allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                    showClose: false, //是否显示关闭按钮
                    dropZoneEnabled: false,
                    maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                    initialPreview: [tradeImgs],
                    initialPreviewAsData: true, //历史图片显示
                    autoReplace: true,
                    hiddenThumbnailContent: true,
                }).on("filebatchselected", function(event, files) {
                    $scope.condition.masterPic = files[0];
                }).on('fileselectnone', function(event) {
                    $scope.condition.masterPic = "";
                });
                $('.imgFiles').fileinput({ //营业执照
                    language: 'zh', //设置语言
                    showUpload: false, //是否显示上传按钮
                    showRemove: false,
                    allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                    showClose: false, //是否显示关闭按钮
                    dropZoneEnabled: false,
                    maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                    initialPreview: [tradeImg],
                    initialPreviewAsData: true, //历史图片显示
                    autoReplace: true,
                    hiddenThumbnailContent: true,
                }).on("filebatchselected", function(event, files) {
                    $scope.condition.guestPic = files[0];
                }).on('fileselectnone', function(event) {
                    $scope.condition.guestPic = "";
                });
                $('.add-admin-modal').modal('show');
            })
        }
        //修改提交
        $scope.amendDit = function() {
            if (!$scope.condition.masterPic || !$scope.condition.guestPic) {
                Services.alertshow("请选择国旗");
                return false;
            }
            var url = "";
            var formFiles = new FormData();
            formFiles.append("id", $scope.condition.id);
            formFiles.append("masterTeam", $scope.condition.masterTeam);
            formFiles.append("masterTeamEn", $scope.condition.masterTeamEn);
            formFiles.append("guestTeam", $scope.condition.guestTeam);
            formFiles.append("guestTeamEn", $scope.condition.guestTeamEn);
            formFiles.append("winOdds", $scope.condition.winOdds);
            formFiles.append("flatOdds", $scope.condition.flatOdds);
            formFiles.append("failOdds", $scope.condition.failOdds);
            formFiles.append("deadline", $scope.condition.deadline);
            formFiles.append("period", $scope.condition.period);
            formFiles.append("status", $scope.condition.status);
            if ($scope.condition.masterPic != 1 || $scope.condition.guestPic != 2) {
                formFiles.append("masterPic", $scope.condition.masterPic); //加入文件对象
                formFiles.append("guestPic", $scope.condition.guestPic); //加入文件对象
            }
            Services.ajaxData("guess/fixGuessConfig", formFiles, function(result) {
                if (result.code == 0000) {
                    Services.alertshow(result.msg, 200);
                    $("#example").dataTable().fnDraw(true);
                } else {
                    Services.alertshow(result.msg, 200);
                    $("#example").dataTable().fnDraw(true);
                }
                $('.add-admin-modal').modal('hide');
            })
        }
        //赛场配置详情弹出框
        $scope.sort = function(id) {
            Services.getData("guess/guessDetail", { id: id }, function(data) {
                $scope.auditParams = data.data.chargeCoinDetail;
                $scope.auditParams.id = id;
                var tradeImg = data.data.chargeCoinDetail.guestPic; //历史图片显示
                var tradeImgs = data.data.chargeCoinDetail.masterPic; //历史图片显示
                $('.imgFile').fileinput({ //营业执照
                    language: 'zh', //设置语言
                    showUpload: false, //是否显示上传按钮
                    showRemove: false,
                    allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                    showClose: false, //是否显示关闭按钮
                    dropZoneEnabled: false,
                    maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                    initialPreview: [tradeImgs],
                    initialPreviewAsData: true, //历史图片显示
                    autoReplace: true,
                    hiddenThumbnailContent: true,
                }).on("filebatchselected", function(event, files) {
                    $scope.auditParams.masterPic = files[0];
                }).on('fileselectnone', function(event) {
                    $scope.auditParams.masterPic = "";
                });
                $('.imgFiles').fileinput({ //营业执照
                    language: 'zh', //设置语言
                    showUpload: false, //是否显示上传按钮
                    showRemove: false,
                    allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                    showClose: false, //是否显示关闭按钮
                    dropZoneEnabled: false,
                    maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                    initialPreview: [tradeImg],
                    initialPreviewAsData: true, //历史图片显示
                    autoReplace: true,
                    hiddenThumbnailContent: true,
                }).on("filebatchselected", function(event, files) {
                    $scope.auditParams.guestPic = files[0];
                }).on('fileselectnone', function(event) {
                    $scope.auditParams.guestPic = "";
                });
                $('.audit_modal').modal('show');
            })
        }
        //结束结算
        $scope.end = function(id) {
            $scope.endid = id;
            $scope.adminParamss = {
                resultType : 0
            }
            $('.abortive-dialog').modal('show');
        }
        
        $scope.verify = function() {
            Services.getData("guess/endGuess", { id: $scope.endid, resultType: $scope.adminParamss.resultType }, function(data) {
                $("#example").dataTable().fnDraw(true);
                $('.abortive-dialog').modal('hide');
            })
        }
        //发布
        $scope.vfy = function(id) {
            Services.getData("guess/publicGuess", { id: id }, function(data) {
                $("#example").dataTable().fnDraw(true);
            })
        }

    }])
    //获奖用户列表
    .controller('WinuserlistController', ['$scope', '$compile', '$state', '$filter', '$timeout', 'Services', function($scope, $compile, $state, $filter, $timeout, Services) {
        
        $timeout(function() {
            $scope.table = $('#example').DataTable({
                ajax: function(data, callback, settings) {
                    var params = $scope.isSearch ? $scope.params : {};
                    params.isVip = 1;
                    params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                    params.pageNumber = (data.start / data.length) + 1; //当前页码
                    Services.getData("showUserList", params, function(result) {
                        //封装返回数据
                        var returnData = {};
                        returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                        returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                        returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                        returnData.data = result.data.users; //返回的数据列表
                        $scope.userList = result.data.users;
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
                    { "data": "certificationStatus" },
                    { "data": "verificationStatusStr" },
                    { "data": "registerTime" },
                    { "data": "ip" },
                ],
                "columnDefs": [
                    {
                        "targets": 3,
                        "render": function(data, type, row) {
                            if(data == 0){
                                return "未认证";
                            }else if(data == 1){
                                return "认证中";
                            }else if(data == 2){
                                return "已认证";
                            }else{
                                return "认证失败";
                            }
                        }
                    },{
                        "targets": 5,
                        "render": function(data, type, row) {
                            return $filter('date')(data, 'yyyy-MM-dd HH:mm:ss'); /*HH:mm:ss*/
                        }
                    }
                ]
            })
        }, 100);
        //查询方法
        $scope.isSearch = false;
        $scope.searchFun = function() {
            Services.getData("doFreeFeeUser", {}, function(result) {
                $("#example").dataTable().fnDraw(true);
            });
        };
    }])
});