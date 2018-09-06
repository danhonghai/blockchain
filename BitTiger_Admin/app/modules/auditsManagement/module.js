define([
    '../../app',
    '../../directives/ckeditor'
], function(controllers) {
    controllers
        //认证列表
        .controller('CertificationlistController', ['$scope', '$rootScope', '$state', '$interval', '$timeout', 'Services', '$compile', '$filter', function($scope, $rootScope, $state, $interval, $timeout, Services, $compile, $filter) {
            $scope.params = {};
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    //lengthMenu:[2],
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("audit/identification", params, function(result) {
                            console.log(result)
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements;
                            returnData.recordsFiltered = result.data.totalElements;
                            returnData.data = result.data.identificationList; //返回的数据列表
                            $scope.urllink = result.data.pathUrl;
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段logged.foregroundUser
                    columns: [{ "data": "id" }, { "data": "name" }, { "data": "country" }, { "data": "idType" }, { "data": "idCard" }, { "data": "frontImg" }, { "data": "backImg" }, { "data": "handImg" }, { "data": "status" }, { "data": "createTime" }, { "data": "updateTime" }, { "data": "remark" }, { "data": "id" }],
                    "columnDefs": [{
                        "targets": 3,
                        "render": function(data, type, row) {
                            if (row.idType == 1) {
                                return "身份证";
                            } else {
                                return "护照";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 5,
                        "render": function(data, type, row) {
                            return '<img class="min" style="width: 100px;cursor: pointer;" ng-mouseover="enlarger($event)"  ng-mouseleave="enlargers()" src="' + $scope.urllink + data + '">'
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 6,
                        "render": function(data, type, row) {
                            return '<img  class="min" style="width: 100px;cursor: pointer;" ng-mouseover="enlarger($event)"  ng-mouseleave="enlargers()" src="' + $scope.urllink + data + '">'
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 7,
                        "render": function(data, type, row) {
                            return '<img  class="min" style="width: 100px;cursor: pointer;" ng-mouseover="enlarger($event)"  ng-mouseleave="enlargers()" src="' + $scope.urllink + data + '">'
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            if (row.status == 1) {
                                return "审核中";
                            } else if (row.status == 2) {
                                return "审核成功";
                            } else {
                                return "审核失败";
                            } /*data-toggle="modal" data-target=".img-dialog" data-imgsrc="' + $scope.urllink + data + '"  src="' + $scope.urllink + data + '"*/
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 9,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            if (row.createTime == null) {
                                return "--";
                            } else {
                                return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 10,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            if (row.updateTime == null) {
                                return "--";
                            } else {
                                return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 12,
                        "render": function(data, type, row) {
                            if (row.status == 1) {
                                return '<td>' + '<a style="color: #1fb5ad;cursor:pointer" ng-click="abortive(' + data + ')">' + '审核' + '</a>' + '<td>';
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
            //审核弹框
            $scope.abortive = function(id) {
                Services.getData("audit/validate", { id: id }, function(data) {
                    $scope.idd = id;
                    $('.abortive-dialog').modal('show');
                })


            }
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
            //审核提交
            $scope.verify = function() {
                $scope.men = {
                    id: $scope.idd,
                    status: $scope.adminParams.status ? $scope.adminParams.status : 2,
                    remark: $scope.adminParams.remark ? $scope.adminParams.remark : ''
                };
                Services.getData("audit/auditIdentification", $scope.men, function(data) {
                    if (data.code == 0000) {
                        Services.alertshow(data.msg, 2000);
                        $('.add-admin-modal').modal('hide');
                        $("#example").dataTable().fnDraw(true);
                    } else {

                        Services.alertshow(data.msg, 2000);
                        $('.add-admin-modal').modal('hide');
                        $("#example").dataTable().fnDraw(true);
                    }
                    $('.abortive-dialog').modal('hide');
                })
            }

            //图片点击放大
            $scope.enlarger = function(e) {
                var Srccs = e.currentTarget.currentSrc;
                $('.picturelook').find('.mins').attr("src", Srccs);
                $('.picturelook').show();
            }
            $scope.enlargers = function() {
                $('.picturelook').hide();
            }




        }])
        // 申诉列表
        .controller('ComplaintlistController', ['$scope', '$rootScope', '$state', '$stateParams', '$interval', '$timeout', 'Services', '$compile', '$filter', function($scope, $rootScope, $state, $stateParams, $interval, $timeout, Services, $compile, $filter) {
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = $scope.isSearch ? $scope.params : {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("audit/appeal", params, function(result) {
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements;
                            returnData.recordsFiltered = result.data.totalElements;
                            returnData.data = result.data.fiatAppeal; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            $scope.urllinks = result.data.imageUrl;
                            callback(returnData);
                        });
                    },
                    //列表表头字段logged.foregroundUser
                    columns: [{ "data": "orderNo" }, { "data": "fiatAppealPassword" }, { "data": "sourceName" }, { "data": "sourceRole" }, { "data": "targetName" }, { "data": "targetRole" }, { "data": "mode" }, { "data": "content" }, { "data": "status" }, { "data": "result" }, { "data": "appealImg" }, { "data": "auditRemark" }, { "data": "createTime" }, { "data": "updateTime" }, { "data": "status" }],
                    "columnDefs": [{
                        "targets": 6,
                        "render": function(data, type, row) {
                            if (row.mode == 1) {
                                return "对方未付款";
                            } else if (row.mode == 2) {
                                return "对方未放行";
                            } else if (row.mode == 3) {
                                return "对方无应答";
                            } else if (row.mode == 4) {
                                return "对方有欺诈行为";
                            } else {
                                return "其他";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            if (row.status == 0) {
                                return "申诉中";
                            } else if (row.status == 1) {
                                return "已取消";
                            } else if (row.status == 3) {
                                return "申诉失败";
                            } else {
                                return "申诉成功";
                            }
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 10,
                        "render": function(data, type, row) {
                            return '<img style="width: 100px;" src="' + $scope.urllinks + data + '">'
                        }
                    }, {
                        "targets": 12,
                        "render": function(data, type, row) {
                            var statusStr = "";
                            return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
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
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }, {
                        "targets": 14,
                        "render": function(data, type, row) {
                            if (row.status == 0) {
                                return '<td>' + '<a style="color: #1fb5ad;cursor:pointer" ng-click="abortive(' + row.id + ')">' + '审核' + '</a>' + '<td>';
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
            //审核弹框
            $scope.abortive = function(id) {
                $scope.idd = id;
                $('.abortive-dialog').modal('show');
                Services.getData("audit/result", { id: $scope.idd, status: 2 }, function(result) {
                    $scope.userdetail = result.data;
                })
                //初始化上传组件，解决回显文件后，关闭弹窗，再次打开数据没有初始化
                $('.imgFileWrap').empty().append('<input name="pFile" type="file" class="file imgFile" >');
                $scope.adminParams = {
                    status: 2
                };
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
                    hiddenThumbnailContent: true,
                }).on("filebatchselected", function(event, files) {
                    $scope.adminParams.bannerFile = files[0];
                }).on('fileselectnone', function(event) {
                    $scope.adminParams.bannerFile = "";
                });
            }
            //审核提交
            $scope.verify = function(id) {
                var formFile = new FormData();
                formFile.append("id", $scope.idd);
                formFile.append("status", $scope.adminParams.status);
                formFile.append("remark", $scope.adminParams.remark);
                formFile.append("file", $scope.adminParams.bannerFile);
                Services.ajaxData("audit/auditAppeal", formFile, function(result) {
                    if (result.code == 0000) {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add-admin-modal').modal('hide');
                    } else {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add-admin-modal').modal('hide')
                    }
                    $('.abortive-dialog').modal('hide');

                })
            }
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
            //radio点击改变事件
            $scope.radioChecked = function() {
                $scope.menm = {
                    id: $scope.idd,
                    status: $scope.adminParams.status ? $scope.adminParams.status : 2
                };
                Services.getData("audit/result", $scope.menm, function(result) {
                    $scope.userdetail = result.data;
                })
            }

        }]);
});