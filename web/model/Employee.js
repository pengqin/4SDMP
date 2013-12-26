var crypto = require('crypto');
var restful = require('node-restful');
var mongoose = restful.mongoose, Schema = mongoose.Schema;
var conf = rquire("../conf");
var Employee;

/* 4S店员工 */
module.exports = function(mongoose) {
	if (!Employee) { 
		Employee = restful.model('Employee', mongoose.Schema({
			storeId:   { type: String, index: true}, // 门店标识
			username:  { type: String, unique: true} // 由店的唯一标识和手机号作为登录名
			mobile  :  { type: String }, // 员工手机号
			password:  { type: String }, // 密码
			name   :   { type: String, default: '未命名的员工'}, // 姓名
		 	email  :   { type: String },
		 	role:      { type: Array, default: []}, // 岗位角色
		 	openIds:   { type: Object, default: {}}, // 支持一号多绑
		  	archived: { type: Boolean, default: false} // 是否存档
		}))
		.methods(['post', 'put']);

		// 默认密码为手机后四位,否则为Passw0rd
		Employee.before('post', function(req, res, next) {
			var mobile = req.body.mobile, shasum = crypto.createHash('md5');
			if (mobile) {
				shasum.update(mobile.substring(mobile.length -4) + conf.salt);
			} else {
				shasum.update("Passw0rd" + conf.salt);
			}
			req.body.password = shasum.digest("hex");
			next();
		});
		// 不允许修改密码
		Employee.before('put', function(req, res, next) {
            delete req.body.role;
			delete req.body.password;
			next();
		});
	}
	return Employee;
}