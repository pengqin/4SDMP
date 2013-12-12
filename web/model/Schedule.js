var extend = require('util')._extend;
var restful = require('node-restful');
var mongoose = restful.mongoose, Schema = mongoose.Schema;
var Schedule, User = require("./User");

module.exports = function(mongoose) {
	if (!Schedule) {
		// 模型定义和基本CRUD 
		Schedule = restful.model('Schedule', mongoose.Schema({
			clubId  :  { type: String, index: true},
			storeId :  { type: String},
			roomId:    { type: String},
			name    :  { type: String, default: '课程表'},
			sdate:     { type: String}, // 课程安排开始时间
			edate	:  { type: String}, // 课程安排结束时间
			services:  { type: Array, default: []}, // 服务计划 {id: ***, name: **, day: **: time: ****, coacher: {}, description: ***}
			enabled :  { type: Boolean, default: true}, // 启用
		  	archived:  { type: Boolean, default: false} // 是否存档
		}))
		.methods(['get', 'post', 'put']);

		// 默认密码为手机后四位,否则为Passw0rd
		Schedule.before('post', function(req, res, next) {
			var clubId = req.body.clubId;
			if (!clubId) {
				return res.json(400, {err: 'club id must be provided.'});
			}
			next();
		});
	}
	return Schedule;
}