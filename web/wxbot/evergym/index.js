/**
 * 用途:
 * 1 介绍微笑服务信息
 */
module.exports = function(webot) {
	// 介绍4sdmp
	webot.set('4sdmp greeting', {
		pattern: /^4sdmp$/i,
		handler: function(info, next) {
			next("永远健康!");
		}
	});
}