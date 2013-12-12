'use strict';
define(function(require, exports) {

var storeListTemp = require("../templates/club/store/store.html");
var storeEmployeesTemp = require("../templates/club/store/employees.html");
var storeSaveTemp = require("../templates/club/store/save.html");


angular.module('gymStoreDirectives', [])
.controller('StoreController', ['$scope', '$filter', '$routeParams', '$location', 'StoreService',
    function ($scope, $filter, $routeParams, $location, StoreService) {
    // 命名空间
    $scope.store = {};
    $scope.store.list = true;

    // 表格展示
    $scope.store.data = null;
    $scope.store.filteredData = null;
    // 刷新功能
    function refreshGrid() {
        $scope.dialog.showLoading();
        StoreService.queryAll({clubId: $routeParams.id}).then(function(stores) {
            $scope.dialog.hideStandby();
            $scope.store.data = stores;
            $scope.store.filteredData = $scope.store.data;
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("无法加载门店数据!");
        });
    }
    refreshGrid();
    $scope.store.refreshGrid = refreshGrid;

    // 当前选中数据
    $scope.store.selectedItem = null;

    // 显示是否启用
    $scope.store.isEnabled = function(item) {
        return item.enabled ? '否': '是';
    };
    // 删除功能
    $scope.store.confirmEnabled = function() {
        var selectedItem = $scope.store.selectedItem;
        if (selectedItem === null) {
            $scope.dialog.alert({
                text: '请选择一条记录!'
            });
            return;
        }
        var op = selectedItem.enabled ? '启用' : '暂停';
        $scope.dialog.confirm({
            text: "请确认" + op+ "门店:" + selectedItem.name + "。",
            handler: function() {
                $scope.dialog.showStandby();
                StoreService.enable(selectedItem._id, selectedItem.enabled)
                .then(function() {
                    $scope.dialog.hideStandby();
                    $scope.store.selectedItem = null;
                    $scope.message.success(op + "门店成功!");
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
    $scope.store.queryChanged = function(query) {
        return $scope.store.filteredData = $filter("filter")($scope.store.data, query);
    };

    // 新增功能
    $scope.store.createPage = function() {
        $scope.store.list = false;
        $scope.store.saveobj = StoreService.getPlainObject();
        $scope.store.refreshEmployees();
    };
    // 编辑功能
    $scope.store.showPage = function(store) {
        $scope.store.list = false;
        $scope.store.saveobj = store;
        if (!$scope.store.saveobj.rooms) {
            $scope.store.saveobj.rooms = [];
            $scope.store.saveobj.rooms.push(StoreService.getPlainObject().rooms[0]);
        }
        $scope.dialog.showLoading();
        StoreService.getEmployees(store._id).then(function (employees){
            $scope.dialog.hideStandby();
            $scope.store.saveobj.employees = employees;
            $scope.store.refreshEmployees();
        }, function(err) {
            $scope.dialog.hideStandby();
            $scope.message.error(err);
        });
    };

    $scope.store.refresh = refreshGrid;

}])
// 新增store或者修改store
.controller('StoreSaveController', ['$scope', '$routeParams', '$timeout', '$location', 'UserService', 'StoreService',
    function ($scope, $routeParams, $timeout, $location, UserService, StoreService) {
    $scope.store.saveobj = null;

    $scope.store.goback = function() {
        $scope.store.employeeNames = '';
        $scope.store.refreshGrid();
        $scope.store.list = true;
    };

    $scope.store.showManager = function() {
        $scope.store.select = 'manager';
    };

    $scope.store.showEmployees = function() {
        $scope.store.select = 'employees';
    };

    $scope.store.createStore = function() {
        $scope.dialog.showStandby();
        $scope.store.saveobj.clubId = $routeParams.id;
        StoreService.create($scope.store.saveobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            if (result) {
                $scope.message.success("新增门店成功!");
                $scope.store.goback();
            } else {
                $scope.message.error("新增门店失败!");
            }
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("服务器异常,新增门店失败!");
        });
    };

    $scope.store.updateStore = function() {
        $scope.dialog.showStandby();
        StoreService.update($scope.store.saveobj)
        .then(function(result) {
            $scope.dialog.hideStandby();
            $scope.message.success("保存门店基本信息成功!");
            $scope.store.goback();
        }, function() {
            $scope.dialog.hideStandby();
            $scope.message.error("保存门店基本信息失败!");
        });;
    };

    $scope.store.save = function() {
        if (!$scope.store.saveobj._id) {
            $scope.store.createStore();
        } else {
            $scope.store.updateStore();
        }
    }

    $scope.store.addRoom = function() {
        $scope.store.saveobj.rooms.push(StoreService.getPlainObject().rooms[0]);
    }

    $scope.store.removeRoom = function(remove) {
        $($scope.store.saveobj.rooms).each(function(i, room) {
            if (remove._id === room._id) {
                $scope.store.saveobj.rooms.splice(i, 1);
            }
        });
    }
}])
// 选择employess
.controller('StoreEmployeesSelectController', ['$scope', '$routeParams', '$timeout', '$location', 'ClubEmployeeService',
    function ($scope, $routeParams, $timeout, $location, ClubEmployeeService) {
        $scope.store.employees = [];
        $scope.store.employeeNames = '';
        $scope.store.select = 'none';

        function refresh() {
            if (!$scope.store.saveobj) { return; }

            ClubEmployeeService.queryAll({clubId: $routeParams.id}).then(function(employees) {
                $scope.store.employees = employees;
                $($scope.store.employees).each(function(idx, employee) {
                    $($scope.store.saveobj.employees).each(function(jdx, selected) {
                        if (selected === employee._id || selected._id === employee._id) {
                            employee.selected = true;
                        }
                    });
                });
                setNames();
            }, function() {
                $scope.message.error("无法加载员工数据!");
            });
        }
        $scope.store.refreshEmployees = refresh;

        function setNames() {
            $scope.store.employeeNames = '';
            var names = [];
            $($scope.store.saveobj.employees).each(function(idx, employee) {
                names.push(employee.name);
            });
            $scope.store.employeeNames = names.join(", ");
        }
        $scope.$watch("store.select", function(value) {
            $($scope.store.employees).each(function(idx, employee) {
                employee.selected = false;
                if (value === 'manager') {
                    if ($scope.store.saveobj.manager._id == employee._id) {
                        employee.selected =  true;
                    }
                } else if (value === 'employees') {
                    $($scope.store.saveobj.employees).each(function(jdx, selected) {
                        if (selected._id === employee._id) {
                            employee.selected = true;
                        }
                    });
                }
            });

        });
        $scope.store.selectEmployee = function(item) {
            $($scope.store.employees).each(function(idx, employee) {
                if ($scope.store.select == 'manager') {
                    employee.selected =  false;
                    $($scope.store.saveobj.employees).each(function(jdx, selected) {
                        if (selected._id === $scope.store.saveobj.manager._id) {
                            $scope.store.saveobj.employees.splice(jdx, 1);
                        }
                        if (selected._id === item._id) {
                            $scope.store.saveobj.employees.splice(jdx, 1);
                        }
                    });
                } else if ($scope.store.select == 'employees') {
                    $($scope.store.saveobj.employees).each(function(jdx, selected) {
                        if (selected._id === item._id) {
                            $scope.store.saveobj.employees.splice(jdx, 1);
                        }
                    });
                }
            });
            item.selected = !item.selected;
            if ($scope.store.select === 'manager') {
                $scope.store.saveobj.manager = item;
                $scope.store.saveobj.employees.push(item);
            } else if (item.selected) {
                $scope.store.saveobj.employees.push(item);
            }
            setNames();
        };
}])
.directive("gymClubStoreList", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : storeListTemp,
        controller : "StoreController",
        link : function($scope, $element, $attrs) {
        }
    };
}])
.directive("gymStoreEmployeeSelect", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : storeEmployeesTemp,
        controller : "StoreEmployeesSelectController",
        link : function($scope, $element, $attrs) {
        }
    };
}])
.directive("gymStoreSave", [ '$location', function($location) {
    return {
        restrict : 'A',
        replace : false,
        template : storeSaveTemp,
        controller : "StoreSaveController",
        link : function($scope, $element, $attrs) {
        }
    };
}]);


});