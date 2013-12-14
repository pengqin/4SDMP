/*
 * GET register page.
 */
exports.index = function(req, res){
 	res.render('wap/profile/index', {title: "个人资料"});
};
exports.password = function(req, res){
 	res.render('wap/profile/password', {title: "修改密码"});
};
exports.reminder = function(req, res){
 	res.render('wap/profile/reminder', {title: "提醒服务"});
};