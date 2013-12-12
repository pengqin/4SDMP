define(function(require) {
'use strict';
    
require("./common/main");
require("./club/main");
require("./user/main");

var welcomeTemp = require("./common/templates/welcome.html");
var helpTemp = require("./common/templates/help.html");
var faqTemp = require("./common/templates/faq.html");

// GOABAL VAL
window.PATH = window.location.pathname.slice(0, window.location.pathname.lastIndexOf("/"));

angular.module('gymApp', ['gymCommon', 'gymClub', 'gymUser'])
.config(['$httpProvider', '$routeProvider', function ($httpProvider, $routeProvider) {
        // var token = $.cookie('AiniaOpAuthToken');
        // header头带认证参数
        // $httpProvider.defaults.headers.common['Authorization'] = token;
    
        // 配置路由,和模块相关的配置均在相应模块下的main.js
        $routeProvider
        .when('/welcome', {
            template: welcomeTemp,
            controller: function($scope) {
            }
        })
        .when('/help', {
            template: helpTemp,
            controller: function($scope) {
            }
        })
        .when('/faq', {
            template: faqTemp,
            controller: function($scope) {
            }
        })
        .otherwise({
            redirectTo: '/welcome'
        });
}])
.run(['$rootScope', '$http', function($rootScope, $http) {
    $rootScope.PATH = "http://localhost:3000";
    /*
    // 设置全局变量
    

    // 公用函数:退出系统
    function logout(msg) {
        if (msg) { alert(msg); }
        $.cookie("AiniaOpAuthToken", '', { path: '/' });
        window.location.href = "login.html";
    };
    window.logout = logout;*/

    // 加载完成, 显示工作界面
    function inited() {
        $(document.body).removeClass("noscroll");
        $("#loadingpage").hide();
    }

    inited();
    /*
    // 判断是否登录
    var username = $.cookie("AiniaOpUsername"),
        token = $.cookie("AiniaOpAuthToken");
    
    if (!token) {
        logout('请先登录!');
        return;
    }

    // 设置session的用户
    $rootScope.session = {user: {roles: ""}};
    ProfileService.get(username)
    .then(function(user) {
        if (user) {
            $rootScope.session.user = user;
            $.cookie("AiniaOpUserId", user.id, { expires: 1, path: '/' });
        } else {
            logout('无法获取您登录名为' + username +'用户信息。请与管理员联系!');
        }
    }, function() {
        logout('获取您登录名为' + username +'用户信息时, 服务器异常。请与管理员联系!');
    })
    .then(function() { // 显示工作界面
        inited();
    });*/

}]);

angular.bootstrap(document, ["gymApp"]);

});