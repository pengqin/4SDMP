/*
 * GET register page.
 */
var user = {mobile: '13811749917'};
exports.index = function(req, res){
 	res.render('wap/reservation/index', {title: "预约试驾", user: user, header: req.query.header === 'hide' ? false : true});
};
exports.repair = function(req, res){
 	res.render('wap/reservation/undone', {title: "预约维修", user: user});
};
exports.care = function(req, res){
 	res.render('wap/reservation/undone', {title: "预约保养", user: user});
};
exports.insurance = function(req, res){
 	res.render('wap/reservation/undone', {title: "预约维保套餐", user: user});
};
exports.refit = function(req, res){
 	res.render('wap/reservation/undone', {title: "预约改装", user: user});
};
exports.peds = function(req, res){
 	res.render('wap/reservation/undone', {title: "预约定损", user: user});
};