'use strict';
define(function(require, exports) {

angular.module('gymStoreService', [])
    .factory("StoreService", function($rootScope, $http) {
        var uri = $rootScope.PATH + "/api/store";

        function updateEmployess(store) {
            var ids = [];
            $(store.employees).each(function(i, employee) {
                ids.push({_id: employee._id});
            });
            store.employees = ids;
        }
        function clear(obj) {
            delete obj.selected;
            delete obj.role;
            delete obj.enabled;
        }
        return {
            queryAll: function(params) {
                var params = params || {};
                params.archived = false;
                /*
                if (typeof params["page.max"] === 'undefined') {
                    params["page.max"] = 999;
                }
                params.archived = false;*/
                return $http({
                    method: 'GET',
                    url: uri + '?' + $.param(params)
                }).then(function(res) {
                    if (res.data && res.data.length > 0) {
                        return res.data;
                    } else {
                        return [];    
                    }
                }, function() {
                    return [];
                });
            },
            getPlainObject: function() {
                return {
                    name: "",
                    phone: "",
                    address: "",
                    manager: {},
                    employees: [],
                    rooms: [{_id: (new Date()).getTime(), name: "综合健身房", schedules: []}]
                };
            },
            create: function(store) {
                updateEmployess(store);
                clear(store.manager);

                return $http({
                    method: 'POST',
                    data: store,
                    url: uri
                }).then(function(res) {
                    if (res.status === 201) {
                        return true;
                    } else {
                        return false;
                    }
                }, function() {
                    return false;
                });
            },
            get: function(id) {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: uri + '/' + id
                }).then(function(res) {
                    return res.data;
                }, function() {
                    $rootScope.message.error('服务器异常,无法获取标识为' + id + '的数据.');
                    return null;
                });
            },
            getEmployees: function(id) {
                return $http({
                    method: 'GET',
                    cache: false,
                    url: uri + '/' + id + '/employee'
                }).then(function(res) {
                    return res.data;
                }, function() {
                    $rootScope.message.error('服务器异常,无法获取标识为' + id + '门店的员工数据.');
                    return null;
                });
            },
            update: function(store) {
                updateEmployess(store);
                clear(store.manager);

                return $http({
                    method: 'PUT',
                    data: store,
                    url: uri + '/' + store._id
                });
            },
            enable: function(id, enabled) {
                return $http({
                    method: 'PUT',
                    data: {
                        enabled: !enabled
                    },
                    url: uri + '/' + id
                });
            },
            remove: function(id, archived) {
                return $http({
                    method: 'PUT',
                    data: {
                        archived: !archived
                    },
                    url: uri + '/' + id
                });
            }
        };
    });
});