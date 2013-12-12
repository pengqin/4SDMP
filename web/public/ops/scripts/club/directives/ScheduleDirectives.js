'use strict';
define(function(require, exports) {

var scheduleSettingTemp = require("../templates/club/schedule/setting.html");
var storeScheduleTemp = require("../templates/club/schedule/schedule.html");
var serviceSaveTemp = require("../templates/club/schedule/servicesave.html");
var newScheduleTemp = require("../templates/club/schedule/new.html");

angular.module('gymClubScheduleDirectives', [])
.controller('ClubScheduleController', ['$scope', '$filter', '$routeParams', '$location', 'ClubService', 'StoreService', 'ScheduleService',
    function ($scope, $filter, $routeParams, $location, ClubService, StoreService, ScheduleService) {
    // 命名空间
    $scope.clubschedule = {};
    $scope.clubschedule.stores = []; 
    $scope.clubschedule.store = {}; // 选中的门店
    $scope.clubschedule.rooms = []; 
    $scope.clubschedule.room = {}; // 选中的房间
    $scope.clubschedule.schedules = []; 
    $scope.clubschedule.schedule = {}; // 选中的房间

    $scope.clubschedule.op = 'schedule';

    // 获得门店列表功能
    function refreshStore() {
        $scope.dialog.showLoading();
        StoreService.queryAll({clubId: $routeParams.id}).then(function(stores) {
            $scope.dialog.hideStandby();
            $scope.clubschedule.stores = stores;
            if (stores.length == 1) {
                $scope.clubschedule.store = stores[0];
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("无法加载门店数据!");
        });
    }
    refreshStore();
    $scope.clubschedule.refreshStore = refreshStore;


    // 获得门店列表功能
    function refreshService() {
        ClubService.queryAllServices({clubId: $routeParams.id}).then(function(services) {
            $scope.clubschedule.services = services;
        }, function() {
            $scope.message.error("无法加载门店数据!");
        });
    }
    refreshService();
    $scope.clubschedule.refreshService = refreshService;

    // 获得课程安排列表
    function refreshSchedule() {
        ScheduleService.queryAll({
            clubId: $routeParams.id,
            storeId: $scope.clubschedule.store._id,
            roomId: $scope.clubschedule.room._id,
        }).then(function(schedules) {
            $scope.clubschedule.schedules = schedules;
            if (schedules.length > 0) {
                $scope.clubschedule.schedule = schedules[0];
            }
        });
    }
    $scope.$watch("clubschedule.room", function() {
        if (!$scope.clubschedule.room._id) { return; }
        refreshSchedule();
    });

    $scope.clubschedule.selectStore = function(store) {
        $scope.clubschedule.store = store; // 选中的门店
        $scope.clubschedule.room = {}; // 选中的房间
        $scope.clubschedule.rooms = store.rooms || []; // 选中的房间
        $scope.clubschedule.schedules = []; 
        $scope.clubschedule.schedule = {}; // 选中的房间
        if (store.rooms && store.rooms.length == 1) {
            $scope.clubschedule.room = store.rooms[0];
        }
    }

    $scope.clubschedule.selectRoom = function(room) {
        $scope.clubschedule.room = room; // 选中的房间
        $scope.clubschedule.schedules = []; 
        $scope.clubschedule.schedule = {}; // 选中的房间
    }

    function gobackschedule() {
        $scope.clubschedule.op = 'schedule';
        refreshService();
    }

    $scope.clubschedule.createServicePage = function() {
        $scope.clubschedule.op = 'service';
        $scope.clubschedule.saveservice = ClubService.getPlainServiceObject();
    };

    $scope.clubschedule.showServicePage = function(service) {
        $scope.clubschedule.op = 'service';
        $scope.clubschedule.saveservice = service;
    };

    $scope.clubschedule.createService = function() {
        $scope.dialog.showStandby();
        $scope.clubschedule.saveservice.clubId = $routeParams.id;
        ClubService.createService($scope.clubschedule.saveservice).then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("新增服务成功!");
                gobackschedule();
            } else {
                $scope.message.error("新增服务失败!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("创建服务失败!");
        })
    }

    $scope.clubschedule.updateService = function() {
        $scope.dialog.showStandby();
        ClubService.updateService($scope.clubschedule.saveservice)
        .then(function(result) {
            $scope.dialog.hideStandby();
            $scope.message.success("保存服务信息成功!");
            gobackschedule();
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("保存服务信息失败!");
        });;
    };

    $scope.clubschedule.highlightService = function() {

    }

    $scope.clubschedule.saveService = function() {
        if (!$scope.clubschedule.saveservice._id) {
            $scope.clubschedule.createService();
        } else {
            $scope.clubschedule.updateService();
        }
    }

    $scope.clubschedule.removeService = function(service) {
        $scope.dialog.confirm({
            text: "请确认删除该服务，相关预约将全部被取消。",
            handler: function() {
                $scope.dialog.showStandby();
                ClubService.removeService(service)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.message.success("删除服务成功!");
                    // 刷新
                    refreshService();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
                });
            }
        });
    };

    $scope.clubschedule.getPeriod = function() {
        return '';
    }

    $('#clubschedule-sdate').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false
    });

    $('#clubschedule-edate').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false
    });

    $scope.clubschedule.createSchedulePage = function() {
        $scope.clubschedule.op = 'newschedule';
        $scope.clubschedule.newschedule = ScheduleService.getPlainObject();
    }

    $scope.clubschedule.createSchedule = function() {
        $scope.clubschedule.newschedule.edate = $('#clubschedule-edate input').val();
        $scope.clubschedule.newschedule.sdate = $('#clubschedule-sdate input').val();

        if ($scope.clubschedule.newschedule.edate < $scope.clubschedule.newschedule.sdate) {
            $scope.message.warn("开始日期在结束日期之后");
            return;
        }
        $scope.dialog.showStandby();
        $scope.clubschedule.newschedule.clubId = $routeParams.id;
        $scope.clubschedule.newschedule.storeId = $scope.clubschedule.store._id;
        $scope.clubschedule.newschedule.roomId = $scope.clubschedule.room._id;

        ScheduleService.create($scope.clubschedule.newschedule).then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("新增课程表成功!");
                refreshSchedule();
                gobackschedule();
            } else {
                $scope.message.error("新增课程表失败!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("创建课程表失败!");
        })
    }

}])
.controller('ClubStoreScheduleController', ['$scope', '$filter', '$routeParams', '$location', 'ClubService', 'StoreService',
    function ($scope, $filter, $routeParams, $location, ClubService, StoreService) {
}])
.controller('ClubServiceSaveController', ['$scope', '$filter', '$routeParams', '$location', 'ClubService', 'StoreService',
    function ($scope, $filter, $routeParams, $location, ClubService, StoreService) {
}])
.controller('ClubNewScheduleController', ['$scope', '$filter', '$routeParams', '$location', 'ClubService', 'StoreService',
    function ($scope, $filter, $routeParams, $location, ClubService, StoreService) {
}])
.directive("gymClubScheduleSetting", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : scheduleSettingTemp,
        controller : "ClubScheduleController",
        link : function($scope, $element, $attrs) {}
    };
}])
.directive("gymClubStoreSchedule", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : storeScheduleTemp,
        controller : "ClubStoreScheduleController",
        link : function($scope, $element, $attrs) {}
    };
}])
.directive("gymClubServiceSave", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : serviceSaveTemp,
        controller : "ClubServiceSaveController",
        link : function($scope, $element, $attrs) {}
    };
}])
.directive("gymClubNewSchedule", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : newScheduleTemp,
        controller : "ClubNewScheduleController",
        link : function($scope, $element, $attrs) {}
    };
}]);

});