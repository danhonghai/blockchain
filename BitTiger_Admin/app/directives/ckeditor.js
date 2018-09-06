define( [ '../app' ] , function ( directives ) {
    directives.directive( 'ckeditor' , function () {
        return {
	        require : '?ngModel',
	        link : function(scope, element, attrs, ngModel) {

	            var ckeditor = CKEDITOR.replace(element[0], {
	            });

	            if (!ngModel) {
	                return;
	            }

	            ckeditor.on('instanceReady', function() {
	                ckeditor.setData(ngModel.$viewValue);
	            });

	            ckeditor.on('pasteState', function() {
	            	//angular+ckeditor最后上传的最后一张图片不会被添加（bug）
	            	$('.cke_wysiwyg_frame').focus();
	                scope.$apply(function() {
	                    ngModel.$setViewValue(ckeditor.getData());
	                });
	            });
	            ngModel.$render = function(value) {
	                ckeditor.setData(ngModel.$viewValue);
	            };
	        }
	    };
    } );
} );
