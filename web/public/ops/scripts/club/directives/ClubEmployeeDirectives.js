'use strict';
define(function(require, exports) {

var employeeListTemp = require("../templates/club/employee/employee.html");
var employeeSaveTemp = require("../templates/club/employee/save.html");

angular.module('gymClubEmployeeDirectives', [])
.controller('ClubEmployeeController', ['$scope', '$filter', '$routeParams', '$location', 'ClubEmployeeService',
    function ($scope, $filter, $routeParams, $location, ClubEmployeeService) {
    // 命名空间
    $scope.clubemployee = {};
    $scope.clubemployee.list = true;

    // 表格展示
    $scope.clubemployee.data = null;
    $scope.clubemployee.filteredData = null;
    // 刷新功能
    function refreshGrid() {
        $scope.dialog.showLoading();
        ClubEmployeeService.queryAll({clubId: $routeParams.id}).then(function(employees) {
            $scope.dialog.hideStandby();
            $scope.clubemployee.data = employees;
            $scope.clubemployee.filteredData = $scope.clubemployee.data;
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("无法加载员工数据!");
        });
    }
    refreshGrid();
    $scope.clubemployee.refreshGrid = refreshGrid;

    // 当前选中数据
    $scope.clubemployee.selectedItem = null;

    // 显示角色身份
    $scope.clubemployee.getRoleLabel = function(user) {
        var role = user.role;
        switch(role) {
        case 'owner':
            return '会所所有人';
        break;
        case 'manager':
            return '门店经理';
        break;
        default:
            return '员工';
        }
    };
    // 显示是否在岗
    $scope.clubemployee.isEnabled = function(item) {
        return item.enabled ? '是': '否';
    };
    // 删除功能
    $scope.clubemployee.confirmEnabled = function() {
        var selectedItem = $scope.clubemployee.selectedItem;
        if (selectedItem === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        var op = selectedItem.enabled ? '在岗' : '离岗';
        $scope.dialog.confirm({
            text: "请确认" + op+ "员工:" + selectedItem.name + "。",
            handler: function() {
                $scope.dialog.showStandby();
                ClubEmployeeService.remove(selectedItem._id, selectedItem.enabled)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.clubemployee.selectedItem = null;
                    $scope.message.success(op + "员工成功!");
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
    $scope.clubemployee.queryChanged = function(query) {
        return $scope.clubemployee.filteredData = $filter("filter")($scope.clubemployee.data, query);
    };

    // 新增功能
    $scope.clubemployee.createPage = function(employee) {
        $scope.clubemployee.list = false;
        $scope.clubemployee.saveobj = ClubEmployeeService.getPlainObject();
    };
    // 编辑功能
    $scope.clubemployee.showPage = function(employee) {
        $scope.clubemployee.list = false;
        $scope.clubemployee.saveobj = employee;
    };

    $scope.clubemployee.refresh = refreshGrid;

}])
.controller('ClubEmployeeSaveController', ['$scope', '$routeParams', '$location', 'ClubEmployeeService',
    function ($scope, $routeParams, $location, ClubEmployeeService) {

    $scope.clubemployee.goback = function() {
        $scope.clubemployee.refreshGrid();
        $scope.clubemployee.list = true;
    };

    $scope.clubemployee.save = function() {
        $scope.dialog.showStandby();
        console.info($scope.clubemployee.saveobj);
        ClubEmployeeService.save($routeParams.id, $scope.clubemployee.saveobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("保存员工成功!");
                $scope.clubemployee.goback();
            } else {
                $scope.message.error("保存员工失败!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("保存员工失败!");
        });;
    };
}])
.directive("gymClubEmployeeList", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : employeeListTemp,
        controller : "ClubEmployeeController",
        link : function($scope, $element, $attrs) {
        }
    };
}])
.directive("gymClubEmployeeSave", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : employeeSaveTemp,
        controller : "ClubEmployeeSaveController",
        link : function($scope, $element, $attrs) {
        }
    };
}]);

});