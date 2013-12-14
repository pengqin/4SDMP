/**
 * Usage:
 * -激活会员/教练
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var UserServices = require("../../services/UserServices");
var utils = require("../utils");

module.exports = function(webot) {
	var failed = '认证失败，如未录入您的手机号，请联系健身会所IT管理员。';
	var registered = '您已经是本会所认证用户，无需再次认证。';

    // 认证用户
	webot.set('user register start by text', {
		pattern: /^认证1\d{10}$/i,
		handler: function(info, next) {
			var mobile = info.text.substring('认证'.length);

			if (info.session.member || info.session.coacher) {
				return next(null, registered);
			}

	        // 用手机号去用户表查询,如果获得结果就返回相应激活页面链接
		    UserServices.queryByMobile(mobile).then(function(user) {
		    	if (user) {
		    		var username = user.username + '';
		    		if (username !== mobile) {
		    			info.session.mobile = mobile;
			    		info.wait("user register profile image");
			    		return next(null, "请上传您的头像图片：");
		    		} else {
		    			return next(null, registered);
		    		}
		    	} else {
		    		return next(null, failed);
		    	}
		    }, function() {
		        return next(null, failed);
		    });
		}
	});

	webot.waitRule('user register profile image', function(info, next) {
		if (!info.is("image")) {
			info.rewait("user register profile image");
			return next(null, "抱歉，只能上传图片。");
		}else {
			var mobile = info.session.mobile;
		    UserServices.queryByMobile(mobile).then(function(user) {
		    	if (user) {
		    		var username = user.username + '';
		    		if (username !== mobile) {
		    			var filename = mobile + '_profile_' + (new Date()).getTime();// + extra;
		    			utils.download_image(info.param.picUrl, filename);
		    			delete info.session.mobile;
		    			var text = ejs.render(
							'请点击<a href="<%- url%>">认证链接</a>完成用户认证操作。', 
							{url: conf.site_root + '/user/mobileRegister?mobile=' + mobile + '&openId=' + info.uid + '&profileImage=' + filename}
						);
						console.info(text);
			    		return next(null, text);
		    		} else {
		    			return next(null, registered);
		    		}
		    	} else {
		    		return next(null, failed);
		    	}
		    }, function() {
		        return next(null, failed);
		    });
		}
	});
}