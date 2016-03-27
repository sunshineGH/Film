var app = angular.module('filmApp',['ngRoute']);
app.config(function($routeProvider) {
	$routeProvider
		.when('/',{
			controller:'filmSelectController',
			templateUrl:'home.html'
		})
		.when('/filmDetail/:id',{
			controller:'filmDetailDisplayController',
			templateUrl:'filmDetail.html'
		});
});

app.controller('filmSelectController',function($scope,$http){
	//设置浮动框
	$scope.isDetailShow = false;
	$scope.mouseenter = function(id,$index) {
		$scope.isDetailShow = true;
		$scope.top = 247*(parseInt($index / 4));
		$scope.left = 140 + 140*($index % 4);
		$scope.classes = [];
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getFilm',id:id}
			}).success(function(data){
				console.log('success');
				$scope.film = data.result[0];
				$scope.classes = data.result[0].category.split(',');
			}).error(function(){
				console.log('error!');				
		});
	};
	$scope.mouseleave = function(id) {
		$scope.isDetailShow = false;
	}
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getCategoryList'}
		}).success(function(data){
			console.log('success');
			$scope.categorys = data.result;
		}).error(function(){
			console.log('error!');				
	});
	$scope.selectedRow = 0;
	$scope.selectCategory = function(id,$index){
		$scope.selectedRow = $index;
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getFilmList',category:id}
			}).success(function(data){
				console.log('success');
				$scope.films = data.result.films;
				console.log(data.result);
			}).error(function(){
				console.log('error!');				
		});
	};
	
	//电影图片展示
	$http({
		url:'http://localhost:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getFilmList'}
		}).success(function(data){
			console.log(data.result.films);
			$scope.films = data.result.films;
		}).error(function(){
			
		});
	
	$scope.listFilmSorted = function() {
		console.log($scope.sortName);
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getFilmList',order:$scope.sortName}
			}).success(function(data){
				console.log(data.result.films);
				$scope.films = data.result.films;
			}).error(function(){
				
			});
	};
	
	//得到影评
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getGoodFilm'}
		}).success(function(data){
			console.log(data.result);
			$scope.comments = data.result;
		}).error(function(){
			
		});
	
	//获得评论数位于前十的电影，本周口碑榜
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getFilmList',order:'comment'}
		}).success(function(data){
			console.log(data.result);
			$scope.filmsByComment = data.result.films;
		}).error(function(){
			
		});
});

app.controller('filmDetailDisplayController',function($http,$routeParams,$scope) {
	id = $routeParams.id;
	$scope.classes = [];
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getFilm',id:id}
		}).success(function(data){
			console.log("结果");
			console.log(data.result[0]);
			$scope.film = data.result[0];
			$scope.classes = data.result[0].category.split(',');
		}).error(function(){
			
		});
	//得到电影的全部评论
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getCommentList',filmid:id}
		}).success(function(data){
			console.log(data.result.comments);
			$scope.filmComments = data.result.comments;
		}).error(function(){
			
		});
});

