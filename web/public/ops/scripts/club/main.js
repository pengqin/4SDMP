'use strict';
define(function(require, exports) {

require("./services/ClubService");
require("./services/ClubEmployeeService");
require("./services/StoreService");
require("./services/ScheduleService");
require("./directives/ClubDirectives");
require("./directives/ClubEmployeeDirectives");
require("./directives/StoreDirectives");
require("./directives/ScheduleDirectives");

var clubTemp = require("./templates/club.html");
var clubNewTemp = require("./templates/club/new.html");
var clubViewTemp = require("./templates/club/view.html");

angular.module('gymClub', 
    ['gymClubService', 'gymClubDirectives',
     'gymClubEmployeeService', 'gymClubEmployeeDirectives',
     'gymStoreService', 'gymStoreDirectives',
     'gymScheduleService', 'gymClubScheduleDirectives'])
.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/club', {
        template: clubTemp,
        controller: 'ClubController'
    })
    .when('/club/new', {
        template: clubNewTemp,
        controller: 'ClubNewController'
    })
    .when('/club/:id', {
        template: clubViewTemp,
        controller: 'ClubViewController'
    });
}]);

});