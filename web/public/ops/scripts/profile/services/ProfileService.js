'use strict';
define(function(require, exports) {

var httpProvider;
angular.module('gymProfileService', [])
.factory("ProfileService", function($rootScope, $http) {
    var employeeUri = PATH + "/api/employee";
    var userUri = PATH + "/api/user";

    function initUser(props) {
        var user = $.extend({}, props || {roles: ''});
        user.isClub = function() {
            return user.isAdmin() || user.isClub() || user.isExpert() || user.isOperator();
        };
        user.isAdmin = function() {
            return this.roles.indexOf('admin') >= 0;
        };
        user.isClub = function() {
            return this.roles.indexOf('club') >= 0;
        };
        user.isExpert = function() {
            return this.roles.indexOf('expert') >= 0;
        };
        user.isOperator = function() {
            return this.roles.indexOf('operator') >= 0;
        };
        return user;
    };

    return {
        get: function(username) {
            return $http({
                method: 'GET',
                cache: false,
                url: employeeUri + "?username=" + username
            }).then(function(res) {
                if (res.data.datas && res.data.datas.length === 1) {
                    return initUser(res.data.datas[0]);
                } else {
                    return null;
                }
            }, function() {
                return null;
            });
        },
        update: function(employee) {
            var data = $.extend({}, employee);
            delete data.isClub;
            delete data.isAdmin;
            delete data.isClub;
            delete data.isExpert;
            delete data.isOperator;
            delete data.version;
            return $http({
                method: 'PUT',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                data: $.param(data),
                url: employeeUri + '/' + employee.id
            });
        },
        updatePassword: function(id, oldpwd, newpwd) {
            return $http({
                method: 'PUT',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                data: $.param({oldPassword: oldpwd, newPassword: newpwd}),
                url: employeeUri + '/' + id + '/password'
            }).then(function(res) {
                return res.data.token;
            }, function() {
                return null;
            });
        },
        resetPassword: function(id) {
            return this.updatePassword(id, '', '');
        },
        updateUser: function(user) {
            var data = $.extend({}, user);
            delete data.isClub;
            delete data.isAdmin;
            delete data.isClub;
            delete data.isExpert;
            delete data.isOperator;
            delete data.version;
            delete data.username;
            delete data.mobile;
            return $http({
                method: 'PUT',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                data: $.param(data),
                url: userUri + '/' + user.id
            });
        },
        updateUserPassword: function(id, oldpwd, newpwd) {
            return $http({
                method: 'PUT',
                headers:{'Content-Type':'application/x-www-form-urlencoded'},
                data: $.param({oldPassword: oldpwd, newPassword: newpwd}),
                url: userUri + '/' + id + '/password'
            }).then(function(res) {
                return res.data.token;
            }, function() {
                return null;
            });
        },
        heartbeat: function(employee) {
            return $http({
                method: 'GET',
                url: employeeUri + '/' + employee.id + '/live'
            });
        }
    };
});
});