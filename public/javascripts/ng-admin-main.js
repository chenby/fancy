 var admin = angular.module('myapp.admin',['ui.router','ngGrid']);
admin.config(function($stateProvider,$urlRouterProvider){
	$urlRouterProvider.when("", "/firstPage");
	$stateProvider.state('firstPage',{
		url:'/firstPage',
		templateUrl:'views/firstPage'
	})
	.state('addsp',{
		url:'/addsp',
		templateUrl:'views/addsp'
	})
	.state('goods',{
		url:'/goods',
		templateUrl:'views/goods'
	})
	.state('charge',{
		url:'/charge',
		templateUrl:'views/charge'
	})
	.state('shopping',{
		url:'/shopping',
		templateUrl:'views/shopping'
	})
	.state('yonghu',{
		url:'/yonghu',
		templateUrl:'views/yonghu'
	})	 
})
 //charge controller
 admin.controller('gridCtrl',function($scope){
		$scope.members = [{name: "vip",   sex:'男',tel:13912374537,email:'xiaoming@gmail.com',age: 50,check:'yes' },
	                      {name: "vip1",  sex:'男',tel:13312374537,email:'xiaoming@gmail.com',age: 43,check:'no' },
	                      {name: "vip2",  sex:'女',tel:13512374537,email:'xiaoming@gmail.com',age: 27,check:'no' },
	                      {name: "admin", sex:'男',tel:15912374537,email:'xiaoming@gmail.com',age: 29,check:'no' },
	                      {name: "admin1",sex:'男',tel:13912374537,email:'xiaoming@gmail.com',age: 34,check:'no' },
	                      {name: "admin2",sex:'女',tel:13932374537,email:'xiaoming@gmail.com',age: 50,check:'no' },
	                      {name: "admin3",sex:'男',tel:13515634537,email:'xiaoming@gmail.com',age: 43,check:'no' },
	                      {name: "admin4",sex:'男',tel:13912374937,email:'xiaoming@gmail.com',age: 27,check:'no' },
	                      {name: "admin5",sex:'男',tel:13912374527,email:'xiaoming@gmail.com',age: 29,check:'no' }];
	    $scope.gridOptions = { 
	    	data: 'members',
	    	columnDefs: [{field: 'name', displayName:'管理员用户' }, 
                         {field: 'age',displayName:'年龄' },
                         {field: 'sex',displayName:'性别' },
                         {field: 'tel',displayName:'电话' },
                         {field: 'email',displayName:'邮件' },
                         {field: 'check',displayName:'是否可用'}],
                pinSelectionCheckbox:true,
                enablePinning: true,
         	    showFooter: true,
         	    showFilter: true,
         	 	filterOptions: {
		            filterText: "",
		            useExternalFilter: false
		        },
		        i18n:'zh-cn'
	    	 };
 })
//addsp controller
admin.controller('ctrl.form', function ($scope,$http) {
         var vm = $scope.vm = {
            sp: {
    
            }
        };
        vm.submit = function (basic_form) {
            basic_form.$setDirty();
            if(basic_form.$valid){
                $http({
	            	method:'POST',
	            	url:'addsp',
	            	data:$scope.vm.sp
	            }).success(function(data,status,header,config){
	            	 alert("提交成功！");
	            }).error(function(data,status,header,config){
	            	console.log(status);
	            })
            }
           


        };
   });
//goods商品展示列表
admin.controller('goods.list', function ($scope,$http) {
	$scope.showdata=[];
	$http({
		method:'POST',
		url:'goods_getten'
	}).success(function(data,status,header,config){
	     $scope.showdata=data; 
    }).error(function(data,status,header,config){
	    console.log(status);
	})
	$scope.$on("showChange",function (event, msg) {
          $scope.showdata=msg;
 	})
});
admin.directive('delate',function($http){
	return { 
	 restrict: 'EA', 
	 template: '<a ng-click="removeList()" href="">删除</a>',
	 controller:function($scope, $element, $attrs, $transclude){
			$scope.removeList=function(){
				 var removeName=$element.parent().parent().children()[0].innerText
				$http({
					method:'POST',
					url:'goods_remove',
					data:{name:removeName}
				}).success(function(data,status,header,config){
				$element.parent().parent().remove();
				    alert('删除成功');
			    }).error(function(data,status,header,config){
				    console.log(status);
				})
	
		  	 }
	   }
	} 
})
//分页controller
admin.controller('goods.fen', function ($scope,$http) {
	$scope.page=1;
	$scope.pageDate=[];	
	$http({
		method:'POST',
		url:'goods_get'
		}).success(function(data,status,header,config){
			console.log(data.length );
			for (var i = 0; i < Math.ceil(data.length/8); i++) {
				 $scope.pageDate.push({'index':i*8});
			};
	    }).error(function(data,status,header,config){
		    console.log(status);
		})
	$scope.asfor=function(index){
		$http({
			method:'POST',
			url:'goods_getten',
			data:{base:index}
			}).success(function(data,status,header,config){
				$scope.$emit("showChange", data);
		    }).error(function(data,status,header,config){
			    console.log(status);
			})
		$scope.page=index/8+1;
	}
	$scope.next=function(pageNum){
		if (($scope.page+pageNum)==0||(($scope.page+pageNum)>($scope.pageDate.length))) {
			return;
		}else{
			$scope.asfor(($scope.page+pageNum-1)*8);	
		}
		
	}
});
//分页指令版
// admin.directive('page',function($http){
// 	return { 
// 	restrict: 'EA', 
// 	transclude:true,
// 	scope: {
//        index:"="
//     },
// 	template: "<a ng-click='change()' index='index' ng-transclude ></a>",	
// 	link: function (scope, element, attr) {
//         scope.change = function () {
//             var base=parseInt(attr.index);

// 			$http({
// 				method:'POST',
// 				url:'goods_getten',
// 				data:{base:base}
// 			}).success(function(data,status,header,config){
// 				console.log(data);
// 		    }).error(function(data,status,header,config){
// 			    console.log(status);
// 			})
// 	 	}
//     }
// 	}
// })
// shoppings商品展示列表
admin.controller('shopping.list', function ($scope,$http) {
	$scope.showdata=[];
	$http({
		method:'POST',
		url:'shopping_get'
	}).success(function(data,status,header,config){
	     $scope.showdata=data; 
    }).error(function(data,status,header,config){
	    console.log(status);
	})
});
admin.directive('delat',function($http){
	return { 
	 restrict: 'EA', 
	 template: '<a ng-click="removeList()" href="">删除</a>',
	 controller:function($scope, $element, $attrs, $transclude){
			$scope.removeList=function(){
				 var removeName=$element.parent().parent().children()[1].innerText;
				 var removeUser=$element.parent().parent().children()[0].innerText;
				$http({
					method:'POST',
					url:'shopping_remove',
					data:{ user:removeUser,name:removeName}
				}).success(function(data,status,header,config){
				$element.parent().parent().remove();
				    alert('删除成功');
			    }).error(function(data,status,header,config){
				    console.log(status);
				})
	
		  	 }
	   }
	} 
})
//得到用户
admin.controller('user.list', function ($scope,$http) {
	$scope.showdata=[];
	$http({
		method:'POST',
		url:'user_get'
	}).success(function(data,status,header,config){
	     $scope.showdata=data; 
    }).error(function(data,status,header,config){
	    console.log(status);
	})
});
admin.directive('dela',function($http){
	return { 
	 restrict: 'EA', 
	 template: '<a ng-click="removeList()" href="">删除</a>',
	 controller:function($scope, $element, $attrs, $transclude){
			$scope.removeList=function(){
				var removeName=$element.parent().parent().children()[0].innerText;
				$http({
					method:'POST',
					url:'user_remove',
					data:{name:removeName}
				}).success(function(data,status,header,config){
				$element.parent().parent().remove();
				    alert('删除成功');
			    }).error(function(data,status,header,config){
				    console.log(status);
				})
	
		  	 }
	   }
	} 
})