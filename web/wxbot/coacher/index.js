/**
 * Usage:
 * - 会员功能
 * Author:
 * hopesfish at 163.com
 */
var utils = require("../utils");

module.exports = function(webot) {
	webot.loads("message", "image", "record");

    webot.domain("coacher", utils.ensure_coacher_is_register);
}