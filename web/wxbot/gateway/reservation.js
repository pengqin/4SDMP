/**
 * Usage:
 * - 个人设置模块
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function reservation_features(info, next) {
    var user = info.session.user, t = conf.debug ? (new Date()).getTime() : '';
    return next(null, [{
        title: '预约试驾',
        url: conf.site_root + '/wap/reservation/index?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/reservation.png?' + t,
        description: '预约试驾'
    }, {
        title: '预约维修',
        url: conf.site_root + '/wap/reservation/repair?mobile='  + user.mobile,
        picUrl: conf.site_root + '/wap/images/reservation_repair.png?' + t,
        description: '预约维修'
    }, {
        title: '预约保养',
        url: conf.site_root + '/wap/reservation/care?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/reservation_care.png?' + t,
        description: '预约保养'
    }, {
        title: '预约维保套餐',
        url: conf.site_root + '/wap/reservation/insurance?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/reservation_insurance.png?' + t,
        description: '预约维保套餐'
    }, {
        title: '预约改装',
        url: conf.site_root + '/wap/reservation/refit?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/reservation_refit.png?' + t,
        description: '预约改装'
    }, {
        title: '预约定损',
        url: conf.site_root + '/wap/reservation/peds?mobile' + user.mobile,
        picUrl: conf.site_root + '/wap/images/reservation_peds.png?' + t,
        description: '预约定损'
    }]);
}

module.exports = function(webot) {
	// 修改预约试驾提示语
	webot.set('user reservation links start by text', {
		domain: "gateway",
		pattern: /^(1|一|预约)/i,
		handler: reservation_features
	});
	webot.set('user reservation links start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'RESERVATION';
		},
		handler: reservation_features
	});
}