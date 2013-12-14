/**
 * Usage:
 * - 个人设置模块
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function helper_gateway(info, next) {
    var text = [
        "如需\n【周边服务】\n【前往本店】\n【紧急救援】\n等服务请回复您的位置\n",
        "如需\n【违章查询】\n【出行出游】\n【车险指南】\n【指示灯大全】\n【配件真伪查询】\n等服务请回复数字【1】"
    ];
    info.wait("user upload position");
    return next(null, text.join("\n"));
}

function helper_position(info, next) {
    var user = info.session.user, t = conf.debug ? (new Date()).getTime() : '';
    return next(null, [{
        title: '周边服务',
        url: conf.site_root + '/wap/helper/guide?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/helper.png?' + t,
        description: '周边服务'
    }, {
        title: '前往本店',
        url: conf.site_root + '/wap/helper/loan?mobile='  + user.mobile,
        picUrl: conf.site_root + '/wap/images/helper_loan.png?' + t,
        description: '前往本店'
    }, {
        title: '紧急救援',
        url: conf.site_root + '/wap/helper/care?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/helper_stock.png?' + t,
        description: '紧急救援'
    }]);
}

function helper_normal(info, next) {
    var user = info.session.user, t = conf.debug ? (new Date()).getTime() : '';
    return next(null, [{
        title: '违章查询',
        url: conf.site_root + '/wap/helper/guide?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/helper.png?' + t,
        description: '违章查询'
    }, {
        title: '出行出游',
        url: conf.site_root + '/wap/helper/loan?mobile='  + user.mobile,
        picUrl: conf.site_root + '/wap/images/helper_loan.png?' + t,
        description: '出行出游'
    }, {
        title: '车险指南',
        url: conf.site_root + '/wap/helper/care?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/helper_stock.png?' + t,
        description: '车险指南'
    }, {
        title: '指示灯大全',
        url: conf.site_root + '/wap/helper/insurance?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/helper_sechand.png?' + t,
        description: '指示灯大全'
    }, {
        title: '配件真伪查询',
        url: conf.site_root + '/wap/helper/replace?mobile=' + user.mobile,
        picUrl: conf.site_root + '/wap/images/helper_replace.png?' + t,
        description: '配件真伪查询'
    }]);
}

module.exports = function(webot) {
	// 修改违章查询提示语
	webot.set('user helper links start by text', {
		domain: "gateway",
		pattern: /^(3|三|出行|助手)/i,
		handler: helper_gateway
	});
	webot.set('user helper links start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'TRADE';
		},
		handler: helper_gateway
	});
    webot.waitRule('user upload position', function(info, next) {
        if (info.is("location")) {
            return helper_position(info, next);
        } else {
            return helper_normal(info, next);
        }
    });
}