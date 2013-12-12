var extend = require('util')._extend;
var restful = require('node-restful');
var mongoose = restful.mongoose, Schema = mongoose.Schema;
var Service, User = require("./User");

module.exports = function(mongoose) {
	if (!Service) {
		// 模型定义和基本CRUD 
		Service = restful.model('Service', mongoose.Schema({
			clubId  :  { type: String, index: true},
			name    :  { type: String, default: 'unamed'},
			tags	:  { type: String},
			enabled :  { type: Boolean, default: true}, // 启用
		  	archived:  { type: Boolean, default: false} // 是否存档
		}))
		.methods(['get', 'post', 'put']);

		// 默认密码为手机后四位,否则为Passw0rd
		Service.before('post', function(req, res, next) {
			var clubId = req.body.clubId;
			if (!clubId) {
				return res.json(400, {err: 'club id must be provided.'});
			}
			next();
		});
	}
	return Service;
}