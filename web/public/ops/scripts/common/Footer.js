'use strict';
define(function(require, exports) {
  var footerTemplate = require("./templates/footer.html");

  angular.module('gymFooter', [])
  .controller('FooterController', function ($scope) {
  })
  .directive("gymFooter", ['$location', function ($location) {
    return {
      restrict: 'A',
      replace: true,
      template: footerTemplate,
      controller: "FooterController",
      link: function ($scope, $element, $attrs) {
      }
    };
  }]);

});