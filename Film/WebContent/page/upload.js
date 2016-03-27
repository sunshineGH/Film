var app = angular.module('myApp',[]);

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, ngModel) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(event){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
                //附件预览
                scope.file = (event.srcElement || event.target).files[0];
                scope.getFile();
            });
        }
    };
}]);


app.controller('UploaderController', function($scope,$http,fileReader){
    $scope.getFile = function () {
        fileReader.readAsDataUrl($scope.file, $scope)
          	.then(function(result) {
              	$scope.imageSrc = result;
          	});
    };
    // 组装表单数据
    var postData = {
        fileName: $scope.myFile,
    };

  //  var promise = postMultipart('http://localhost:8080/Film/InfoCl?method=addFilm', postData); 

    function postMultipart() {
    	var url = "http://localhost:8080/Film/InfoCl?method=addFilm";
    	var data = postData
        var fd = new FormData();
        angular.forEach(data, function(val, key) {
            fd.append(key, val);
        });
        var args = {
            method: 'POST',
            url: url,
            data: fd,
            dataType:"jsonp",
            headers: {'Content-Type': undefined},
/*            transformRequest: angular.identity*/
        };
        return $http(args);
    }
    $scope.postMultipart1 = function() {
	    $http({
			url:'http://localhost:8080/Film/UploadPic',
			dataType:"jsonp",
			method:'POST',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'addFilm',fileName: $scope.myFile,name:$scope.name}
		}).success(function(data){
			console.log("success!");
			//console.log(data.users);
			//console.log($scope.workers);
		}).error(function(){
			console.log("error!");
		});
	};
});


app.factory('fileReader', ["$q", "$log", function($q, $log){
	var onLoad = function(reader, deferred, scope) {
	    return function () {
	        scope.$apply(function () {
	            deferred.resolve(reader.result);
	        });
	    };
	};
 
    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };
 
    var getReader = function(deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        return reader;
    };
 
    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);         
        reader.readAsDataURL(file);
        return deferred.promise;
    };
 
    return {
        readAsDataUrl: readAsDataURL  
    };
}])