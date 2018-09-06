define([
    '../../app',
    '../../directives/ckeditor'
], function(controllers) {
    controllers
        // 后台用户
        .controller('BackuserControl', ['$scope', '$rootScope', '$state', '$interval', '$timeout', 'Services', '$compile', '$filter', function($scope, $rootScope, $state, $interval, $timeout, Services, $compile, $filter) {
            $scope.params = {};
            $scope.table = $('#example').DataTable({
                ajax: function(data, callback, settings) {
                    var params = $scope.isSearch ? $scope.params : {};
                    params.pageSize = data.length;
                    params.pageNumber = (data.start / data.length) + 1;
                    Services.getData("admin_user_list", params, function(result) {
                        var returnData = {};
                        returnData.draw = data.draw;
                        returnData.recordsTotal = result.data.totalElements;
                        returnData.recordsFiltered = result.data.totalElements;
                        returnData.data = result.data.userList;
                        $scope.roleList = result.data.roleList;
                        callback(returnData);
                    })
                },
                columns: [
                    { "data": "userName" },
                    { "data": "mobile" },
                    { "data": "status" },
                    { "data": "roles" },
                    { "data": "realName" },
                    { "data": "updatedTime" },
                    { "data": "lastVisitTime" },
                    { "data": "lastLoginIp" },
                    { "data": "id" }
                ],
                "columnDefs": [{
                        "targets": 5,
                        "render": function(data, type, row) {
                            if (data) {
                                return '<span>' + $filter('date')(data, 'yyyy-MM-dd HH:mm') + '</span>';
                            }
                            return ''
                        }
                    },
                    {
                        "targets": 6,
                        "render": function(data, type, row) {
                            if (data) {
                                return '<span>' + $filter('date')(data, 'yyyy-MM-dd HH:mm') + '</span>';
                            }
                            return ''
                        }
                    },
                    {
                        "targets": 8,
                        "render": function(data, type, row) {
                            return '<button class="btn btn-rounded btn-primary" style="padding:2px 10px;margin-right:10px;" ng-click="changeFun(' + data + ')">修改</button>' +
                                '<button class="btn btn-rounded btn-info" style="padding:2px 10px;" ng-click="resetPwd(' + data + ')">重置密码</button>';
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }
                    }
                ]
            })
            // 增加管理员
            $scope.changeFun = function(id) {
                $scope.adminParams = {
                    status: 0,
                    mobile: "",
                    email: ""
                };
                $scope.role = [];
                if (id) {
                    Services.getData("get_admin_user", { id: id }, function(data) {
                        $scope.adminParams = {
                            id: data.data.adminUser.id,
                            userName: data.data.adminUser.userName,
                            realName: data.data.adminUser.realName,
                            mobile: data.data.adminUser.mobile,
                            email: data.data.adminUser.email,
                            /*  password: data.data.adminUser.password,*/
                            status: data.data.adminUser.status,
                        };
                        var roles = data.data.adminUser.roles.split(',');
                        $scope.role = $scope.roleList.map(function(item) {
                            return item.roleName;
                        })
                        for (i = 0, len = $scope.role.length; i < len; i++) {
                            if ($.inArray($scope.role[i], roles) == -1) {
                                $scope.role[i] = "";
                            }
                        }
                        console.log($scope.role);
                        $('.add-admin-modal').modal('show');
                    })
                } else {
                    $('.add-admin-modal').modal('show');
                }
            }
            //新增或者修改提交接口
            $scope.saveAdmin = function() {
                var role = [],
                    url = "";
                for (var i = 0; i < $scope.role.length; i++) {
                    if ($scope.role[i]) {
                        role.push($scope.role[i]);
                    }
                }
                $scope.adminParams.roles = role.join();
                if (!$scope.adminParams.roles) {
                    Services.alertshow("请选择角色权限", 1000);
                    return false;
                }
                if ($scope.adminParams.id) {
                    url = "admin_user_update";
                    Services.getData(url, $scope.adminParams, function(data) {
                        Services.alertshow("操作成功", 1000);
                        $('.add-admin-modal').modal('hide');
                        $("#example").dataTable().fnDraw(true);
                    })
                } else {
                    url = "admin_user_add";
                    Services.getData("admin_user_verify", { userName: $scope.adminParams.userName }, function(data) {
                        if (data.success) {
                            Services.getData(url, $scope.adminParams, function(data) {
                                Services.alertshow("操作成功", 1000);
                                $('.add-admin-modal').modal('hide');
                                $("#example").dataTable().fnDraw(true);
                            })
                        } else {
                            Services.alertshow(data.msg, 1000);
                        }
                    })
                }
            }
            //重置密码
            $scope.resetPwd = function(id) {
                Services.getData("reset_password", { userId: id }, function(data) {
                    Services.alertshow("重置成功", 1000);
                })
            }
        }])
        // 参数设置
        .controller('PreferencesControl', ['$scope', '$rootScope', '$state', '$stateParams', '$interval', '$timeout', 'Services', '$filter', '$compile', function($scope, $rootScope, $state, $stateParams, $interval, $timeout, Services, $filter, $compile) {
            $scope.menuIds = '';
            $scope.statusArr = ['启用', '停用']; //状态数组
            //表1
            $scope.table = $('#example').DataTable({
                ajax: function(data, callback, settings) {
                    var params = { category: 1 };
                    params.pageSize = data.length;
                    params.pageNumber = (data.start / data.length) + 1;
                    Services.getData("list", params, function(result) {
                        var returnData = {};
                        returnData.draw = data.draw;
                        returnData.recordsTotal = result.data.totalElements;
                        returnData.recordsFiltered = result.data.totalElements;
                        returnData.data = result.data.baseSets;
                        callback(returnData);
                    })
                },
                columns: [
                    { "data": "name" },
                    { "data": "value" },
                    { "data": "status" },
                    { "data": "id" },
                ],
                "columnDefs": [{
                    "targets": 1,
                    "render": function(data, type, row) {
                        return '<td>' + row.value + '%</td>'
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }, {
                    "targets": 2,
                    "render": function(data, type, row) {
                        if (data == 0) {
                            return "停用";
                        } else {
                            return "启用";
                        }
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }, {
                    "targets": 3,
                    "render": function(data, type, row) {
                        return '<a class="aHover" ng-click="addCoinsss(' + data + ',' + 1 + ')">' + '设置' + '</a>'
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }]
            });
            //表2
            $scope.tables = $('#examples').DataTable({
                ajax: function(data, callback, settings) {
                    var paramss = { category: 2 };
                    paramss.pageSize = data.length;
                    paramss.pageNumber = (data.start / data.length) + 1;
                    Services.getData("list", paramss, function(result) {
                        var returnData = {};
                        returnData.draw = data.draw;
                        returnData.recordsTotal = result.data.totalElements;
                        returnData.recordsFiltered = result.data.totalElements;
                        returnData.data = result.data.baseSets;
                        callback(returnData);
                    })
                },
                columns: [
                    { "data": "name" },
                    { "data": "value" },
                    { "data": "value1" },
                    { "data": "status" },
                    { "data": "id" },
                ],
                "columnDefs": [{
                    "targets": 1,
                    "render": function(data, type, row) {
                        return '<td>' + row.value + '%</td>'
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }, {
                    "targets": 2,
                    "render": function(data, type, row) {
                        if (row.value1 == 0) {
                            return "永久"
                        } else {
                            return row.value1 + "天";
                        }
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }, {
                    "targets": 3,
                    "render": function(data, type, row) {
                        if (data == 0) {
                            return "停用";
                        } else {
                            return "启用";
                        }
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }, {
                    "targets": 4,
                    "render": function(data, type, row) {
                        return '<a class="aHover" ng-click="addCoinsss(' + data + ',' + 2 + ')">' + '设置' + '</a>'
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }]
            });

            //新增(编辑)弹出框 提币
            $scope.addCoin = function() {
                $('.add_coin').modal('show');
                $scope.coinParams = {}
            }
            //添加提币提交
            $scope.viewDit = function() {
                $scope.men = {
                    name: $scope.coinParams.name,
                    value: $scope.coinParams.value,
                    category: 1,
                    remark: $scope.coinParams.remark ? $scope.coinParams.remark : ''
                };
                Services.getData("addBaseSet", $scope.men, function(result) {
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
            //新增(编辑)弹出框 交易
            $scope.addCoins = function() {
                $('.add_coins').modal('show');
                $scope.coinParams = {}
            }
            //添加提币提交
            $scope.viewDits = function() {
                $scope.men = {
                    name: $scope.coinParams.name,
                    value: $scope.coinParams.value,
                    value1: $scope.coinParams.value1 ? $scope.coinParams.value1 : '0',
                    category: 2,
                    remark: $scope.coinParams.remark ? $scope.coinParams.remark : ''
                };
                Services.getData("addBaseSet", $scope.men, function(result) {
                    if (result.code == 0000) {
                        $("#examples").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add_coins').modal('hide');
                    } else {
                        $("#examples").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add_coins').modal('hide')
                    }
                })
            }
            //设置弹出框
            $scope.addCoinsss = function(id, category) {
                $scope.category = category;
                Services.getData("findById", { id: id }, function(data) {
                    $scope.borrowInfo = data.data.pageBaseSet;
                    $('.add_coinsss').modal('show');
                });
            }
            //修改按钮
            $scope.update = function(data) {
                $('.add_coinsss').modal('hide');
                $scope.ram = {
                    id: $scope.borrowInfo.id,
                    value: $scope.borrowInfo.value,
                    value1: $scope.borrowInfo.value1 ? $scope.borrowInfo.value1 : '',
                    status: $scope.borrowInfo.status,
                    remark: $scope.borrowInfo.remark ? $scope.borrowInfo.remark : ''
                };
                Services.getData("updateBaseSet", $scope.ram, function(result) {
                    if (result.code == 0000) {
                        Services.alertshow(result.msg, 1000);
                        $("#example").dataTable().fnDraw(true);
                        $("#examples").dataTable().fnDraw(true);
                        $("#exampless").dataTable().fnDraw(true);
                    } else {
                        Services.alertshow(result.msg, 1000);
                        $("#example").dataTable().fnDraw(true);
                        $("#examples").dataTable().fnDraw(true);
                        $("#exampless").dataTable().fnDraw(true);

                    }
                });
            }
        }])
        //钱包管理
        .controller('DailycashControl', ['$location', '$scope', '$state', '$interval', '$timeout', 'Services', '$timeout', '$compile', '$filter', '$rootScope', function($location, $scope, $state, $interval, $timeout, Services, $timeout, $compile, $filter, $rootScope) {
            $scope.statusArr = ['启用', '停用', '修改']; //状态数组
            $scope.dataArr = [];
            $scope.xgArr = [];
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    //lengthMenu:[2],
                    ajax: function(data, callback, settings) {
                        var params = {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("platform_account/allAccount", params, function(result) {
                            angular.forEach(result.data.list, function(d) {
                                d.statusss = $scope.statusArr[d.status]
                            })
                            $scope.dataArr = angular.copy(result.data.list)
                            $scope.xgArr = angular.copy(result.data.list)
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.list; //返回的数据列表
                            $scope.dataes = result.data.url;
                            $scope.zNosort = result.data.list;
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕

                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [ 
                        { "data": "coinType" },
                        { "data": "coinAccount" },
                        { "data": "coinKey" },
                        { "data": "coinBalance" },
                        { "data": "coinAvailable" },
                        { "data": "coinFreeze" },
                        { "data": "isUnified" },
                        { "data": "status" },
                        { "data": "id" }],
                    "columnDefs": [{
                        "targets": 6,
                        "render": function(data, type, row) {
                               if(data == 0){
                                    return "普通账户";
                               } else if(data == 1){
                                    return "归拢账户"
                               }else{
                                    return "矿工手续费账户";
                               }

                            }
                        }, {
                        "targets": 7,
                        "render": function(data, type, row) {
                               if(data == 1){
                                    return "启用";
                               }else{
                                    return "禁用";
                               }

                            }
                        }, {
                        "targets": 8,
                        "render": function(data, type, row) {
                            var buttons = '';
                            if (row.status == 0) {
                                buttons += '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ',' + row.id + ')">启用</button>';
                            } else {
                                buttons += '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ',' + row.id + ')">停用</button>'
                            }
                            if(row.isUnified == 1 || row.isUnified == 2){
                                buttons += '<a class="btn btn-rounded btn-primary" ng-click="xgDitail(' + data + ')" style="padding:2px 10px; margin-right:10px;">修改</a>';
                            }
                            return buttons;
                        },
                        fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                            $compile(nTd)($scope);
                        }

                    }]
                })
            }, 100);

            //添加钱包弹出框
            $scope.viewDitails = function(data) {
                $('.add-admin-modal').modal('show');
                $scope.zNosort = {isUnified:0};
            };
            //查询所有币种
            Services.getData("fund/coinList", {}, function(data) {
                $scope.coinList = data.data.coinList;
            });
            // 添加钱包提交地址  
            $scope.addition = function() {
                Services.getData("platform_account/createAccount", $scope.zNosort, function(data) {
                    $('.add-admin-modal').modal('hide');
                    Services.alertshow(data.msg, 2000)
                    $("#example").dataTable().fnDraw(true);
                })
            }
            //启用停用
            $scope.viewDitail = function(bid) {
                var a = $scope.dataArr.filter(function(d) {
                    return d.id == bid;
                })[0];
                Services.getData("platform_account/onOrOffAccount", { id: bid, status: a.status == 1 ? '0' : '1' }, function(data) {
                    $("#example").dataTable().fnDraw(true);
                });
            }
            //修改弹出框
            $scope.xgDitail = function(id) {
                $('.add-admin-modals').modal('show');
                Services.getData("platform_account/oneAccount", { id: id }, function(result) {
                    $scope.zNns = result.data.account;
                })
            };
            //修改钱包地址
            $scope.update = function() {
                var token = "";
                if (sessionStorage.token) {
                    var token = sessionStorage.token;
                }
                var men = {
                    id: $scope.zNns.id,
                    coinAccount: $scope.zNns.coinAccount,
                    coinKey: $scope.zNns.coinKey,
                    account: $scope.zNns.account,
                };
                Services.getData("platform_account/updateAccount", men, function(result) {
                    if (result.code == 0000) {
                        $('.add-admin-modals').modal('hide');
                        Services.alertshow(result.msg, 2000)
                        $("#example").dataTable().fnDraw(true);
                        $scope.zNns.coinAccount = "";
                        $scope.zNns.coinKey = "";
                    } else {
                        Services.alertshow(result.msg, 1000);
                        $("#example").dataTable().fnDraw(true);
                        $('.add-admin-modals').modal('hide');
                        $scope.zNns.coinAccount = "";
                        $scope.zNns.coinKey = "";
                    }
                })
            }

        }])
        //角色管理
        .controller('RolelistControl', ['$location', '$scope', '$state', '$interval', '$timeout', 'Services', '$timeout', '$compile', '$filter', function($location, $scope, $state, $interval, $timeout, Services, $timeout, $compile, $filter) {
            $scope.params = {};
            $scope.menuIds = '';
            $scope.statusArr = ['停用', '启用', '修改']; //状态数组
            $scope.table = $('#example').DataTable({
                ajax: function(data, callback, settings) {
                    var params = $scope.isSearch ? $scope.params : {};
                    params.pageSize = data.length;
                    params.pageNumber = (data.start / data.length) + 1;
                    Services.getData("role/role_list", params, function(result) {
                        angular.forEach(result.data.roleList, function(d) {
                            d.statusss = $scope.statusArr[d.status]
                        })
                        var returnData = {};
                        returnData.draw = data.draw;
                        returnData.recordsTotal = result.data.totalElements;
                        returnData.recordsFiltered = result.data.totalElements;
                        returnData.data = result.data.roleList;
                        callback(returnData);
                    })
                },
                columns: [
                    { "data": "roleNameCn" },
                    { "data": "roleName" },
                    { "data": "description" },
                    { "data": "createTime" },
                    { "data": "status" },
                    { "data": "status" }
                ],
                "columnDefs": [{
                    "targets": 3,
                    "render": function(data, type, row) {
                        var statusStr = "";
                        return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }, {
                    "targets": 4,
                    "render": function(data, type, row) {
                        if (data == 0) {
                            return "停用";
                        } else {
                            return "启用";
                        }
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }, {
                    "targets": 5,
                    "render": function(data, type, row) {
                        var buttons = '';
                        if (row.status == 0) {
                            buttons += '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="EnableDitail(' + data + ',' + row.id + ')">启用</button>';
                        } else {
                            buttons += '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;" ng-click="EnableDitail(' + data + ',' + row.id + ')">停用</button>'
                        }
                        return buttons += '<a class="btn btn-rounded btn-primary"  ng-click="update(' + row.id + ')" style="padding:2px 10px; margin-right:10px;">修改</a>'
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }]
            });

            //启用停用标类型
            $scope.EnableDitail = function(status, bid) {
                Services.getData("role/role_status_update", { roleId: bid, status: status == 1 ? '0' : '1' }, function(data) {
                    $("#example").dataTable().fnDraw(true);
                });
            }
            //修改按钮
            $scope.update = function(d) {
                $state.go('logged.setRoleAuthority', { id: d })
            }
        }])
        //角色增加
        .controller('PetskillbonusControl', ['$location', '$http', '$scope', '$state', '$interval', '$timeout', 'Services', '$compile', '$filter', '$stateParams', function($location, $http, $scope, $state, $interval, $timeout, Services, $compile, $filter, $stateParams) {
            $scope.article = {};
            //树形菜单
            var zTreeObj;
            Services.getData("role/get_menu_list", {}, function(data) {
                var zNodes = data.data.treeMenus;
                var setting = {
                    check: {
                        enable: true, //设置 zTree 的节点上是否显示 checkbox / radio
                        chkStyle: 'checkbox', //勾选框类型(checkbox 或 radio）
                    },
                    callback: {
                        onCheck: function(e, treeId, treeNode) { //checked事件
                            $scope.menuIds = '';
                            var _nodes = zTreeObj.getCheckedNodes(true);
                            if (_nodes.length > 0) {
                                angular.forEach(_nodes, function(d) {
                                    $scope.menuIds += d.id + ',';
                                })
                            }
                        }
                    }
                };
                zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            })

            //添加角色
            $scope.viewDitail = function(bid) {
                var boParams = {
                    description: $scope.article.description,
                    menuIds: $scope.menuIds,
                    roleName: $scope.article.roleName,
                    roleNameCn: $scope.article.roleNameCn,
                    status: 0
                }
                if (!$scope.menuIds) {
                    Services.alertshow('请选择角色权限', 1000);
                    return false;
                }
                Services.getData("role/role_add", boParams, function(data) {
                    if (data.code == 0000) {
                        Services.alertshow(data.msg, 2000);
                        $state.go('logged.rolelist');
                    } else {
                        Services.alertshow(data.msg, 2000)
                    }

                })
            }

        }])
        //角色修改
        .controller('SetRoleAuthorityControl', ['$location', '$http', '$scope', '$state', '$interval', '$timeout', 'Services', '$compile', '$filter', '$stateParams', function($location, $http, $scope, $state, $interval, $timeout, Services, $compile, $filter, $stateParams) {
            $scope.article = {};
            var zTreeObj;
            //树形菜单
            Services.getData("role/get_menu_list", {}, function(data) {
                var zNodes = data.data.treeMenus;
                angular.forEach(zNodes, function(d) {
                    d.chkDisabled = false;
                })
                console.log(zNodes)
                var setting = {
                    check: {
                        enable: true, //设置 zTree 的节点上是否显示 checkbox / radio
                        chkStyle: 'checkbox', //勾选框类型(checkbox 或 radio）
                    },
                    callback: {
                        onCheck: function(e, treeId, treeNode) { //checked事件
                            console.log(e, treeId, treeNode)
                            $scope.menuIds = '';
                            var _nodes = zTreeObj.getCheckedNodes(true);
                            if (_nodes.length > 0) {
                                angular.forEach(_nodes, function(d) {
                                    $scope.menuIds += d.id + ',';
                                })
                            }
                        }
                    }
                };
                zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);

                Services.getData("role/role_edit_in", { ruleId: $stateParams.id }, function(data) {
                    if (data.code == 0000) {
                        $scope.article = data.data.role;
                        $scope.rosonly = data.data;
                        $scope.menuIds = data.data.ids;
                        console.log($scope.rosonly)
                        var _ids = $scope.rosonly.ids.split(',');
                        console.log(_ids)
                        console.log(zTreeObj)
                        angular.forEach(_ids, function(d, i) {
                            zTreeObj.checkNode(zTreeObj.getNodeByParam('id', _ids[i]), true)
                        })
                    }
                }, function(error) {
                    console.log(error)
                })
            })
            //修改角色
            $scope.viewDitail = function(bid) {
                if (!$scope.menuIds) {
                    Services.alertshow('请选择角色权限', 1000);
                    return false;
                }
                var borrowParams = {
                    description: $scope.article.description,
                    id: $scope.article.id,
                    menuIds: $scope.menuIds,
                    roleName: $scope.article.roleName,
                    roleNameCn: $scope.article.roleNameCn,
                    status: $scope.article.status
                }
                Services.getData("role/role_edit", borrowParams, function(data) {
                    if (data.code == 0000) {
                        Services.alertshow(data.msg, 2000);
                        $state.go('logged.rolelist');

                    } else {
                        Services.alertshow(data.msg, 2000)
                    }

                })
            }

        }])
        //菜单管理
        .controller('MenuManagerControl', ['$location', '$scope', '$state', '$interval', '$timeout', 'Services', '$timeout', '$compile', '$filter', function($location, $scope, $state, $interval, $timeout, Services, $timeout, $compile, $filter) {
            $scope.params = {};
            $scope.men = {};
            $scope.artick = {};
            $scope.statusArr = ['停用', '启用', '修改', '删除']; //状态数组
            $scope.dataArr = [];
            //初始化model
            $scope.condition = {
                name: '',
                parentName: '',
                data: '',
                orderNum: '',
                menuLevel: '',
                status: ''
            }
            $scope.zNodes = angular.copy($scope.condition);
            //菜单列表
            $scope.table = $('#example').DataTable({
                ajax: function(data, callback, settings) {
                    var params = $scope.isSearch ? $scope.condition : {};
                    params.pageSize = data.length;
                    params.pageNumber = (data.start / data.length) + 1;
                    Services.getData("menu/menu_list", params, function(result) {
                        angular.forEach(result.data.menuList, function(d) {
                            d.statusss = $scope.statusArr[d.status]
                        })
                        $scope.dataArr = angular.copy(result.data.menuList)
                        var returnData = {};
                        returnData.draw = data.draw;
                        returnData.recordsTotal = result.data.totalElements;
                        returnData.recordsFiltered = result.data.totalElements;
                        returnData.data = result.data.menuList;
                        /*  $scope.arti = result.data.menuList.status;*/
                        callback(returnData);
                    })
                },
                columns: [{ "data": "name" }, { "data": "parentName" },   { "data": "data" }, { "data": "orderNum" }, { "data": "menuLevel" }, { "data": "status" }, { "data": "status" }],
                "columnDefs": [{
                    "targets": 5,
                    "render": function(data, type, row) {
                        if (data == 0) {
                            return "停用";
                        } else {
                            return "启用";
                        }
                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }, {
                    "targets": 6,
                    "render": function(data, type, row) {
                        var buttons = '';
                        if (row.status == 0) {
                            buttons += '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="EnableDitail(' + data + ',' + row.id + ')">启用</button>';
                        } else {
                            buttons += '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;" ng-click="EnableDitail(' + data + ',' + row.id + ')">停用</button>'
                        }
                        return buttons += '<a class="btn btn-rounded btn-primary" ng-click="upDil(' + row.id + ')" style="padding:2px 10px; margin-right:10px;">修改</a>' + '<button class="btn btn-rounded  btn-danger" style="padding:2px 10px;margin-right:10px;" ng-click="deletDit(' + row.id + ')"> 删除</button>';


                    },
                    fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                        $compile(nTd)($scope);
                    }
                }]
            });
            //查询方法
            $scope.isSearch = false;
            $scope.searchFun = function(flag) {
                if (flag == 0) { //查询
                    $scope.isSearch = true;
                } else { //重置
                    $scope.isSearch = false;
                    $scope.condition = {
                        data: '',
                        description: '',
                        menuName: '',
                        orderNum: '',
                        parentName: '',
                        icon: '',
                        status: ''
                    }
                }
                angular.copy($scope.condition, $scope.exportParams);
                $("#example").dataTable().fnDraw(true);
            };
            //添加菜单弹出框
            $scope.viewDitail = function(data) {
                $('.view-detail').modal('show');
            };
            //添加树形菜单
            $scope.showMenu = function() {
                var zTreeObj;
                Services.getData("menu/menu_add_in", {}, function(data) {
                    var zNodes = data.data.treeMenus;
                    angular.forEach(zNodes, function(d) {
                        d.chkDisabled = false;
                    })
                    var setting = {
                        callback: {
                            onClick: function(e, treeId, treeNode) { //checked事件
                                $scope.menuIds = '';
                                var _nodes = zTreeObj.getCheckedNodes(true);
                                $scope.$apply(function() {
                                    /* $scope.menss.parent = treeNode.name*/
                                    $scope.zNodes.parent = treeNode.name
                                    $scope.parenTID = treeNode.id
                                })
                                $scope.menuIds = treeNode.id;
                            }
                        }
                    };
                    zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                })
            }
            //添加菜单
            $scope.viewDit = function() {
                $('.view-detail').modal('hide');
                $scope.men = {
                    data: $scope.zNodes.data,
                    description: $scope.zNodes.description,
                    icon: $scope.zNodes.icon,
                    name: $scope.zNodes.name,
                    orderNum: $scope.zNodes.orderNum,
                    parent: $scope.parenTID,
                    status: $scope.zNodes.status
                };
                Services.getData("menu/menu_add", $scope.men, function(result) {
                    if (result.code == 0000) {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.view-detail').modal('hide');
                        $scope.zNodes = angular.copy($scope.condition);
                        $scope.men.name = "";
                        $scope.men.data = "";
                        $scope.men.description = "";
                        $scope.men.orderNum = "";
                        $scope.men.parent = "";
                        $scope.men.icon = "";
                        $scope.men.status = ""
                    } else {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.view-detail').modal('hide')
                        $scope.zNodes = angular.copy($scope.condition);
                        $scope.men.name = "";
                        $scope.men.data = "";
                        $scope.men.description = "";
                        $scope.men.orderNum = "";
                        $scope.men.parent = "";
                        $scope.men.icon = "";
                        $scope.men.status = ""
                    }
                }, function() {
                    $scope.zNodes = angular.copy($scope.condition);
                })
            }
            //取消按钮添加
            $scope.viewDel = function(data) {
                $('.view-detail').modal('hide');
                $scope.zNodes.name = "";
                $scope.zNodes.data = "";
                $scope.zNodes.description = "";
                $scope.zNodes.orderNum = "";
                $scope.zNodes.parent = "";
                $scope.zNodes.icon = "";
                $scope.zNodes.status = ""
            };
            //树形菜单显示隐藏
            $scope.isShowTree = false;
            $("#boxs").on('click', function() {
                $scope.$apply(function() {
                    $scope.isShowTree = false;
                })
            })
            /*图标模拟下拉框*/
            $(function() {
                //模拟下拉框
                $('.select input').on('click', function() {
                    if ($('.select .city').is('.hide')) {
                        $('.select .city').removeClass('hide');
                    } else {
                        $('.select .city').addClass('hide');
                    }
                })
                $('.select ul li').on('click', function() {
                    var ul = document.getElementById('parent');
                    var lis = ul.getElementsByTagName('li');
                    $scope.zNodes.icon = $(this).find('i').data('name');
                    $('.select .city').addClass('hide');
                    $('.select input').css('border-bottom', '1px solid $d6d6d6');
                })
                $('.select ul li').hover(
                    function() {
                        $(this).css({ 'backgroundColor': '#fd9', 'font-size': '18px' });
                    },
                    function() {
                        $(this).css({ 'backgroundColor': '#f9f9f9', 'font-size': '14px' });
                    }
                )
            })
            //启用停用标类型
            $scope.EnableDitail = function(status, bid) {
                Services.getData("menu/menu_status_update", { menuId: bid, status: status == 1 ? '0' : '1' }, function(data) {
                    $("#example").dataTable().fnDraw(true);
                });
            }
            //删除菜单弹出框
            $scope.deletDit = function(bid) {
                $('.info-modal').modal('show');
                $scope.data = bid;
            }
            //删除菜单接口
            $scope.deletqdDit = function(data) {
                Services.getData("menu/menu_delete", { menuIds: $scope.data }, function(data) {
                    if (data.code == 0000) {
                        Services.alertshow(data.msg, 1000);
                        $("#example").dataTable().fnDraw(true);
                        $('.info-modal').modal('hide');
                        $scope.data = "";
                    } else {
                        Services.alertshow(data.msg, 1000);
                        $("#example").dataTable().fnDraw(true);
                        $('.info-modal').modal('hide');
                    }

                })
            }
            //取消按钮删除
            $scope.viewDte = function(data) {
                $('.info-modal').modal('hide');
            };
            //修改菜单弹出框
            $scope.upDil = function(bid) {
                $scope.update = bid;
                Services.getData("menu/menu_edit_in", { menuId: $scope.update }, function(data) {
                    $('.viewes-detail').modal('show');
                    $scope.zNodes = data.data.menu;
                    $scope.parenTID = $scope.zNodes.parent;
                    $scope.showMenues($scope.zNodes.parent)
                })
            };
            //树形菜单显示隐藏修改
            $scope.isShowTree = false;
            $("#boxws").on('click', function() {
                $scope.$apply(function() {
                    $scope.isShowTree = false;
                })
            })
            //修改树形菜单
            $scope.showMenues = function(id) {
                var zTreeObj;
                Services.getData("menu/menu_add_in", {}, function(data) {
                    var zNodes = data.data.treeMenus;
                    angular.forEach(zNodes, function(d) {
                        d.chkDisabled = false;
                    })
                    if (id) {
                        var a = [];
                        a = zNodes.filter(function(i, k) {
                            return i.id == id;

                        });
                        /*          console.log(zNodes)*/
                        if (a.length > 0) {
                            $scope.zNodes.parent = a[0].name
                        } else {
                            zNodes.forEach(function(i, k) {
                                /*         console.log(i)*/
                                if (i.children) {
                                    i.children.forEach(function(ii) {
                                        if (ii.id == '122') {
                                            /*                                            console.log(111111111111111111111111)*/
                                        }
                                        if (ii.id == id) {
                                            $scope.zNodes.parent = ii.name
                                        }
                                    })
                                }
                            })
                            /*                      console.log($scope.zNodes.parent)*/
                            // $scope.zNodes.parent = zNodes.filter(function(i, k) {
                            //     return i.id == id;
                            // })[0].name;
                        }

                        $scope.isShowTree = false;
                    }
                    /*           console.log(zNodes)*/
                    var setting = {
                        callback: {
                            onClick: function(e, treeId, treeNode) { //checked事件
                                $scope.$apply(function() {
                                    $scope.zNodes.parent = treeNode.name;
                                    /*  console.log($scope.zNodes.parent)*/
                                    $scope.parenTID = treeNode.id
                                })
                            }
                        }
                    };
                    zTreeObj = $.fn.zTree.init($("#treesDemo"), setting, zNodes);
                })
            }
            //修改菜单
            $scope.amendDit = function(id) {
                $('.viewes-detail').modal('hide');
                var artick = {
                    data: $scope.zNodes.data,
                    description: $scope.zNodes.description,
                    icon: $scope.zNodes.icon,
                    name: $scope.zNodes.name,
                    orderNum: $scope.zNodes.orderNum,
                    parent: $scope.parenTID,
                    status: $scope.zNodes.status,
                    id: $scope.zNodes.id,
                    menuLevel: $scope.zNodes.menuLevel,
                };
                Services.getData("menu/menu_edit", artick, function(result) {
                    if (result.code == 0000) {
                        Services.alertshow(result.msg, 1000);
                        $("#example").dataTable().fnDraw(true);
                    } else {
                        Services.alertshow(result.msg, 1000);
                        $("#example").dataTable().fnDraw(true);

                    }
                })
            }
            //取消按钮修改
            $scope.viewDelte = function(data) {
                $('.viewes-detail').modal('hide');
                $scope.zNodes.name = "";
                $scope.zNodes.data = "";
                $scope.zNodes.description = "";
                $scope.zNodes.orderNum = "";
                $scope.zNodes.parent = "";
                $scope.zNodes.icon = "";
                $scope.zNodes.status = ""
            };
        }])
        //前台管理
        .controller('ReceptionistControl', ['$location', '$scope', '$state', '$interval', '$timeout', 'Services', '$timeout', '$compile', '$filter', '$rootScope', function($location, $scope, $state, $interval, $timeout, Services, $timeout, $compile, $filter, $rootScope) {
            $scope.statusArr = ['停用', '启用', '修改', '排序', '删除']; //状态数组
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("view", params, function(result) {
                            angular.forEach(result.data.banners, function(d) {
                                d.statusss = $scope.statusArr[d.status]
                            })
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.banners; //返回的数据列表
                            $scope.dataes = result.data.url;
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [ { "data": "title" }, { "data": "type" }, { "data": "linkUrl" }, { "data": "statusss" }, { "data": "orders" }, { "data": "id" }],
                    "columnDefs": [{
                            "targets": 1,
                            "render": function(data, type, row) {
                                var s = '';
                                if (data == 0) {
                                    s = 'pc'
                                } else if (data == 1) {
                                    s = '微信端'
                                } else if (data == 2) {
                                    s = '移动端'
                                }
                                return s
                            }
                        },
                        {
                            "targets": 3,
                            "render": function(data, type, row) {
                                var statusStr = '';
                                return statusStr += '<td>' + data + '</td>';
                            }
                        },
                        {
                            "targets": 5,
                            "render": function(data, type, row) {
                                var buttons = '';
                                if (row.status == 0) {
                                    buttons += '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="EnableDitail(' + data + ',' + row.status + ')">启用</button>';
                                } else {
                                    buttons += '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;" ng-click="EnableDitail(' + data + ',' + row.status + ')">停用</button>'
                                }
                                return buttons += '<a class="btn btn-rounded btn-primary" ng-click="viewDil(' + data + ')" style="padding:2px 10px; margin-right:10px;">修改</a>' + '<button class="btn btn-rounded  btn-success" style="padding:2px 10px;margin-right:10px;" ng-click="sort(' + data + ')"> 排序</button>' + '<button class="btn btn-rounded  btn-danger" style="padding:2px 10px;margin-right:10px;" ng-click="deletDit(' + data + ')"> 删除</button>';

                            },
                            fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                $compile(nTd)($scope);
                            }

                        }
                    ]
                })
            }, 100);
            //删除弹出框
            $scope.deletDit = function(data) {
                $('.info-modal').modal('show');
                $scope.data = data;
            }
            // 删除轮播图提交方法
            $scope.deleteFun = function(data) {
                Services.getData("delete", { id: $scope.data }, function(data) {
                    Services.alertshow(data.msg, 2000)
                    $("#example").dataTable().fnDraw(true);
                    $('.info-modal').modal('hide');
                    $scope.data = "";

                })
            }
            // 弹出提交按钮
            $scope.changeFun = function() {
                /* $scope.condition = { linkUrl: '' };*/
                //初始化上传组件，解决回显文件后，关闭弹窗，再次打开数据没有初始化
                $('.imgFileWrap').empty().append('<input name="pFile" type="file" class="file imgFile" >');
                $scope.condition = { type: 0, language: 0 };
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
                    $scope.condition.bannerFile = files[0];
                }).on('fileselectnone', function(event) {
                    $scope.condition.bannerFile = "";
                });
                $('.add-admin-modal').modal('show');
            }
            //添加轮播图
            $scope.viewDit = function() {
                if (!$scope.condition.bannerFile) {
                    Services.alertshow("请选择轮播图");
                    return false;
                }
                var formFile = new FormData();
                formFile.append("title", $scope.condition.title);
                formFile.append("linkUrl", $scope.condition.linkUrl);
                formFile.append("type", $scope.condition.type);
                formFile.append("language", $scope.condition.language);
                formFile.append("bannerFile", $scope.condition.bannerFile); //加入文件对象
                Services.ajaxData("addBanner", formFile, function(result) {
                    if (result.code == 0000) {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add-admin-modal').modal('hide');
                    } else {
                        $("#example").dataTable().fnDraw(true);
                        Services.alertshow(result.msg, 2000);
                        $('.add-admin-modal').modal('hide')
                    }
                })
            }
            //修改轮播图弹出框
            $scope.viewDil = function(id) {
                $scope.coinParams = {};
                //初始化上传组件，解决回显文件后，关闭弹窗，再次打开数据没有初始化
                $('.imgFileWrap').empty().append('<input name="pFile" type="file" class="file imgFile" >');
                Services.getData("bannerDetail", { id: id }, function(data) {
                    $scope.coinParams = data.data.banner;
                    $scope.coinParams.id;
                    $scope.coinParams.title;
                    $scope.coinParams.linkUrl;
                    $scope.coinParams.language;
                    var tradeImg = data.data.banner.imgUrl; //历史图片显示 v
                    $scope.coinParams.bannerFile = 1; //判断提交时用户是否重选了图片
                    //单个文件上传
                    $('.imgFile').fileinput({ //营业执照
                        language: 'zh', //设置语言
                        showUpload: false, //是否显示上传按钮
                        showRemove: false,
                        allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
                        showClose: false, //是否显示关闭按钮
                        dropZoneEnabled: false,
                        maxFileSize: 20480, //单位为KB，如果为0表示不限制文件大小
                        initialPreview: [tradeImg], //历史图片显示
                        initialPreviewAsData: true, //历史图片显示
                        autoReplace: true,
                        hiddenThumbnailContent: true,
                    }).on("filebatchselected", function(event, files) {
                        $scope.coinParams.bannerFile = files[0];
                    }).on('fileselectnone', function(event) {
                        $scope.coinParams.bannerFile = "";
                    });
                    $('.add-admin-modals').modal('show');
                })

            };
            //修改轮播图提交接口
            $scope.amendDit = function() {
                if (!$scope.coinParams.bannerFile) {
                    Services.alertshow("请选择轮播图");
                    return false;
                }
                var formFiles = new FormData();
                formFiles.append("id", $scope.coinParams.id);
                formFiles.append("title", $scope.coinParams.title);
                formFiles.append("type", $scope.coinParams.type);
                formFiles.append("linkUrl", $scope.coinParams.linkUrl);
                formFiles.append("language", $scope.coinParams.language);
                if ($scope.coinParams.bannerFile != 1) {
                    formFiles.append("bannerFile", $scope.coinParams.bannerFile); //加入文件对象
                }
                Services.ajaxData("fixBanner", formFiles, function(result) {
                    if (result.code == 0000) {
                        Services.alertshow(result.msg, 200);
                        $("#example").dataTable().fnDraw(true);
                    } else {
                        Services.alertshow(result.msg, 200);
                        $("#example").dataTable().fnDraw(true);
                    }
                    $('.add-admin-modals').modal('hide');
                })
            }
            //启用停用标类型
            $scope.EnableDitail = function(bid, status) {
                Services.getData("fixStatus", { id: bid, opt: status == 1 ? 'start' : 'stop' }, function(data) {
                    $("#example").dataTable().fnDraw(true);
                });
            }
            //轮播图排序弹出框
            $scope.sort = function(id) {
                Services.getData("bannerDetail", { id: id }, function(data) {
                    $('.add-admin-modalss').modal('show');
                    $scope.zNosort = data.data.banner;
                })
            }
            //轮播图排序提交
            $scope.sorts = function() {
                $('.add-admin-modalss').modal('hide');
                var token = "";
                if (sessionStorage.token) {
                    var token = sessionStorage.token;
                }
                var artick = {
                    id: $scope.zNosort.id,
                    order: $scope.zNosort.orders,
                };
                Services.getData("sort", artick, function(result) {
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
        //公告管理
        .controller('AnnouncementsControl', ['$location', '$scope', '$state', '$interval', '$timeout', 'Services', '$timeout', '$compile', '$filter', '$rootScope', function($location, $scope, $state, $interval, $timeout, Services, $timeout, $compile, $filter, $rootScope) {
            $scope.statusArr = ['下架', '上架', '删除', '编辑']; //状态数组
            $timeout(function() {
                $scope.table = $('#example').DataTable({
                    ajax: function(data, callback, settings) {
                        var params = {};
                        params.pageSize = data.length; //页面显示记录条数，在页面显示每页显示多少项的时候
                        params.pageNumber = (data.start / data.length) + 1; //当前页码
                        Services.getData("findAllArticle", params, function(result) {
                            angular.forEach(result.data.articles.content, function(d) {
                                d.statusss = $scope.statusArr[d.status]
                            })
                            //封装返回数据
                            var returnData = {};
                            returnData.draw = data.draw; //这里直接自行返回了draw计数器,应该由后台返回
                            returnData.recordsTotal = result.data.articles.totalElements; //返回数据全部记录
                            returnData.recordsFiltered = result.data.articles.totalElements; //后台不实现过滤功能，每次查询均视作全部结果
                            returnData.data = result.data.articles.content; //返回的数据列表
                            //调用DataTables提供的callback方法，代表数据已封装完成并传回DataTables进行渲染
                            //此时的数据需确保正确无误，异常判断应在执行此回调前自行处理完毕
                            callback(returnData);
                        });
                    },
                    //列表表头字段
                    columns: [ { "data": "title" }, { "data": "status" }, { "data": "createdTime" }, { "data": "status" }],
                    "columnDefs": [{
                            "targets": 1,
                            "render": function(data, type, row) {
                                if (data == 0) {
                                    return "下架";
                                } else {
                                    return "上架";
                                }
                            },
                            fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                $compile(nTd)($scope);
                            }
                        }, {
                            "targets": 2,
                            "render": function(data, type, row) {
                                var statusStr = '';
                                return statusStr += '<td>' + $filter('date')(data, 'yyyy-MM-dd HH:mm:ss') + '</td>';
                            }
                        },
                        {
                            "targets": 3,
                            "render": function(data, type, row) {
                                var buttons = '';
                                if (row.status == 0) {
                                    buttons += '<button class="btn btn-rounded btn-info" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ',' + row.id + ')">上架</button>';
                                } else {
                                    buttons += '<button class="btn btn-rounded btn-danger" style="padding:2px 10px;margin-right: 10px;" ng-click="viewDitail(' + data + ',' + row.id + ')">下架</button>'
                                }
                                return buttons += '<a class="btn btn-rounded btn-primary" ng-click="update(' + row.id + ')" style="padding:2px 10px; margin-right:10px;">编辑</a>' + '<button class="btn btn-rounded  btn-danger" style="padding:2px 10px;margin-right:10px;" ng-click="deletDit(' + row.id + ')"> 删除</button>';
                            },
                            fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
                                $compile(nTd)($scope);
                            }
                        }
                    ]
                })

                // 点击跳转
                $scope.clickFun = function(data) {
                    $state.go('logged.publishArticle', { id: data })
                }
                //删除弹出框
                $scope.deletDit = function(data) {
                    $('.info-modal').modal('show');
                    $scope.data = data;
                }
                // 删除公告
                $scope.deleteFun = function(data) {
                    Services.getData("deleteArticle", { id: $scope.data }, function(data) {
                        Services.alertshow(data.msg, 2000)
                        $("#example").dataTable().fnDraw(true);
                        $('.info-modal').modal('hide');
                        $scope.data = "";

                    })
                }
                //上架下架
                $scope.viewDitail = function(status, bid) {
                    Services.getData("updownArticle", { id: bid, status: status == 1 ? '0' : '1' }, function(data) {
                        $("#example").dataTable().fnDraw(true);
                    });
                }
                //修改按钮
                $scope.update = function(d) {
                    $state.go('logged.publishArticle', { id: d })
                }

            }, 100);

        }])
        //公告编辑/公告发布
        .controller('PublishArticleControl', ['$location', '$scope', '$state', '$interval', '$timeout', 'Services', '$timeout', '$compile', '$filter', '$rootScope', '$stateParams', function($location, $scope, $state, $interval, $timeout, Services, $timeout, $compile, $filter, $rootScope, $stateParams) {
            $scope.article = {};
            var token = "";
            if (sessionStorage.token) {
                var token = sessionStorage.token;
            };
            if ($stateParams.id) {
                Services.getData("findArticleById", { id: $stateParams.id }, function(data) {
                    if (data.code == "0000") {
                        $scope.article = data.data.article;
                        $scope.article.articleFile = data.data.article.litpic;
                        $scope.articleSite = data.data.articleSite;
                        $scope.sites = data.data.sites;
                        var getsta2 = true;
                        if ($scope.article.status == 0) {
                            var getsta2 = false;
                        } else {
                            var getsta2 = true;
                        }
                        $("[name='status']").bootstrapSwitch({
                            state: getsta2,
                            onSwitchChange: function(event, state) {
                                if (state == true) {
                                    $scope.article.status = 1;
                                } else {
                                    $scope.article.status = 0;
                                }
                            }
                        });
                    }
                })
            } else {
                // 默认单选选中
                $scope.article.status = 0;
                $scope.article.language = 0;
                $scope.article.type = 1;
                $("[name='status']").bootstrapSwitch({
                    state: true,
                    onSwitchChange: function(event, state) {
                        if (state == true) {
                            $scope.article.status = 1;
                        } else {
                            $scope.article.status = 0;
                        }
                    }
                });
            }
            // 发布 修改完按钮
            $scope.publishFun = function() {
                if ($stateParams.id) {
                    $scope.article.id = $stateParams.id;
                    Services.getData("updateArticle", $scope.article, function(data) {
                        Services.alertshow("操作成功");
                        $state.go('logged.announcements')

                    })
                } else {
                    Services.getData("createArticle", $scope.article, function(data) {
                        Services.alertshow("操作成功");
                        $state.go('logged.announcements')
                    })
                }
            }
            // 点击返回上一页
            $scope.goBackFun = function() {
                $('.modal-backdrop').hide();
                window.history.back();
            }

        }])


});