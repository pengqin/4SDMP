var utils = require("./utils");

module.exports = function(webot) {
    webot.loads("4sdmp", "gateway");//, "gateway", "member", "coacher");

    // 默认欢迎词
    webot.set('greeting', {
        pattern: function() {
            return true;
        },
        handler: function(info, next) {
            var messages = [
                "欢迎使用4S店营销平台。回复数字使用相应功能：",
                "【1】 个人设置",
                "【2】 预约服务",
                "【3】 交易服务",
                "【4】 行车助手",
                "【5】 资讯活动",
            ];
            next(null, messages.join("\n"));
        }
    });

    // 定义club域, 检查健身会所是否激活
    //webot.beforeReply(utils.ensure_club_is_bind);
}