var utils = require("./utils");

module.exports = function(webot) {
	webot.loads("4sdmp", "club");//, "gateway", "member", "coacher");

	// 默认欢迎词
	webot.set('greeting', {
		pattern: function() {
			return true;
		},
		handler: function(info, next) {
			if (info.session.club) {
				next("欢迎使用" + info.session.club.name + "微信服务。");
			} else {
				next("欢迎使用本健身会所微信服务。");
			}
		}
	});

    // 定义club域, 检查健身会所是否激活
    webot.beforeReply(utils.ensure_club_is_bind);
}