var Q = require("q");
var fs = require('fs');
var conf = require("../../conf");
var ClubServices = require("../../services/ClubServices");
var request = require('request');
var restful = require('node-restful');

function ensure_club_is_bind (info, next) {
    if (info.session.failedCount === 5) {
        delete info.session.failedCount;
        info.ended = true;
        return next("抱歉，您的错误操作太多，请仔细阅读帮助文字。");
    }

    if (info.session.club) {
        return next();
    }

    if (info.is("text") && info.text.indexOf("CLUBBIND") >= 0) {
        return next();
    }

    ClubServices.queryByOpenId(info.sp).then(function(club) {
        if (club && club.enabled) {
            return next("抱歉，该健身会所的微信服务已被停用。");
        } else {
            info.session.club = club;
            return next();
        }
    }, function() {
        info.ended = true;
        return next("抱歉，该健身会所的微信服务尚未激活。");
    });
}

function mobile_input_prompt(info, next) {
    info.ended = true;
    next("抱歉，本功能仅供本会所会员及教练使用。\n如需认证，请回复文字【认证】及您的【手机号】，如：认证13812345678");
}
function ensure_user_is_register (info, next) {
    //if (info.session.member || info.session.coacher) { return next(); }

    info.session.user = {mobile: 13812345678};
    next();
    /*
    UserServices.queryByOpenId({clubOpenId: info.sp, userOpenId: info.uid}).then(function(user) {
        switch(user.type + '') {
        case '0':
            info.session.member = user;
            return next();
        break;
        case '1':
            info.session.coacher = user;
            return next();
        break;
        default:
            return mobile_input_prompt(info, next);
        break;
        }
    }, function() {
        return mobile_input_prompt(info, next);
    });*/
}

function ensure_member_is_register (info, next) {
    if (info.session.member) {
        return next();
    } else {
        info.ended = true;
        return next("抱歉，您还不是该健身会所的认证会员。");
    }
}

function ensure_coacher_is_register (info, next) {
    if (info.session.coacher) {
        return next();
    } else {
        info.ended = true;
        return next("抱歉，您还不是该健身会所的认证教练。");
    }
}

function operation_is_failed(info, next) {
    if (info.session.failedCount) {
        info.session.failedCount += 1;
    } else {
        info.session.failedCount = 1;
    }
}

function download_image(picUrl, localFile) {
    request.head(picUrl, function(err, res, body){
        //console.log('content-type:', res.headers['content-type']);
        //console.log('content-length:', res.headers['content-length']);

        request(picUrl).pipe(fs.createWriteStream(conf.upload_root + '/' + localFile));
    });
}

// Export校验功能函数
module.exports.ensure_club_is_bind = ensure_club_is_bind;

module.exports.ensure_user_is_register = ensure_user_is_register;

module.exports.ensure_member_is_register = function (info, next) {
    if (info.session.club && info.session.member) { return next(); }

    if (!info.session.club) {
	    ensure_club_is_bind(info, next);
    } else {
    	ensure_member_is_register(info, next);
    }
}

module.exports.ensure_coacher_is_register = function (info, next) {
    if (info.session.club && info.session.coacher) { return next(); }

    if (!info.session.club) {
        ensure_club_is_bind(info, next);
    } else {
        ensure_coacher_is_register(info, next);
    }
}

module.exports.operation_is_failed = operation_is_failed;

module.exports.download_image = download_image;


