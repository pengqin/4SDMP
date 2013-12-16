/*
 * GET register page.
 */
var user = {mobile: '13811749917'};
exports.index = function(req, res){
 	res.render('wap/profile/index', {title: "个人资料", user: user});
};
exports.password = function(req, res){
 	res.render('wap/profile/password', {title: "修改密码", user: user});
};
exports.reservation = function(req, res){
 	res.render('wap/profile/reservation', {title: "我的预约", user: user});
};
exports.reminder = function(req, res){
 	res.render('wap/profile/reminder', {title: "我的提醒", user: user});
};