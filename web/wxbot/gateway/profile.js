/**
 * Usage:
 * - 个人设置模块
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function profile_features(info, next) {
    var user = info.session.user, t = conf.debug ? (new Date()).getTime() : '';
    return next(null, [{
        title: '个人资料',
        url: conf.site_root + '/wap/profile/' + user.mobile + 'index',
        picUrl: conf.site_root + '/wap/images/profile.png?' + t,
        description: '个人资料'
    }, {
        title: '密码修改',
        url: conf.site_root + '/wap/profile/'  + user.mobile +  '/password',
        picUrl: conf.site_root + '/wap/images/profile_pwd.png?' + t,
        description: '密码修改'
    }, {
        title: '提醒服务',
        url: conf.site_root + '/wap/profile/' + user.mobile + '/reminder',
        picUrl: conf.site_root + '/wap/images/profile_reminder.png?' + t,
        description: '提醒服务'
    }]);
}

module.exports = function(webot) {
	// 修改个人资料提示语
	webot.set('user profile links start by text', {
		domain: "gateway",
		pattern: /^(5|设置)/i,
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