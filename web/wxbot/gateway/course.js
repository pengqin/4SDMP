/**
 * Usage:
 * - 课程安排功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');

function course_view(info, next) {
    var text = "抱歉，您不是认证用户，不能查看课程安排！";
    if (info.session.member) {
        text = ejs.render(
            '<a href="<%- url%>">请点击这里查看课程安排</a>', 
            {
                //name: info.session.member.name,
                url: conf.site_root + '/course?memberId=' + info.session.member.id
            }
        )
    } else if (info.session.coacher) {
        text = ejs.render(
            '<a href="<%- url%>">请点击这里查看课程安排</a>', 
            {
                name: info.session.coacher.name,
                url: conf.site_root + '/course?coacherId=' + info.session.coacher.id
            }
        )
    }
    return next(null, text);
}

module.exports = function(webot) {
	// 修改个人资料提示语
	webot.set('user course view start by text', {
		domain: "gateway",
		pattern: /^(课程安排|(view )?course)/i,
		handler: course_view
	});
	webot.set('user course view start by event', {
		domain: "gateway",
		pattern: function(info) {
			return info.param.eventKey === 'COURSE_VIEW';
		},
		handler: course_view
	});
}