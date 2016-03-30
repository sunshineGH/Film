angular.module('filmApp.services',[]).
	factory('UserService',function($http) {
	var current_user;
	
	return {
		getCurrentUser:function() {
			return current_user ;
		},
		setCurrentUser:function(user) {
			current_user = user;
		},
		clearCurrentUser:function() {
			current_user = null;
		}
	}
}).factory('logoutService',function($cookieStore,$location) {
	return {
		logout:function() {
			if($cookieStore.get('userid')!=null) {
				$cookieStore.remove('userid');
				$location.path('/login');
				/*layer.confirm('确定退出吗？',{
					btn:['确定','取消']
				},function() {
					$cookieStore.remove('userid');
					layer.msg("跳转至登录界面");
					$location.path('/login');
				},function() {
					console.log("退出失败");
				});	*/
			}else{
				layer.alert("请先登录");
			}
		}
	}
});
var app = angular.module('filmApp',['ngRoute','ngCookies','filmApp.services']);
app.config(function($routeProvider) {
	$routeProvider
		.when('/',{
			controller:'filmSelectController',
			templateUrl:'home.html',
			allowAnonymous:true
		})
		.when('/filmDetail/:id',{
			controller:'filmDetailDisplayController',
			templateUrl:'filmDetail.html',
			allowAnonymous:true
		})
		.when('/login',{
			controller:'loginController',
			templateUrl:'login.html',
			allowAnonymous:true
		})
		.when('/register',{
			controller:'registerController',
			templateUrl:'register.html',
			allowAnonymous:true
		})
		.when('/addComment/:id',{
			controller:'commentController',
			templateUrl:'comment.html',
			allowAnonymous:false
		})
		.when('/commnetReply/:id',{
			controller:'replyController',
			templateUrl:'commentReply.html',
			allowAnonymous:false
		})
		.when('/allCommnetReply/:id',{
			controller:'replyController',
			templateUrl:'allCommentReply.html',
			allowAnonymous:true
		})
		.when('/userInfo',{
			controller:'userInfoController',
			templateUrl:'userInfo.html'
		})
		.when('/changePsw',{
			controller:'userChangePswController',
			templateUrl:'changePsw.html'
		})
		.when('/changePhone',{
			controller:'userChangePhoneController',
			templateUrl:'changePhone.html'
		})
		.when('/pay',{
			controller:'payController',
			templateUrl:'pay.html',
			allowAnonymous:false
		});
});


app.run(function($location,$rootScope,$log,$route,$cookieStore) {
	function onRouteChangeStart(event,next,current) {
		if(!next.allowAnonymous && !$cookieStore.get('userid')) {
			$log.log('Authentication required,redirect to login.');
			var returnUrl = $location.url();
			$log.log('return url is' + returnUrl);
			
			event.preventDefault();
			$location.path('/login').search({returnUrl:returnUrl});
		}
	}
	
	$rootScope.$on('$routeChangeStart',onRouteChangeStart);
});

app.controller('loginController',function($scope,$http,$routeParams,$location,$rootScope,$cookieStore,UserService) {
	if($routeParams.returnUrl!=null) {
		console.log($routeParams.returnUrl);
	}
	$scope.login = function(user) {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'login',id:user.id,password:user.password,isadmin:0}
			}).success(function(data){
				console.log('success');
				if(data.result == 0) {
					alert("查无此人");
				}else if(data.result == 2) {
					alert("密码错误");
				}else {
					$cookieStore.put('userid',user.id);
					$rootScope.currentUser = user;
					console.log($rootScope.currentUser);
					UserService.setCurrentUser(user.id);
					if($routeParams.returnUrl!=null) {
						$location.path($routeParams.returnUrl);
						console.log($routeParams.returnUrl);
						console.log($location.path());
					}else {
						$location.path('/');
					}
				}
			}).error(function(){
				console.log('error!');				
		});
	}
});
app.controller('registerController',function($scope,$http,$location){
	$scope.errorHide = function() {
		$scope.isShow = false;
	}
	$scope.isSaveUser = function(id) {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'isSaveUser',id:id}
			}).success(function(data){
				if(!data.result) {
					$scope.isShow = true;
				}
			}).error(function() {
				
			});
	};
	$scope.register = function(user) {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'addUser',id:user.id,password:user.psw,name:user.name,sex:user.sex,phone:user.phone}
			}).success(function(data){
				console.log('success');
				layer.alert("注册成功，跳转至首页",{icon:6});
				$location.path('/');
				/*layer.confirm('马上登陆吗？',{
					btn:['确定','取消']
				},function() {
					$location.path('/login');
					console.log("redirect to login");
				},function() {
					$location.path('/');
				});*/
			}).error(function(){
				console.log('error!');				
		});
	};
});
app.controller('filmSelectController',function($scope,$http,$rootScope,$cookieStore,$location,logoutService){
	/*console.log("服务中的用户名是" + UserService.getCurrentUser());*/
	if($cookieStore.get('userid')!=null) {
		$scope.isLoginShow = false;
		$scope.userid = $cookieStore.get('userid');
		console.log($cookieStore.get('userid'));
		console.log($scope.userid);
	}else {
		$scope.isLoginShow = true;
	}
	
	var mySwiper = new Swiper('.swiper-container',{
		direction:'horizontal',
		loop:true,
		pagination:'.swiper-pagination',
		paginationClickable:true,
		watchSlidesProgess:true,
		watchSlidesVisibility:true,
		autoplay:3000
	});
	var mySwiper2 = new Swiper('.swiper-container2',{
		loop:false,
		slidesPerView: 4,
		spaceBetween: 5,
		prevButton:'.swiper-button-prev',
		nextButton:'.swiper-button-next',
		autoplay:5000
	});

	console.log($rootScope.currentUser);
	console.log($scope.isShowMenu);
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
	
	//退出登录
	$scope.logout = function() {
		/*if($cookieStore.get('userid')!=null) {
			layer.confirm('确定退出吗？',{
				btn:['确定','取消']
			},function() {
				$cookieStore.remove('userid');
				layer.msg("跳转至登录界面");
				$location.path('/login');
			},function() {
				console.log("退出失败");
			});	
		}else{
			layer.alert("请先登录");
		}*/
		logoutService.logout();
	};
});

app.controller('filmDetailDisplayController',function($http,$routeParams,$scope,$rootScope,$cookieStore,logoutService) {
	if($cookieStore.get('userid')!=null) {
		$scope.isLoginShow = false;
		$scope.userid = $cookieStore.get('userid');
		console.log($cookieStore.get('userid'));
		console.log($scope.userid);
	}else {
		$scope.isLoginShow = true;
	}
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
	$scope.logout = function() {
		logoutService.logout();
	};
});

app.controller('commentController',function($http,$scope,$routeParams,$rootScope,$location,$cookieStore,logoutService) {
	if($cookieStore.get('userid')!=null) {
		$scope.isLoginShow = false;
		$scope.userid = $cookieStore.get('userid');
		console.log($cookieStore.get('userid'));
		console.log($scope.userid);
	}else {
		$scope.isLoginShow = true;
	}
	id = $routeParams.id;
	$scope.comment = {
			comment:'',
			grade:''
	};
	$scope.addComment = function(comment) {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'addComment',filmid:id,comment:$scope.comment.comment,grade:$scope.comment.grade,userid:$cookieStore.get('userid')}
			}).success(function(data){
				console.log(data.result);
				if(data.result.result) {	
					if(data.result.isreward==1) {
						layer.alert("恭喜您评论次数已满足，快去领奖吧");
						$location.path('/reward');
					}else {
						layer.alert("评论成功",{icon:6});
						$location.path('/filmDetail/'+id);
					}
				}else {
					layer.alert("提交失败，请稍后重试",{icon:5});
				}
			}).error(function(){
			
			});
	};
	$scope.logout = function() {
		logoutService.logout();
	};
});

app.controller('replyController',function($scope,$http,$location,$routeParams,$rootScope,$cookieStore,logoutService){
	if($cookieStore.get('userid')!=null) {
		$scope.isLoginShow = false;
		$scope.userid = $cookieStore.get('userid');
		console.log($cookieStore.get('userid'));
		console.log($scope.userid);
	}else {
		$scope.isLoginShow = true;
	}
	id = $routeParams.id;
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getCommentById',id:id}
		}).success(function(data){
			$scope.comment = data.result;
		}).error(function(){
		
		});
	$scope.addReply = function(id) {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'addReply',commentid:id,userid:$rootScope.currentUser.id,reply:$scope.comment.reply}
			}).success(function(data){
				if(data.result) {
					layer.alert("回复成功",{icon:6});
				}else {
					layer.alert("回复失败");
				}
			}).error(function(){
			
			});
	};
	
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getReply',commentid:id}
		}).success(function(data){
			$scope.replys = data.result;
		}).error(function(){
		
		});
	
	$scope.logout = function() {
		logoutService.logout();
	};
});

app.controller('userInfoController',function($scope,$http,$rootScope,$cookieStore,logoutService) {
	if($cookieStore.get('userid')!=null) {
		$scope.isLoginShow = false;
		$scope.userid = $cookieStore.get('userid');
		console.log($cookieStore.get('userid'));
		console.log($scope.userid);
	}else {
		$scope.isLoginShow = true;
	}
	id = $rootScope.currentUser.id;
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getUser',id:id}
		}).success(function(data){
			$scope.user = data.result;
			console.log($scope.user);
		}).error(function(){
		
		});
	
	$scope.logout = function() {
		logoutService.logout();
	};
});

app.controller('userChangePswController',function($scope,$http,$rootScope,$location,$cookieStore,logoutService) {
	if($cookieStore.get('userid')!=null) {
		$scope.isLoginShow = false;
		$scope.userid = $cookieStore.get('userid');
		console.log($cookieStore.get('userid'));
		console.log($scope.userid);
	}else {
		$scope.isLoginShow = true;
	}
	id = $rootScope.currentUser.id;
	$scope.user = {
		id:id,
	};
	$scope.checkPsw = function() {
		if($scope.user.oldPsw!=$rootScope.currentUser.password) {
			layer.alert("您输入的密码不正确",{icon:5});
		}
	};
	$scope.checkNewPsw = function() {
		if($scope.user.newPsw != $scope.user.checkPsw) {
			layer.alert("两次输入的新密码不一样",{icon:5});
		}
	};
	$scope.changePsw = function(id) {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'updateUser',id:id,password:$scope.user.newPsw}
			}).success(function(data){
				if(data.result) {
					layer.alert("修改成功！",{icon:6});
					$location.path('/userInfo');
				}else {
					layer.alert("修改失败",{icon:5});
				}
			}).error(function(){
			
			});
	};
	
	$scope.logout = function() {
		logoutService.logout();
	};
});
app.controller('userChangePhoneController',function($http,$scope,$location,$rootScope,$cookieStore,logoutService) {
	if($cookieStore.get('userid')!=null) {
		$scope.isLoginShow = false;
		$scope.userid = $cookieStore.get('userid');
		console.log($cookieStore.get('userid'));
		console.log($scope.userid);
	}else {
		$scope.isLoginShow = true;
	}
	id = $rootScope.currentUser.id;
	$scope.user = {
		id:id,
	};
	$scope.changePhone = function(id) {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'updateUser',id:id,phone:$scope.user.phone}
			}).success(function(data){
				if(data.result) {
					layer.alert("修改成功！",{icon:6});
					$location.path('/userInfo');
				}else {
					layer.alert("修改失败",{icon:5});
				}
			}).error(function(){
			
			});
	};
	
	$scope.logout = function() {
		logoutService.logout();
	};
});

app.controller('payController',function($rootScope,$scope,$cookieStore,logoutService) {
	if($cookieStore.get('userid')!=null) {
		$scope.isLoginShow = false;
		$scope.userid = $cookieStore.get('userid');
		console.log($cookieStore.get('userid'));
		console.log($scope.userid);
	}else {
		$scope.isLoginShow = true;
	}
	$scope.user = {
		id : $rootScope.currentUser.id,
	};
	
	$scope.logout = function() {
		logoutService.logout();
	};
});
	