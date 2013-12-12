'use strict';
define(function(require, exports) {

var clubEditTemp = require("../templates/club/edit.html");

angular.module('gymClubDirectives', [])
.controller('ClubController', ['$scope', '$filter', '$timeout', '$location', 'ClubService', function ($scope, $filter, $timeout, $location, ClubService) {
    // 命名空间
    $scope.club = {};

    // 表格展示
    $scope.club.data = null;
    $scope.club.filteredData = null;
    // 刷新功能
    function refreshGrid() {
        $scope.dialog.showLoading();
        ClubService.queryAll().then(function(clubs) {
            $scope.dialog.hideStandby();
            $scope.club.data = clubs;
            $scope.club.filteredData = $scope.club.data;
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("无法加载会所数据!");
        });
    }
    refreshGrid();

    // 当前选中数据
    $scope.club.selectedItem = null;

    // 显示是否启用
    $scope.club.isEnabled = function(item) {
        return item.enabled ? '是': '否';
    };
    // 删除功能
    $scope.club.confirmEnabled = function() {
        var selectedItem = $scope.club.selectedItem;
        if (selectedItem === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        var op = !selectedItem.enabled ? '启用' : '暂停';
        $scope.dialog.confirm({
            text: "请确认" + op+ "会所:" + selectedItem.name + "。",
            handler: function() {
                $scope.dialog.showStandby();
                ClubService.enable(selectedItem._id, selectedItem.enabled)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.club.selectedItem = null;
                    $scope.message.success(op + "会所成功!");
                    // 刷新
                    refreshGrid();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("无法删除该数据,可能是您的权限不足,请联系管理员!");
                });
            }
        });
    };

    // 过滤功能
    $scope.club.queryChanged = function(query) {
        return $scope.club.filteredData = $filter("filter")($scope.club.data, query);
    };

    // 编辑功能
    $scope.club.showPage = function(club) {
        $location.path("club/" + club._id);
    };

    $scope.club.refresh = refreshGrid;

}])
.controller('ClubNewController', ['$scope', '$timeout', '$location', 'ClubService', 'UserService',
    function ($scope, $timeout, $location, ClubService, UserService) {

    $scope.club = {};
    $scope.club.newobj = ClubService.getPlainObject();

    $('#club-birthday').datetimepicker({
        format: "yyyy-MM-dd",
        language: "zh-CN",
        pickTime: false
    });

    $scope.club.showDatePicker = function() {
        $('#club-birthday').datetimepicker('show');
    };

    $scope.club.isUnique = true;

    $scope.club.create = function() {
        $scope.dialog.showStandby();
        UserService.create($scope.club.newobj.owner).then(function(user) {
            return user._id;
        }, function() {
            $scope.message.error("为会所负责人创建账号失败!");
            return false;
        }).then(function(userId) {
            if (userId) {
                $scope.club.newobj.owner._id = userId;
                $scope.club.newobj.employees.push({_id: userId, role: 'owner', enabled: true});
                ClubService.create($scope.club.newobj)
                .then(function(result) {
                    $scope.dialog.hideStandby();
                    if (result) {
                        $scope.message.success("新增会所成功!");
                        $location.path("/club");
                    } else {
                        $scope.message.error("新增会所失败!");
                    }
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("服务器异常,新增会所失败!");
                });
            } else {
                $scope.dialog.hideStandby();
            }
        });
    };
}])
.controller('ClubViewController', ['$scope', '$routeParams', '$timeout', '$location', 'ClubService',
    function ($scope, $routeParams, $timeout, $location, ClubService) {
    $scope.club = {};
    $scope.club.tab = $.cookie('ops-club-tab') || 'basic'; // 默认为基本页面
    $scope.$watch("club.tab", function(tab) {
        $.cookie('ops-club-tab', tab);
    });
}])
// 基本信息
.controller('ClubEditController', ['$scope', '$routeParams', '$timeout', '$location', 'ClubService', 'UserService',
    function ($scope, $routeParams, $timeout, $location, ClubService, UserService) {
    $scope.club.updateobj = null; //ClubService.get($routeParams.id);

    // 初始化界面,并获得最新version
    function refresh() {
        $scope.dialog.showLoading();
        ClubService.get($routeParams.id).then(function(club) {
            $scope.dialog.hideStandby();
            $scope.club.updateobj = club;
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("加载会所数据失败.");
        });
    };
    refresh();

    $scope.club.update = function() {
        $scope.dialog.showStandby();
        console.info($scope.club.updateobj.owner);
        UserService.update($scope.club.updateobj.owner).then(function(res) {
            return res.status;
        }, function() {
            $scope.message.error("更新会所负责人资料失败!");
            return false;
        }).then(function(status) {
            if (status == 200) {
                ClubService.update($scope.club.updateobj)
                .then(function(result) {
                    $scope.dialog.hideStandby();
                    $scope.message.success("编辑会所成功!");
                    refresh();
                }, function() {
                    $scope.dialog.hideStandby();
                    $scope.message.error("编辑会所失败!");
                });
            } else {
                $scope.dialog.hideStandby();
            }
        });

    };
}])
.directive("gymClubEdit", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : clubEditTemp,
        controller : "ClubEditController",
        link : function($scope, $element, $attrs) {
        }
    };
}]);


});