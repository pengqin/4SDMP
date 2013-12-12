var extend = require('util')._extend;
var restful = require('node-restful');
var rest = require('restler');
var mongoose = restful.mongoose, Schema = mongoose.Schema;
var Store;

module.exports = function(mongoose) {
	if (!Store) { 
		Store = restful.model('Store', mongoose.Schema({
			clubId :     { type: String, index: true }, // 所在会所
			city:        { type: String }, // 所在城市
			name   :     { type: String, default: 'unamed'}, // 名称
			address:     { type: String, default: ''}, // 地址
			route:     { type: String, default: ''}, // 交通指引
			phone  :     { type: String, default: ''}, // 门店电话
			manager  :   { type: Object }, // 冗余信息 门店经理
			employees:   { type: Array, default: []}, // 下属员工ID数组
			rooms:       { type: Array, default: []}, // 活动场所 _id 为 某个timestamp 无需管理
			description: { type: String, default: ''}, // 描述文字
			route: 		 { type: String, default: ''}, // 交通路线
			enabled:     { type: Boolean, default: true}, // 启用
		  	archived:    { type: Boolean, default: false} // 是否存档
		}))
		.methods(['get', 'post', 'put']);

		// 默认密码为手机后四位,否则为Passw0rd
		Store.before('post', function(req, res, next) {
			if (!req.body.clubId) {
				res.json(500, {err: "club id is not provided"});
				return next();
			}
			next();
		});

		Store.extend = function(app) {
			// 获得该会所下所有员工
			app.get("/api/store/:id/employee", function(req, res) {
				restful.model('Store').findById(req.params.id).exec(function(err, store) {
					if (err) {
						return res.json(500, err);
					}
					if (!store || !store.employees) {
						return res.json(500, {err: "failed to get the employees"})
					}
					var employees = store.employees, employeesMap = {}, ids = [];
					for (var i=0; i<employees.length; i++) {
						employeesMap[employees[i]._id] = employees[i];
						ids.push(employees[i]._id);
					}
					restful.model('User').find({_id: {$in: ids}}, {password: 0, wxaccounts:0}).exec(function(err, results) {
						var users = [];
						if (err) {
							return res.json(500, err);
						}
						for (var i=0; i<results.length; i++) {
							var employee = employeesMap[results[i]._id];
							if (employee) {
								var user = extend({}, employee);
									user = extend(user, results[i]._doc);
								users.push(user);
							}
						}
						res.json(200, users);
					});
				});
			});
			// 创建该会所下员工，并更新store的employees
			app.post("/api/store/:id/employee", function(req, res) {
				if (!req.body._id) {
					return res.json(400, {err: 'employee id is not provided'});
				} else {
					restful.model('Store').findById(req.params.id).exec(function(err, store) {
						if (err) {
							return res.json(500, err);
						}
						if (!store || !store.employees) {
							return res.json(500, {err: "failed to get the employees"})
						}
						restful.model('Store').update({_id: store._id}, {$push:{"employees": {_id: req.body._id, role: 'employee', enabled: true}}}).exec(function(err, newstore) {
							if (err) {
								return res.json(500, err);
							}
							return res.json(201, user);
						})
					});
				}
			});
		}
	}
	return Store;
}