var restful = require('node-restful');
var mongoose = restful.mongoose;
	mongoose.connect("mongodb://localhost/4sdmpdb");

exports.Store = require("./Store")(mongoose); // 4S门店
exports.User = require("./User")(mongoose); // 用户
exports.Employee = require("./Employee")(mongoose); // 员工
exports.Oper = require("./Oper")(mongoose); // 运维账号
