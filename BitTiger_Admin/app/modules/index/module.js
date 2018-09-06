define( [
    '../../app' ,
    'echarts'
] , function ( controllers,echarts ) {
    controllers
    .controller( 'IndexController' , ['$scope', 'Services' , function ( $scope, Services ) { 
        Services.getData("platform_data", {}, function(data) {
           $scope.platformData = data.data.platformData;
        });
    }]);
} );

