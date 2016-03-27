var app = angular.module('myApp',['ngRoute','tm.pagination','ngDialog','ngFileUpload','ngCookies']);
app.config(function($routeProvider) {
	$routeProvider
	.when('/',{
		controller:'mainController',
		templateUrl:'pages/home.html'
	})
	.when('/userList',{
		controller:'userController',
		templateUrl:'pages/userList.html'
	})
	.when('/adminList',{
		controller:'userController',
		templateUrl:'pages/userList.html'
	})
	.when('/adminEdit/:id',{
		controller:'userDetailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/userEdit/:id',{
		controller:'userDetailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/addUser',{
		controller:'userDetailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/addAdmin',{
		controller:'userDetailController',
		templateUrl:'pages/userDetail.html'
	})
	.when('/filmList',{
		controller:'filmController',
		templateUrl:'pages/filmList.html'
	})
	.when('/filmDetail/:id',{
		controller:'filmDetailController',
		templateUrl:'pages/addFilmDetail.html'
	})
	.when('/addFilm',{
		controller:'filmDetailController',
		templateUrl:'pages/addFilmDetail.html'
	})
	.when('/commentList/:id', {
		controller:'commentController',
		templateUrl:'pages/commentList.html'
	})
	.when('/replyList/:id',{
		controller:'replyListController',
		templateUrl:'pages/replyList.html'
	})
	.when('/commentReply/:id',{
		controller:'commentReplyController',
		templateUrl:'pages/commentReply.html'
	})
	.when('/categoryList',{
		controller:'categoryController',
		templateUrl:'pages/categoryList.html'
	})
	.when('/addCategory',{
		controller:'categoryController',
		templateUrl:'pages/addCategory.html'
	})
	.when('/information',{
		controller:'informationController',
		templateUrl:'pages/information.html'
	})
	.when('/pswChange',{
		controller:'passwordChangeController',
		templateUrl:'pages/passwordChange.html'
	});
});
app.controller ('mainController',function($scope,$cookieStore,$location){
	//存储到cookie当中
	if($location.search().id!=null) {
		$cookieStore.put('userid',$location.search().id);
	}
	id = $cookieStore.get('userid');
	console.log(id);
});

app.controller('userController',function($scope,$http,$location) {	
	$scope.user = {
		isadmin : 1,
	};
	$scope.addAction = 'addAdmin';
	$scope.userType = 'adminEdit';
	if($location.path()=='/userList') {
		$scope.user.isadmin = 0;
		$scope.addAction = 'addUser';
		$scope.userType = 'userEdit';
	}
	$scope.paginationConf = {
		currentPage:1,
		itemsPerPage:10
	};	
	
	var getUserList = function() {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getUserList',currentpage:$scope.paginationConf.currentPage
			,isadmin:$scope.user.isadmin}
		}).success(function(data){
			console.log("success!");
			$scope.workers = data.result.users;
			console.log($scope.workers);
			$scope.paginationConf.totalItems = data.result.count;
			//console.log(data.users);
			//console.log($scope.workers);
		}).error(function(){
			console.log("error!");
		});
	};
    //getUserList();
    $scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',getUserList);
	$scope.searchName = function() {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getUserList',name:$scope.searchedName,
				currentpage:$scope.paginationConf.currentPage,isadmin:$scope.user.isadmin}
		}).success(function(data){
			console.log("success!");
			$scope.workers = data.result.users;
			$scope.totalItems = data.result.count;
			//console.log(data);
			//console.log($scope.workers);
		}).error(function(){
			console.log("error!");
		});
	};

	$scope.deleteUser = function(worker) {
		console.log($scope.worker);
		layer.confirm('确定删除该记录吗？',{
			btn:['确定','取消']
		},function(){
			$http({
				url:'http://10.103.241.137:8080/Film/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{id:worker.id,method:'deleteUser'}
			}).success(function(data){
				if(data.result){
					layer.alert('已删除',{icon:'6'});		
				}
				getUserList();
			}).error(function(){
				
			});
		},function(){
			layer.msg('已取消',{time:2000});
		});	
	};
	
});	

app.controller('userDetailController',function($scope,$routeParams,$http,$location) {
	$scope.user = {
		isadmin : 1,
		title:"新增",
		isShowPsw:false,
		isShowInput:false,
		isReadOnlyID : false,
	};

	if($location.path()=='/addUser') {
		$scope.user.isadmin = 0;
		$scope.user.isShowPsw = true;
		$scope.user.isShowInput = true;
	}

	$scope.worker = {
		id:$routeParams.id,
	};
	if($routeParams.id!=null){
		$scope.user.title = "修改";
		$scope.user.isReadOnlyID = true;
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{id:$scope.worker.id,method:'getUser'}
		}).success(function(data){
			$scope.worker = data.result;
			if($scope.worker.isadmin=='0') {
				$scope.user.isShowPsw = true;
				$scope.user.isShowInput = true;
			}
 		}).error(function(){
			console.log("error!");
		});
	//更改用户
	$scope.addUser = function() {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{id:$scope.worker.id,name:$scope.worker.name,
				password:$scope.worker.password,
				sex:$scope.worker.sex,isreward:$scope.worker.isreward,
				phone:$scope.worker.phone,
				method:'updateUser',}
			}).success(function(data){
				console.log(data.result);
				if(data.result) {
					layer.alert("修改完成",{icon:6});
				}else {
					layer.alert("提交失败，请稍后重试",{icon:5});
				}
			}).error(function(){
				
			});
		};
	}else {
		$scope.user.isShowPsw = true;
		$scope.user.isReadOnlyID = false;
		$scope.user.title = "增加";
		//添加新用户
		$scope.validateID = function() {
			if(!$scope.userForm.userID.$error) {
				$http({
					url:'http://10.103.241.137:8080/Film/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{id:$scope.worker.id,method:'isSaveUser'}
					}).success(function(data){
						console.log(data.result);
						if(!data.result) {
							$scope.messageID = "工号已被占用，请重新输入";
						}else {
							$scope.messageID = "验证通过";
						}
						//MessageBox("这是一个简单的消息提示框");
					}).error(function(){
						
				});
			}
		};
		$scope.addUser = function() {
			if($scope.userForm.$valid) {
				$http({
					url:'http://10.103.241.137:8080/Film/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{id:$scope.worker.id,name:$scope.worker.name,
						password:$scope.worker.password,
						sex:$scope.worker.sex,isreward:$scope.worker.isreward,
						phone:$scope.worker.phone,isadmin:$scope.user.isadmin,
						method:'addUser'}
					}).success(function(data){
						console.log(data.result);
						//MessageBox("这是一个简单的消息提示框");
						if(!data.result) {
							layer.alert("提交失败，请稍后重试",{icon:5});
						}else {
							layer.alert("提交成功",{icon:6});
						}
					}).error(function(){
						
				});
			}else {
				layer.alert("表单信息填写不正确",{icon:6});
			}
		};
	}
});
app.controller('filmController',function($http,$scope,$location,$routeParams) {
	$scope.paginationConf = {
		currentPage:1,
		itemsPerPage:10
	};	
	var getFilmList = function() {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getFilmList',currentpage:$scope.paginationConf.currentPage}
			}).success(function(data){
				console.log(data.result.films);
				$scope.films = data.result.films;
				$scope.paginationConf.totalItems = data.result.count;
			}).error(function(){
				
			});
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',getFilmList);
	//按类别搜索，得到全部类别
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
	
	$scope.searchFilmCategory = function() {
		console.log($scope.film.bubbleCategory.id);
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getFilmList',category:$scope.film.bubbleCategory.id,currentpage:$scope.paginationConf.currentPage}
			}).success(function(data){
				console.log('success');
				$scope.films = data.result.films;
				$scope.totalItems = data.result.count;
				console.log($scope.totalItems);
			}).error(function(){
				console.log('error!');				
		});
	};
	
	$scope.searchFilmName = function() {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getFilmList',name:$scope.searchedFilmName,
				currentpage:$scope.paginationConf.currentPage}
		}).success(function(data){
			console.log("success!");
			$scope.films = data.result.films;
			$scope.totalItems = data.result.count;
			//console.log(data);
			//console.log($scope.workers);
		}).error(function(){
			console.log("error!");
		});
	};
	
	$scope.deleteFilm = function(film) {
		$http({
			url:'http://localhost:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'deleteFilm',id:film.id}
			}).success(function(data){
				if(!data.result) {
					layer.alert("删除失败",{icon:5});
				}else {
					layer.alert("已删除",{icon:6});
					getFilmList();
				}
			}).error(function(){
				
			});
	};
});
app.controller('filmDetailController',function($scope,$http,$location,$routeParams,Upload,$timeout){
	//得到电影类别
	$http({
		url:'http://localhost:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getCategoryList'}
		}).success(function(data){
			console.log(data.result);
			$scope.categorys = data.result;
		}).error(function(){
			
		});
	if ($routeParams.id!=null) {
		$scope.isReadOnlyInput = true;
		$scope.isShowInput = true;
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getFilm',id:$routeParams.id}
			}).success(function(data){
				console.log(data.result);
				$scope.film = data.result[0];
				console.log($scope.film.category);
				$scope.selected = $scope.film.category.split(',');
			}).error(function(){
				
			});
		//类别多选框
		//$scope.selected = [];   
	    var updateSelected = function(action,name){ 
			if(action == 'add' && $scope.selected.indexOf(name) == -1){ 
			    $scope.selected.push(name); 
			} 
			if(action == 'remove' && $scope.selected.indexOf(name)!=-1){ 
			    var idx = $scope.selected.indexOf(name); 
			    $scope.selected.splice(idx,1); 
			} 
	    }; 
	    $scope.updateSelection = function($event, name){ 
			var checkbox = $event.target; 
			var action = (checkbox.checked?'add':'remove'); 
			updateSelected(action,name); 
	    };	    
	    $scope.isSelected = function(name){ 
			return $scope.selected.indexOf(name)>=0; 
	    }; 
	    console.log($scope.selected);
	    //提交修改
		$scope.addFilm = function() {
			$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'updateFilm',id:$routeParams.id,name:$scope.film.name,
					director:$scope.film.director,category:$scope.selected,
					gradecount:$scope.film.gradecount,hot:$scope.film.hot,
					introduction:$scope.film.introduction,comment:$scope.film.comment,
					price:$scope.film.comment,time:$scope.film.time}
			}).success(function(data){
				console.log(data.result);
				console.log("sucess");
				if(!data.result) {
					layer.alert("提交失败，请稍后重试",{icon:5});
				}else {
					layer.alert("提交成功",{icon:6});
				}
			}).error(function(){
				
			});
		};
	}else{
		//新加电影
		$scope.isShowInput = false;
		//类别多选
		$scope.selected = [];
		$scope.selectedCount = 0;
		var updateSelected = function(action,name){ 
			if(action == 'add' && $scope.selected.indexOf(name) == -1){ 
			    $scope.selected.push(name); 
			    $scope.selectedCount++;
			} 
			if(action == 'remove' && $scope.selected.indexOf(name)!=-1){ 
			    var idx = $scope.selected.indexOf(name); 
			    $scope.selected.splice(idx,1); 
			    $scope.selectedCount--;
			} 
	    }; 
	    $scope.updateSelection = function($event, name){ 
			var checkbox = $event.target; 
			var action = (checkbox.checked?'add':'remove'); 
			updateSelected(action,name); 
	    };	    
	    $scope.isSelected = function(name){ 
			return $scope.selected.indexOf(name)>=0; 
	    }; 
	    console.log($scope.selected);
		//提交添加
		$scope.addFilm = function(file) {
			/*console.log($scope.selected);
			console.log($scope.selectedCount);*/
		    file.upload = Upload.upload({
		      /*url: 'https://angular-file-upload-cors-srv.appspot.com/upload',*/
		      url: 'http://localhost:8080/Film/UploadPic',
		      data: {name:$scope.film.name,
					director:$scope.film.director,category:$scope.selected,
					categorycount:$scope.selectedCount,
					hot:$scope.film.hot,
					introduction:$scope.film.introduction,
					price:$scope.film.price,time:$scope.film.time,file:file},
		    });

		    file.upload.then(function (response) {
		      $timeout(function () {
		    	  $scope.result = response.data.result;
		    	  if(!$scope.result) {
		    	  	  layer.alert("该电影已存在，请更改信息后重新提交",{icon:5});
		    	  }else {
		    	  	  layer.alert("提交成功",{icon:6});
		    	  }
		      });
		    }, function (response) {
		      if (response.status > 0)
		        $scope.errorMsg = response.status + ': ' + response.data;
		    }, function (evt) {
		      // Math.min is to fix IE which reports 200% sometimes
		      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
		    });
	    }
	}
});
app.controller('commentController',function($scope,$http,$location,$routeParams){
	$scope.film = {
		id : $routeParams.id,
	};
	$scope.paginationConf = {
		currentPage:1,
		itemsPerPage:10
	};	
	var getCommentList = function() {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getCommentList',filmid:$scope.film.id,currentpage:$scope.paginationConf.currentPage}
			}).success(function(data){
				console.log(data.result.comments);
				$scope.comments = data.result.comments;
				$scope.paginationConf.totalItems = data.result.count;
			}).error(function(){
				
			});
	};
	$scope.$watch('paginationConf.currentPage + paginationConf.itemsPerPage',getCommentList());
	$scope.deleteComment = function(comment) {
		layer.confirm('确定删除该评论吗？',{
			btn:['确定','取消'] 
		},function(){
			$http({
				url:'http://10.103.241.137:8080/Film/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{method:'deleteComment',id:comment.id,grade:comment.grade,
				filmid:$scope.film.id}
				}).success(function(data){
					layer.msg('已删除',{icon:1});
					getCommentList();
				}).error(function(){
					layer.msg('删除遇到错误',{icon:5});
				});
		},function() {
			layer.msg('已取消',{
				time:2000
			});
		});
	};
});
app.controller('replyListController',function($scope,$http,$location,$routeParams){
	$scope.comment = {
		id:$routeParams.id,
	};
	var getReplyList = function(){
		$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getReply',commentid:$scope.comment.id}
		}).success(function(data){
			$scope.replys = data.result;
		}).error(function(){
			
		});
	};
	getReplyList();
	$scope.deleteReply = function(reply) {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'deleteReply',id:reply.id}
			}).success(function(data){
				if(!data.result) {
					layer.alert("删除失败，请稍后重试",{icon:6});
				}else {
					layer.alert("已删除",{icon:5});
					getReplyList();
				}
			}).error(function(){
				
			});
	};
});
app.controller('commentReplyController',function($scope,$http,$location,$routeParams,$cookieStore){
	$scope.comment = {
		id:$routeParams.id,
	};
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{method:'getCommentById',id:$scope.comment.id}
		}).success(function(data){
			$scope.comment = data.result;
		}).error(function(){
			
		});

	managerId = $cookieStore.get('userid');
	$scope.addCommentReply = function() {
		$http({
			url:'http://localhost:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'addReply',commentid:$scope.comment.id,userid:managerId,
					reply:$scope.comment.reply}
		}).success(function(data){
			console.log(data.result);
			if(!data.result) {
    	  	   layer.alert("提交失败，请稍后重试",{icon:5});
    	  	}else {
    	  	   layer.alert("提交成功",{icon:6});
    	  	}
		}).error(function(){
			
		});
	};

});
app.controller('categoryController',function($scope,$http,$location) {
	if($location.path() == '/categoryList') {	
		var getCategoryList = function() {
		$http({
			url:'http://10.103.241.137:8080/Film/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'getCategoryList',}
			}).success(function(data){
				console.log(data.result);
				$scope.categorys = data.result;
			}).error(function(){
				
			});
		};
		getCategoryList();
		$scope.deleteCategory = function(category) {
			layer.confirm('确定删除该类别吗？',{
				btn:['确定','取消']
			},function(){
				$http({
					url:'http://10.103.241.137:8080/Film/InfoCl',
					dataType:"jsonp",
					method:'GET',
					contentType:'application/json;charset=utf-8',
					async:true,
					processData:false,
					cache:false,
					params:{id:category.id,method:'deleteCategory',}
				}).success(function(data){
					if(data.result){
						layer.alert('已删除',{icon:'6'});		
					}
					getCategoryList();
				}).error(function(){
					
				});
			},function(){
				layer.msg('已取消',{time:2000});
			});	
		};
	}else {
		$scope.addCategory = function() {
			$http({
				url:'http://10.103.241.137:8080/Film/InfoCl',
				dataType:"jsonp",
				method:'GET',
				contentType:'application/json;charset=utf-8',
				async:true,
				processData:false,
				cache:false,
				params:{name:$scope.category.name,method:'addCategory'
				,introduction:$scope.category.introduction}
			}).success(function(data){
				if(data.result){
					layer.alert('已成功添加',{icon:'6'});
					$location.path('/categoryList');		
				}else {
					layer.alert('添加失败',{icon:'5'});
				}
			}).error(function(){
				
			});
		};
	}
});

app.controller('informationController',function($scope,$http,$location,$cookieStore) {
	id = $cookieStore.get('userid');
	$http({
		url:'http://10.103.241.137:8080/Film/InfoCl',
		dataType:"jsonp",
		method:'GET',
		contentType:'application/json;charset=utf-8',
		async:true,
		processData:false,
		cache:false,
		params:{id:id,method:'getUser'}
	}).success(function(data){
		$scope.user = data.result;
		$cookieStore.put('password',$scope.user.password);
		//console.log($cookieStore.get('password'));
	}).error(function(){
		console.log("error!");
	});
});
app.controller('passwordChangeController',function($scope,$http,$location,$cookieStore){
	id = $cookieStore.get('userid');
	password = $cookieStore.get('password');
	$scope.checkOldPasswordCorrect = function() {
		if($scope.user.oldPsw!=password) {
			layer.msg('当前密码输入错误，请重新输入');
		}
	};
	$scope.checkOldPassword = function() {
		if($scope.user.newPsw==password) {
			layer.msg('新密码和原来密码一样，请重新输入');
		}
	};
	$scope.checkNewPassword = function() {
		if($scope.user.correctPsw!=$scope.user.newPsw) {
			layer.msg('两次新密码输入不同，请重新输入');
		}
	};
	$scope.pswChange = function() {
		$http({
			url:'http://10.103.241.137:8080/Beauty_Salon/InfoCl',
			dataType:"jsonp",
			method:'GET',
			contentType:'application/json;charset=utf-8',
			async:true,
			processData:false,
			cache:false,
			params:{method:'updateUser',id:id,level:level,password:$scope.user.newPsw}
		}).success(function(data){
			console.log('success');
			if(data.result) {
				layer.alert("密码已更改",{icon:6});
				$scope.user = {
					oldPsw : "",
					newPsw : "",
					correctPsw : ""
				}; 
			}else {
				layer.alert("请完善表单信息后重新提交",{icon:5});
			}
		}).error(function(){
			console.log('error!');				
		});
	};
});
