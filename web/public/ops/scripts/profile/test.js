'use strict';
define(function(require, exports) {

    var testProfileAsClub = require("./test/profile.js").test;
    var testProfileAsUser = require("./test/uprofile.js").test;

    exports.testProfile = function(mocha, angluarjs, services) {
        if (!runCase('profile')) {
            return;
        }

        // 个人资料编辑功能
        runCaseAs('admin') ? testProfileAsClub({
            it: mocha.it,
            user: {username: TESTCONFIGS.admin.username, password: TESTCONFIGS.admin.password}
        }, angluarjs, services) : null;

        runCaseAs('club') ? testProfileAsClub({
            it: mocha.it,
            user: {username: TESTCONFIGS.club.username, password: TESTCONFIGS.club.password}
        }, angluarjs, services) : null;

        runCaseAs('expert') ? testProfileAsClub({
            it: mocha.it,
            user: {username: TESTCONFIGS.expert.username, password: TESTCONFIGS.expert.password}
        }, angluarjs, services) : null;

        runCaseAs('operator') ? testProfileAsClub({
            it: mocha.it,
            user: {username: TESTCONFIGS.operator.username, password: TESTCONFIGS.operator.password}
        }, angluarjs, services) : null;

        runCaseAs('user') ? testProfileAsUser({
            it: mocha.it,
            user: {username: TESTCONFIGS.user.username, password: TESTCONFIGS.user.password}
        }, angluarjs, services) : null;
    };

});