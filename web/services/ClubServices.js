var Q = require("q");
var wechat = require('wechat');
var rest = require('restler');
var conf = require("../conf");

/*
 * 获得记录
 */
function get(id) {
    var deferred = Q.defer();

    rest.get(conf.site_root + '/api/club/' + id).on('complete', function(data, response) {
        if (response.statusCode == 200) {
            deferred.resolve(data);
        } else {
            deferred.reject({});
        }
    });

    return deferred.promise;
}
exports.get = get;
/*
 * 更新数据
 */
function update(obj) {
    var deferred = Q.defer();

    rest.put(conf.site_root + '/api/club/' + obj._id, {
        data: obj
    }).on('complete', function(data, response) {
        if (response.statusCode == 200) {
            deferred.resolve(true);
        } else {
            deferred.reject(false);
        }
    });

    return deferred.promise;
};
exports.update = update;

/*
 * 返回绑定的场所
 */
var queryByOpenId = function(openId) {
    var deferred = Q.defer();

    rest.get(conf.site_root + '/api/club?openId=' + openId).on('complete', function(datas, response) {
        if (response.statusCode == 200 && datas.length === 1) {
            deferred.resolve(datas[0]);
        } else {
            deferred.reject(new Error("not found with " + openId));
        }
    });

    return deferred.promise;
};
exports.queryByOpenId = queryByOpenId;
/**
 * 和微信账号绑定
 */
exports.bind = function(_id, openId) {
    var deferred = Q.defer(), gbclub;

    if(!_id) {
        deferred.reject({status: 400, message: "激活标识未提供。"});
    }

    if(!openId) {
        deferred.reject({status: 400, message: "微信ID未提供。"});
    }

    queryByOpenId(openId).then(function(clubs) {
        if (clubs.length > 0) {
            throw new Error("该微信账号已经绑定健身会所。");
        }
    }, function() {
        return get(_id);
    })
    .then(function(club) {
        if (club && club.openId) {
            throw new Error("该健身会所已经绑定微信账号。");
        } else {
            club.openId = openId;
            gbclub = club;
            return update(club);
        }
    }).then(function() {
        deferred.resolve(gbclub);
    }).fail(function(err) {
        deferred.reject({status: 500, message: err.message});
    });

    return deferred.promise;
}

/**
 * init the id
 */
function initMenu(clubId) {
    return {
        "button":[{
            "name":"会所介绍",
            "sub_button":[{  
                "type": "view",
                "name": "会所向导",
                "url": conf.site_root + "/front/" + clubId
            }, {  
                "type": "view",
                "name": "每周食谱",
                "url": conf.site_root +  "/front/dinner/" + clubId
            }, {  
                "type": "click",
                "name": "课程安排",
                "key": "COURSE_VIEW"
            }, {  
                "type": "view",
                "name": "重要通知",
                "url": conf.site_root +  "/front/notice/" + clubId
            }]
        }, {
            "name":"会员地带",
            "sub_button":[{  
                "type": "click",
                "name": "预约课程",
                "key": "MESSAGE_ADD"
            }, {
                "type": "click",
                "name": "体检记录",
                "key": "KID_RECORD_VIEW"
            }, {  
                "type": "click",
                "name": "修改个人资料",
                "key": "PROFILE_EDIT"
            }, {
                "type": "click",
                "name": "修改密码",
                "key": "PASSWORD_EDIT"
            }]
        }]
    }
}
/**
 * Sync the menu to weixin
 */
exports.syncWeixinMenu = function(_id, configs) {
    var deferred = Q.defer();

    if (!configs.appId) {
        deferred.reject({error: 'app id is required.'});
    }
    if (!configs.appSecret) {
        deferred.reject({error: 'app secret is required.'});
    }

    var API = wechat.API;
    var api = new API(configs.appId, configs.appSecret);

    api.getAccessToken(function(err, result) {
        if (err) {
            return deferred.reject(err);
        }
        console.info(initMenu(_id).button[0]);
        api.createMenu(initMenu(_id), function(err, result) {
            if (err) {
                return deferred.reject(err);
            }
            deferred.resolve(result);
        });
    });

    return deferred.promise;
}