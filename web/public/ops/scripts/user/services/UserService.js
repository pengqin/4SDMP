'use strict';
define(function(require, exports) {

angular.module('gymUserService', [])
    .factory("UserService", function($rootScope, $http) {
        var uri = $rootScope.PATH + "/api/user";

        return {
            queryAll: function(params) {
                var params = params || {};
                params.archived = false;
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
                    owner: {}
                };
            },
            create: function(user) {
                return $http({
                    method: 'POST',
                    data: user,
                    url: uri
                }).then(function(res) {
                    if (res.status === 201) {
                        return res.data;
                    } else {
                        throw new Error("the status code is not 201.");
                    }
                }, function(err) {
                    throw err;
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
            update: function(user) {
                return $http({
                    method: 'PUT',
                    data: user,
                    url: uri + '/' + user._id
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