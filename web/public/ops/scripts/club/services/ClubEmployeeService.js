'use strict';
define(function(require, exports) {

angular.module('gymClubEmployeeService', [])
    .factory("ClubEmployeeService", function($rootScope, $http) {
        var uri = $rootScope.PATH + "/api/club";

        return {
            queryAll: function(params) {
                var params = params || {}, clubId;
                clubId = params.clubId;
                delete params.clubId;
                params.archived = false;
                return $http({
                    method: 'GET',
                    url: uri + "/" + clubId + '/employee?' + $.param(params)
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
                    mobile: "",
                    email: ""
                };
            },
            save: function(clubId, employee) {
                if (employee._id) {
                    return this.update(employee);
                } else {
                    return this.create(clubId, employee);
                }
            },
            create: function(clubId, employee) {
                return $http({
                    method: 'POST',
                    data: employee,
                    url: $rootScope.PATH + "/api/club/" + clubId + '/employee'
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
                    url: uri + "/api/user"
                }).then(function(res) {
                    return res.data;
                }, function() {
                    $rootScope.message.error('服务器异常,无法获取标识为' + id + '的数据.');
                    return null;
                });
            },
            update: function(employee) {
                return $http({
                    method: 'PUT',
                    data: employee,
                    url: $rootScope.PATH + "/api/user/" + employee._id
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
            remove: function(id) {
                return $http({
                    method: 'PUT',
                    data: {
                        archived: true
                    },
                    url: uri + '/' + id
                });
            }
        };
    });
});