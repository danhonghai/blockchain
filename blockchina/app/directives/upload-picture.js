define( [ '../app' ] , function ( directives ) {
    directives.directive('uploadPicture' , function (PreviewimgService,TipService,$rootScope) {
        return {
        	restrict: 'EA',
            replace: true,
            scope:false,
            template: 	'<div class="upload-image bg-182B7B border-1D328A">'+
						  '<div class="upload-left float-left">'+
						    '<div class="image-wrap div-block border-1D328A" ng-if="hasImage">'+
						      '<img ng-src="{{dataParams.previewImgObj.previewImgFile}}" width="100%" height="100%" >'+
						    '</div>'+
						    '<div class="image-wrap div-block border-1D328A text-center" ng-if="!hasImage" style="padding-top:30px;">'+
						      '<img ng-src="{{imgSrc}}">'+
						      '<div class="highAuth-title font-1" style="margin-top:16px;" >{{title}}</div>'+
						    '</div>'+
						  '</div>'+
						  '<div class="upload-right float-left">'+
						    '<label class="add-file">'+
						      '<input type="file" onChange="angular.element(this).scope().previewPic(this)">'+
						      '<span class="btn btn-outline-489AFF" >{{lang.lang375}}</span>'+
						    '</label>'+
						    '<div>'+
						      '<button class="btn btn-outline-3d4862 font-3" ng-click="remove()" >{{lang.lang62}}</button>'+
						    '</div>'+
						  '</div>'+
						  '<div class="upload-novice float-left">'+
						  	'<div class="novice1 font-1">{{lang.lang468}}</div>'+
						  	'<div class="novice2 font-2">{{lang.lang469}}</div>'+
						  	'<div class="novice2 font-2">{{lang.lang470}}</div>'+
						  	'<div class="novice2 font-2">{{lang.lang471}}</div>'+
						  '</div>'+
						'</div>',
            link : function ($scope , element, attrs ) {
            	$scope.title = attrs.attrtitle;
            	$scope.imgSrc = attrs.imgsrc;
				$scope.previewPic = function(event){
					var file = event.files[0];
					//格式必须为 JPG（JPEG），BMP，PNG，GIF，TIFF 之一
					if(!event.files[0] || event.files[0].type.indexOf("image") == -1) {
				      return;
				    }
				    var imgTypeArray = ['JPG','JPEG','BMP','PNG','GIF','TIFF'];
				    var imgType = event.files[0].type.split('/')[1].toUpperCase();
				    if(imgTypeArray.indexOf(imgType) == -1){
				    	//TipService.setMessage("图片格式不符合要求", 'danger');
				    	return;
				    }
				    PreviewimgService.readAsDataUrl(event.files[0]).then(function(result) {
				      var size = event.files[0].size/1024/1024;
				      if(size > 5){
				      	TipService.setMessage($rootScope.lang.lang376, 'error');
				      	$scope.$apply(); //传播Model的变化。
				      	event.value = "";//解决同一张图片二次上传，不触发onChange
				        return false;
				      }


					  // 缩放图片需要的canvas
					  var canvas = document.createElement('canvas');
					  var context = canvas.getContext('2d');
				      var img = new Image();
				      img.src  = result;
				      console.log(img);
				      img.onload = function () {
				      	// 图片原始尺寸
					    var originWidth = this.width;
					    var originHeight = this.height;
					    // 最大尺寸限制
					    var maxWidth = 1500, maxHeight = 2000;
					    // 目标尺寸
					    var targetWidth = originWidth, targetHeight = originHeight;
					    // 图片尺寸超过400x400的限制
					    if (originWidth > maxWidth || originHeight > maxHeight) {
					        if (originWidth / originHeight > maxWidth / maxHeight) {
					            // 更宽，按照宽度限定尺寸
					            targetWidth = maxWidth;
					            targetHeight = Math.round(maxWidth * (originHeight / originWidth));
					        } else {
					            targetHeight = maxHeight;
					            targetWidth = Math.round(maxHeight * (originWidth / originHeight));
					        }
					    }
					        
					    // canvas对图片进行缩放
					    canvas.width = targetWidth;
					    canvas.height = targetHeight;
					    // 清除画布
					    context.clearRect(0, 0, targetWidth, targetHeight);
					    // 图片压缩
					    context.drawImage(img, 0, 0, targetWidth, targetHeight);
					    var dataUrl = canvas.toDataURL(file.type || 'image/png');

					    $scope.dataParams.previewImgObj = {
					        previewImgFile : dataUrl,
					        fileName : event.files[0].name
					    }
					    console.log(result);
					    $scope.hasImage = true;
						event.value = "";
					    $scope.$apply(); //传播Model的变化。
					  };
				      
				    })
				}

				$scope.remove = function() {
				    $scope.dataParams.previewImgObj = "";
				    $scope.hasImage = false;
				}
            }
        }
    } );
} );
