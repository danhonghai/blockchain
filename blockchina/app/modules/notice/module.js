define(['../../app'], function(controllers) {
    controllers.controller('NoticelistController', ['$scope', '$rootScope', 'Services', '$state', 'utilsService', '$stateParams', function($scope, $rootScope, Services, $state, utilsService, $stateParams) {
        var noticedata = {
            language: 0,
            pageNumber: 1,
            pageSize: 9999,
            type: 1
        }
        if ($rootScope.language == 1) {
            noticedata.language = 0;
        }else{
            noticedata.language = 1;
        }
        //获取公告数据
        Services.getData("publish", noticedata, function(noticedata) {
            $scope.noticelists = noticedata.body.article;
        })

        $scope.linknotice = function(id){
            Services.consoleserice("debug信息", id);
            $state.go ("logged.noticedetail",{id:id});
        }
    }])
    .controller('NoticedetailController', ['$scope', '$rootScope', 'Services', '$state', 'utilsService', '$stateParams', function($scope, $rootScope, Services, $state, utilsService, $stateParams) {
        var noticedata = {
            language: 0,
            pageNumber: 0,
            pageSize: 0,
            type: 1
        }
        if ($rootScope.language == 1) {
            noticedata.language = 0;
        }else{
            noticedata.language = 1;
        }
        noticedata.id = $stateParams.id;
        //获取公告详情
        Services.getData("detail", noticedata, function(data) {
            Services.consoleserice("debug信息", data)
            $scope.noticedetail = data.body.article;
        })

    }]);
});