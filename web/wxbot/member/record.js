/**
 * Usage:
 * - 发布亲子记录功能
 * Author:
 * - hopesfish at 163.com
 */
var ejs = require('ejs');
var conf = require('../../conf');
var utils = require("../utils");

module.exports = function(webot) {
	// 等待主题输入
	webot.waitRule('member kid record select type', function(info, next) {
        if (info.is("event")) {
            return next();
        }
		if (!info.is("text")) {
			info.rewait("member kid record image text");
			return next(null, "抱歉，只能输入文字。");
		}
		var text = info.text + '';
        if (text !== '1' && text !== '2') {
            info.rewait("member kid record select type");
            return next(null, "抱歉，只能输入数字1或者2。");
        }
        switch(text) {
        case "1":
        	info.wait("member kid record input text");
        	return next(null, "通过这里输入的文字记录将直接显示在记录时间轴上，仅有您和本班教练可见。\n\n请输入文字：");
        break;
        case "2":
        	info.wait("member kid record image text");
        	return next(null, "通过这里上传的图片记录将直接显示在记录时间轴上，仅您和本班教练可见。\n\n上传照片前，请先输入主题文字，简单描述一下您要发布的照片内容。例如“和孩子一起读书” “集体户外游戏小青蛙跳荷叶”等。\n\n请输入主题：");
        default:
        	info.rewait("member kid record select type");
        	return next(null, "抱歉，只能输入数字1或者2。");
        }
	});

    // 等待文字记录输入
    webot.waitRule('member kid record input text', function(info, next) {
        if (info.is("event")) {
            delete info.session.member.records;
            return next();
        }
        if (!info.is("text")) {
            info.rewait("member kid record input text");
            return next(null, "抱歉，只能输入文字。");
        }
        if (info.session.member) {
            // 接受提交指令
            if (info.text === '好') {
                if (!info.session.member.records || info.session.member.records.length == 0) {
                    info.rewait("member kid record input text");
                    return next(null, "您还没输入文字，请输入文字：");
                }
                // TODO 消息入库
                console.info(info.session.member.records);
                delete info.session.member.records;
                var response = ejs.render(
		            '发布成功，\n<a href="<%- url%>">请点击这里，查看成长记录</a>', 
		            {
		                url: conf.site_root + '/record?memberId=' + info.session.member.id
		         	}
	         	);
                return next(null, response);
            }
            // 接受取消指令
            if (info.text === '不') {
                delete info.session.member.records;
                return next(null, "操作已取消，如需再次发布请再次点击【发布亲子记录】。");
            }
            // 构造message
            if (!info.session.member.records) {
                info.session.member.records = [];
            }
            info.session.member.records.push(info.text);
            info.wait("member kid record input text");
            return next(null, "已存成草稿，您可继续输入文字。\n\n发送【好】提交文字记录\n发送【不】取消");
        }
    });

	// 等待图片记录的主题输入
	webot.waitRule('member kid record image text', function(info, next) {
        if (info.is("event")) {
            delete info.session.member.imageRecord;
            return next();
        }
		if (!info.is("text")) {
			utils.operation_is_failed(info, next);
			info.rewait("member kid record image text");
			return next(null, "抱歉，只能输入文字。");
		}
		// 构造image
		info.session.member.imageRecord = {title: '', urls: []};
		info.session.member.imageRecord.title = info.text;
		info.wait("member kid record image upload");
		return next(null, "主题【" + info.text + "】创建成功，请选择您要上传的图片：");
	});

	// 等待图片记录
	webot.waitRule('member kid record image upload', function(info, next) {
        if (info.is("event")) {
            delete info.session.member.imageRecord;
            return next();
        }
		// 接受提交指令
		if (info.is("text") && info.text === '好') {
			if (info.session.member.imageRecord.urls.length == 0) {
				utils.operation_is_failed(info, next);
				info.rewait("member kid record image upload");
				return next(null, "您还没上传图片，请上传：");
			}
			// TODO 上传图片
			var title = info.session.member.imageRecord.title;
			console.info(info.session.member.imageRecord);
			delete info.session.member.imageRecord;
            var response = ejs.render(
	            '发布成功，\n<a href="<%- url%>">请点击这里，查看成长记录</a>', 
	            {
	                url: conf.site_root + '/record?memberId=' + info.session.member.id
	         	}
         	);
            return next(null, response);
		}
		// 接受取消指令
		if (info.is("text") && info.text === '不') {
			delete info.session.member.imageRecord;
			return next(null, "操作已取消，如需发布请再次点击【添加亲子记录】。");
		}

		if (!info.is("image")) {
			utils.operation_is_failed(info, next);
			info.rewait("member kid record image upload");
			return next(null, "抱歉，只能上传图片。");
		} else {
			// 构造image
			if (info.session.member.imageRecord) {
				info.session.member.imageRecord.urls.push(info.param.picUrl);
			}
			info.wait("member kid record image upload");
			var len = info.session.member.imageRecord.urls.length;
			return next(null, "已存草稿图片" + len + "张，您可继续上传图片。\n\n发送【好】发布图片记录\n发送【不】取消");
		}
	});
}