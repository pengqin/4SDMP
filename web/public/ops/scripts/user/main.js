'use strict';
define(function(require, exports) {

require("./services/UserService");

/*
var userTemp = require("./templates/user.html");
var userNewTemp = require("./templates/user/new.html");
var userViewTemp = require("./templates/user/view.html");*/

angular.module('gymUser', 
    ['gymUserService']//'gymUserDirectives'])
/*
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/user', {
        template: userTemp,
        controller: 'UserController'
    })
    .when('/user/new', {
        template: userNewTemp,
        controller: 'UserNewController'
    })
    .when('/user/:id', {
        template: userViewTemp,
        controller: 'UserViewController'
    });
}])*/
);

});