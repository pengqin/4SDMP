/**
 * Usage:
 * - 网关入口
 * Author:
 * hopesfish at 163.com
 */
var utils = require("../utils");

module.exports = function(webot) {
	webot.loads("profile", "reservation");

    // 定义gateway/member/coacher域, 将判断该用户是否可以进行激活操作
    webot.domain("gateway", utils.ensure_user_is_register);
}