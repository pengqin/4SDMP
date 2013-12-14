/**
 * Usage:
 * - 个人设置模块
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function profile_features(info, next) {
    return next(null, [{
        title: '个人资料',
        url: conf.site_root + '/wap/profile/index',
        picUrl: conf.site_root + '/wap/images/profile.png',
        description: '个人资料'
    }, {
        title: '密码修改',
        url: conf.site_root + '/wap/profile/password',
        picUrl: conf.site_root + '/wap/images/profile_icon.png',
        description: '密码修改'
    }, {
        title: '提醒服务',
        url: conf.site_root + '/wap/profile/reminder',
        picUrl: conf.site_root + '/wap/images/profile_icon.png',
        description: '提醒服务'
    }]);
}

module.exports = function(webot) {
	// 修改个人资料提示语
	webot.set('user profile links start by text', {
		domain: "gateway",
		pattern: /^(1|个人设置)/i,
		handler: profile_features
	});
	webot.set('user profile links start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'PROFILE';
		},
		handler: profile_features
	});
}