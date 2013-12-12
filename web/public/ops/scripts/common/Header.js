'use strict';
define(function(require, exports) {
var headerTemplate = require("./templates/header.html");

angular.module('gymHeader', [])
.controller('HeaderController', ['$scope', '$location', '$timeout',
    function ($scope, $location, $timeout) {

    $scope.logout = function() {
        window.logout();
    };

    $scope.header = {};
    $scope.header.idx = 'welcome';
    if (window.location.href.indexOf("club") > 0) {
        $scope.header.idx = 'club';
    }
}])
.directive("gymHeader", ['$location', function ($location) {
    return {
        restrict: 'A',
        replace: true,
        template: headerTemplate,
        controller: "HeaderController",
        link: function ($scope, $element, $attrs) {
        }
    };
}]);

});