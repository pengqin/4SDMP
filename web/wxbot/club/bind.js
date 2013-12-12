/**
 * Usage:
 * 实现场所的激活功能(需要把toUserName和场所标识绑定起来)
 * Author:
 * hopesfish at 163.com
 */
var ClubServices = require("../../services/ClubServices");
module.exports = function(webot) {
	webot.set('club bind', {
		pattern: /^CLUBBIND-.*$/i,
		handler: function(info, next) {
			if (!info.is("text")) { next(); }
			if (info.session.club) { next(); }

			var uid = info.text.substring('CLUBBIND-'.length);
			ClubServices.bind(uid, info.sp).then(function(club) {
				info.session.club = club;
				next(null, club.name + "绑定成功。");
			}, function(err) {
				throw err;
			}).fail(function(err) {
				next(null, err.message || err);
			});
		}
	});
}