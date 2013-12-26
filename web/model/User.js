var crypto = require('crypto');
var restful = require('node-restful');
var mongoose = restful.mongoose, Schema = mongoose.Schema;
var User;

module.exports = function(mongoose) {
	if (!User) { 
		User = restful.model('User', mongoose.Schema({
			storeId:   { type: String, index: true}, // 门店标识
			mobile  :  { type: String }, // 手机号
			name   :   { type: String, default: '未命名的顾客'}, // 姓名
		 	email  :   { type: String },
		 	openIds:   { type: Object, default: {}} // 微信OPEN ID
		}))
		.methods(['get', 'post', 'put']);

		// 不允许修改密码
		User.before('put', function(req, res, next) {
            delete req.body.role;
			delete req.body.password;
			next();
		});
	}
	return User;
}