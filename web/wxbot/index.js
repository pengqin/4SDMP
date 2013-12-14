var ejs = require('ejs');
var utils = require("./utils");
var conf = require('../conf');

module.exports = function(webot) {
    webot.loads("4sdmp", "gateway");//, "gateway", "member", "coacher");

    // 默认欢迎词
    webot.set('greeting', {
        pattern: function() {
            return true;
        },
        handler: function(info, next) {
            var link = ejs.render(
                    '<a href="<%- url%>">点击这里了解最新车讯</a>\n', 
                    {
                        url: conf.site_root + '/wap/store/1'
                    }
                );
            var messages = [
                "感谢您使用本店微信服务",
                link,
                "回复数字使用本店服务：",
                "【1】 预约服务",
                "【2】 交易服务",
                "【3】 行车助手",
                "【4】 本店介绍",
                "【5】 个人设置",
                "\n电话：010-88888888 欢迎您的垂询",
            ];
            next(null, messages.join("\n"));
        }
    });

    // 定义club域, 检查健身会所是否激活
    //webot.beforeReply(utils.ensure_club_is_bind);
}