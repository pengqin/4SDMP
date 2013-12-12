'use strict';
define(function(require, exports) {

angular.module('gymScheduleService', [])
    .factory("ScheduleService", function($rootScope, $http) {
        var uri = $rootScope.PATH + "/api/schedule";

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
                    name: ""
                };
            },
            create: function(schedule) {
                return $http({
                    method: 'POST',
                    data: schedule,
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
            update: function(schedule) {
                return $http({
                    method: 'PUT',
                    data: schedule,
                    url: uri + '/' + schedule._id
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