var extend = require('util')._extend;
var restful = require('node-restful');
var mongoose = restful.mongoose, Schema = mongoose.Schema;
var Club, User = require("./User");

module.exports = function(mongoose) {
	if (!Club) {
		// 模型定义和基本CRUD 
		Club = restful.model('Club', mongoose.Schema({
			name   :  { type: String, default: 'unamed'},
			owner  :  { type: Object }, // 冗余信息 会所负责人
			employees:{ type: Array, default: []}, // 下属员工的ID,角色,是否激活,绑定的OpenId信息
		  	openId :  { type: String, index: true},
			enabled:  { type: Boolean, default: true}, // 启用
		  	archived: { type: Boolean, default: false} // 是否存档
		}))
		.methods(['get', 'post', 'put']);

		Club.extend = function(app) {
			// 获得该会所下所有员工
			app.get("/api/club/:id/employee", function(req, res) {
				restful.model('Club').findById(req.params.id).exec(function(err, club) {
					if (err) {
						return res.json(500, err);
					}
					if (!club || !club.employees) {
						return res.json(500, {err: "failed to get the employees"})
					}
					var employees = club.employees, employeesMap = {}, ids = [];
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
			// 创建该会所下员工，并更新club的employees
			app.post("/api/club/:id/employee", function(req, res) {
				if (!req.body._id) {
					var user = new restful.model('User')(req.body);
					user.save(function(err, user) {
						if (err) {
							return res.json(500, err);
						}
						if (!user) {
							return res.json(500, {err: "failed to create a new employee."});
						}
						restful.model('Club').findById(req.params.id).exec(function(err, club) {
							if (err) {
								return res.json(500, err);
							}
							if (!club || !club.employees) {
								return res.json(500, {err: "failed to get the employees"})
							}
							restful.model('Club').update({_id: club._id}, {$push:{"employees": {_id: user._id, role: 'employee', enabled: true}}}).exec(function(err, newclub) {
								if (err) {
									return res.json(500, err);
								}
								return res.json(201, user);
							})
						});
					});
				} else {
					restful.model('Club').findById(req.params.id).exec(function(err, club) {
						if (err) {
							return res.json(500, err);
						}
						if (!club || !club.employees) {
							return res.json(500, {err: "failed to get the employees"})
						}
						restful.model('Club').update({_id: club._id}, {$push:{"employees": {_id: req.body._id, role: 'employee', enabled: true}}}).exec(function(err, newclub) {
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
	return Club;
}