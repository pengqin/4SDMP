/**
 * Usage:
 * - 消息功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var MessageServices = require("../../services/MessageServices");

function add_message_start(info, next) {
    if (info.session.member) {
        var prompt = "通过这里输入的文字将直接显示在班级留言板上，仅有您和教练可见，需在" + conf.timeout.desc + "内完成该项操作。\n\n请输入您想对教练说的话：";
        info.wait("member message input");
        return next(null, prompt);
    } else if (info.session.coacher) {
        var prompt = "通过这里输入的文字将直接显示在班级留言墙上，您所在班级所有会员和教练可见，需在" + conf.timeout.desc + "内完成该项操作。\n\n请输入您想对会员们说的话：";
        info.wait("coacher message input");
        return next(null, prompt);
    } else {
        return next(null, "抱歉，您不是认证用户，不能发布消息！");
    }
};

function view_message(info, next) {
    if (info.session.member === undefined && info.session.coacher === undefined) {
        return next(null, "抱歉，您不是认证用户，不能查看消息！");
    }

    MessageServices.query(info.session.member || info.session.coacher).then(function(count) {
        var text =  ejs.render(
            '<% if (count !== 0) { %>您有条<%= count%>未读消息。\n<%}%><a href="<%- url%>">请点击这里查看消息</a>', 
            {
                count: count,
                url: conf.site_root + '/front/message'
            }
        )
        next(null, text);
    }, function(err) {
        var text =  ejs.render(
            '后台异常，无法查询未读消息条目。\n<a href="<%- url%>">请点击这里查看消息</a>', 
            {
                url: conf.site_root + '/front/message'
            }
        )
        next(null, text);
    });
}

module.exports = function(webot) {
    // 消息提示语
    webot.set('user message start by text', {
        domain: "gateway",
        pattern: /^(消息|(leave )?message)/i,
        handler: add_message_start
    });
    webot.set('user message start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'MESSAGE_ADD';
        },
        handler: add_message_start
    });

    // 查看消息
    webot.set('user message view start by text', {
        domain: "gateway",
        pattern: /^(查看消息|(view )?message|我的消息)/i,
        handler: view_message
    });
    webot.set('user message view start by event', {
        domain: "gateway",
        pattern: function(info) {
            return info.param.eventKey === 'MESSAGE_VIEW';
        },
        handler: view_message
    });
}