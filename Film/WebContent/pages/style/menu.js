/**
 * name:topmenu
 */
angular.module('tm.menu', []).directive('myMenu',[function(){
    return {
        restrict: 'EA',
        template: 
        	'<div>'+
        	'<div id="header-wrap" class="header-wrap">'+
			'<div id="header-fix" class="header-fix">'+
'<span><a>爱豆</a></span>'+
'<span><a>电影</a></span>'+
'<span><a>优惠券</a></span>'+
'<span><a>评论</a></span>'+
'</div>'+
'</div>'+
'<div class="content-wrap" id="content-wrap">'+
'<div class="sub-title box">'+
'<div class="logo-header">'+
	'<h3>爱豆电影</h3>'+
'</div>'+
'<div class="subnav">'+
	'<div class="subsubnav">'+
		'<div class="subnav-left">'+
			'<img class="subnav-img" src="images/home.png">'+
			'<span class="btn-right"><a href="index.html">首页</a></span>'+
		'</div>'+
		'<div class="col-lg-offset-1 col-lg-8">'+
			'<span class="selected"><a href="">电影部落</a></span>'+
	    	'<em> | </em>'+
	    	'<span><a href="">观影分享</a></span>'+
	    	'<em> | </em>'+
	    	'<span><a href="register.html">加入我们</a></span>'+
	    	'<em> | </em>'+
	    	'<span><a href="">电影之家</a></span>'+
	    	'<em> | </em>'+
	    	'<span><a href="">电影推荐</a></span>'+
	    '</div>'+
	    	'<span class="selected btn-right"><a href="login.html">请登录</a></span>'+
	    	'<em> | </em>'+
	    	'<span class="btn-right"><a href="register-both.html">免费注册</a></span>'+
	'</div>'+	    	
'</div>'+
'</div>' +
    '</div>'+
    '</div>',
        replace: true,
        scope: {
            
        },
        link: function(){
        }
    };
}]);
