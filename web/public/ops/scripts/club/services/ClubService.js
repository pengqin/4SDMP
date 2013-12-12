'use strict';
define(function(require, exports) {

angular.module('gymClubService', [])
    .factory("ClubService", function($rootScope, $http) {
        var uri = $rootScope.PATH + "/api/club";
        var serviceUri = $rootScope.PATH + "/api/service";

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
                    owner: {},
                    employees: []
                };
            },
            create: function(club) {
                return $http({
                    method: 'POST',
                    data: club,
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
            update: function(club) {
                return $http({
                    method: 'PUT',
                    data: club,
                    url: uri + '/' + club._id
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
            },
            queryAllServices: function(params) {
                var params = params || {};
                params.archived = false;
                return $http({
                    method: 'GET',
                    url: serviceUri + '?' + $.param(params)
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
            getPlainServiceObject: function() {
                return {
                    name: ""
                };
            },
            createService: function(service) {
                return $http({
                    method: 'POST',
                    data: service,
                    url: serviceUri
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
            updateService: function(service) {
                return $http({
                    method: 'PUT',
                    data: service,
                    url: serviceUri + '/' + service._id
                });
            },
            removeService: function(service) {
                return $http({
                    method: 'PUT',
                    data: {
                        archived: true
                    },
                    url: serviceUri + '/' + service._id
                });
            }
        };
    });
});