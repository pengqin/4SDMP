var extend = require('util')._extend;
var restful = require('node-restful');
var mongoose = restful.mongoose, Schema = mongoose.Schema;
var Store, Employee = require("./Employee");

module.exports = function(mongoose) {
	if (!Store) {
		// 模型定义和基本CRUD 
		Store = restful.model('Store', mongoose.Schema({
			name   :  { type: String, default: '未命名的4S店'},
			owner  :  { type: Object }, // 冗余信息 4S店负责人
			employees:{ type: Array, default: []}, // 下属员工的ID,角色,是否激活,绑定的OpenId信息
		  	openIds : { type: Array, default: []}, // 绑定的OpenID 支持一店多绑
			enabled:  { type: Boolean, default: true}, // 启用
		  	archived: { type: Boolean, default: false} // 是否存档
		}))
		.methods(['get', 'post', 'put']);

		/*
		Store.extend = function(app) {
			// 获得该4S店下所有员工
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
					restful.model('Employee').find({_id: {$in: ids}}, {password: 0, openIds:0}).exec(function(err, results) {
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
			// 创建该4S店下员工，并更新store的employees
			app.post("/api/store/:id/employee", function(req, res) {
				if (!req.body._id) {
					var user = new restful.model('Employee')(req.body);
					user.save(function(err, user) {
						if (err) {
							return res.json(500, err);
						}
						if (!user) {
							return res.json(500, {err: "failed to create a new employee."});
						}
						restful.model('Store').findById(req.params.id).exec(function(err, store) {
							if (err) {
								return res.json(500, err);
							}
							if (!store || !store.employees) {
								return res.json(500, {err: "failed to get the employees"})
							}
							restful.model('Store').update({_id: store._id}, {$push:{"employees": {_id: user._id, role: 'employee', enabled: true}}}).exec(function(err, newstore) {
								if (err) {
									return res.json(500, err);
								}
								return res.json(201, user);
							})
						});
					});
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
		}*/
	}
	return Store;
}