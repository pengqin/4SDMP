/**
 * Usage:
 * - 教练留言功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");
var MessageServices = require("../../services/MessageServices");

module.exports = function(webot) {
    // 等待留言输入
    webot.waitRule('coacher message input', function(info, next) {
        if (info.is("event")) {
            delete info.session.coacher.messages;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("coacher message input");
            return next(null, "抱歉，只能输入文字。");
        }
        if (info.session.coacher) {
            // 接受提交指令
            if (info.text === '好') {
                if (!info.session.coacher.messages || info.session.coacher.messages.length == 0) {
                    utils.operation_is_failed(info, next);
                    info.rewait("coacher message input");
                    return next(null, "您还没输入文字，请留言：");
                }
                info.wait("coacher message top");
                return next(null, "您是否需要置顶这条消息，使会员们每天可见？\n回复【1】代表是\n回复【2】代表否");
            }
            // 接受取消指令
            if (info.text === '不') {
                delete info.session.coacher.messages;
                return next(null, "留言已取消，如需留言请再次点击【发布留言】。");
            }
            // 构造message
            if (!info.session.coacher.messages) {
                info.session.coacher.messages = [];
            }
            info.session.coacher.messages.push(info.text);
            info.wait("coacher message input");
            return next(null, "已存成草稿，您可继续输入文字。\n发送【好】完成文字输入，发送【不】取消发布");
        } else {
            return next(null, "后台异常，请重新发起操作。");
        }
    });

    // 是否置顶
    webot.waitRule('coacher message top', function(info, next) {
        if (info.is("event")) {
            delete info.session.coacher.messages;
            return next();
        }
        if (!info.is("text")) {
            utils.operation_is_failed(info, next);
            info.rewait("coacher message top");
            return next(null, "抱歉，只能输入文字。");
        }
        if ((info.text + '') !== '1' && (info.text + '') !== '2') {
            utils.operation_is_failed(info, next);
            info.rewait("coacher message top");
            return next(null, "抱歉，只能输入数字1或者2。");
        }
        if (info.session.coacher) {
            var top = '0';
            if (info.text === '1') { // 置顶
                top = '1';
            }
            // TODO 消息入库
            console.info(info.session.coacher.messages);
            // 消息入库
            MessageServices.create(info.session.coacher, {
                title: '',
                content: info.session.coacher.messages.join(" "),
                type: '1',
                top: top
            }).then(function() {
                var text = ejs.render(
                    '留言已提交！\n<a href="<%- url%>">请点击这里，查看</a>或者点击菜单【留言板】', 
                    {
                        url: conf.site_root + '/front/message' //?shoolId' + info.session.club.id +' &coacherId=' + info.session.coacher.id
                    }
                );
                return next(null, text);
            }, function() {
                next(null, "抱歉，后台异常，无法提交留言。");
            });
            delete info.session.coacher.messages;
            return;
        } else {
            return next(null, "后台异常，请重新发起操作。");
        }
    });
}