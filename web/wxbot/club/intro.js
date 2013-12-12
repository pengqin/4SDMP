/**
 * Usage:
 * 实现场所的介绍功能,需场所先绑定
 * Author:
 * hopesfish at 163.com
 */
module.exports = function(webot) {
	webot.set('club intro', {
		domain: "club",
		pattern: /^(CLUBINTRO|(学校)?介绍)/i,
		handler: function(info, next) {
			next(null, "场所介绍");
		}
	});
}