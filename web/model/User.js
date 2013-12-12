var crypto = require('crypto');
var restful = require('node-restful');
var mongoose = restful.mongoose, Schema = mongoose.Schema;
var User;

module.exports = function(mongoose) {
	if (!User) { 
		User = restful.model('User', mongoose.Schema({
			mobile  :  { type: String, index: true, unique: true}, // 手机号,账号
			password:  { type: String }, // 密码
			name   :   { type: String, default: 'unamed'}, // 姓名
			nickname:  { type: String, default: ''}, // 昵称
			enname:    { type: String, default: ''}, // 英文名
			skills:    { type: String, default: ''}, // 个人技能
			description:{ type: String, default: ''}, // 个人简介
		 	email  :   { type: String },
		 	wxaccounts:  { type: Array, default: []} // 微信账号关联
		}))
		.methods(['get', 'post', 'put']);

		// 默认密码为手机后四位,否则为Passw0rd
		User.before('post', function(req, res, next) {
			var mobile = req.body.mobile, shasum = crypto.createHash('sha1');
			if (mobile) {
				shasum.update(mobile.substring(mobile.length -4));
			} else {
				shasum.update("Passw0rd");
			}
			req.body.password = shasum.digest("hex");
			next();
		});
		// 不允许修改密码
		User.before('put', function(req, res, next) {
            delete req.body.role;
			delete req.body.password;
			next();
		});
	}
	return User;
}