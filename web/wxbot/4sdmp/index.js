/**
 * 用途:
 * 1 介绍微笑服务信息
 */
module.exports = function(webot) {
	// 介绍4sdmp
	webot.set('4sdmp greeting', {
		pattern: /^4sdmp$/i,
		handler: function(info, next) {
			next("4S数字营销平台!");
		}
	});
	// 介绍weexiao
	webot.set('4sdmp brithday', {
		pattern: /^软件生日$/i,
		handler: function(info, next) {
			next("和玉兔登录月球同一天哦!19.51°W 44.12°N");
		}
	});
}