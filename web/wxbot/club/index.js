/**
 * 用途:
 * 1 将微信账号和健身会所标识绑定起来
 * 2 返回健身会所介绍信息
 */
var utils = require("../utils");

module.exports = function(webot) {

    // 除了bind,其他服务都必须在club域下面
    webot.loads("bind", "intro");

    // 定义club域, 检查健身会所是否激活
    webot.domain("club", utils.ensure_club_is_bind);
}