/**
 * Usage:
 * - 个人设置模块
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function trade_features(info, next) {
    var user = info.session.user, t = conf.debug ? (new Date()).getTime() : '';
    return next(null, [{
        title: '购车指导',
        url: conf.site_root + '/wap/trade/guide?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/trade.png?' + t,
        description: '购车指导'
    }, {
        title: '车贷需知',
        url: conf.site_root + '/wap/trade/loan?mobile='  + user.mobile,
        picUrl: conf.site_root + '/wap/images/trade_loan.png?' + t,
        description: '车贷需知'
    }, {
        title: '现车查询',
        url: conf.site_root + '/wap/trade/care?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/trade_stock.png?' + t,
        description: '现车查询'
    }, {
        title: '二手车服务',
        url: conf.site_root + '/wap/trade/insurance?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/trade_sechand.png?' + t,
        description: '二手车服务'
    }, {
        title: '车辆置换',
        url: conf.site_root + '/wap/trade/replace?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/trade_replace.png?' + t,
        description: '车辆置换'
    }, {
        title: '精品超市',
        url: conf.site_root + '/wap/trade/market?mobile' + user.mobile,
        picUrl: conf.site_root + '/wap/images/trade_market.png?' + t,
        description: '精品超市'
    }]);
}

module.exports = function(webot) {
	// 修改购车指导提示语
	webot.set('user trade links start by text', {
		domain: "gateway",
		pattern: /^(2|二|交易|二手|车贷)/i,
		handler: trade_features
	});
	webot.set('user trade links start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'TRADE';
		},
		handler: trade_features
	});
}