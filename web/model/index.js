var restful = require('node-restful');
var mongoose = restful.mongoose;
	mongoose.connect("mongodb://localhost/4sdmpdb");

exports.Club = require("./Club")(mongoose);
exports.User = require("./User")(mongoose);
exports.Store = require("./Store")(mongoose);
exports.Service = require("./Service")(mongoose);
exports.Schedule = require("./Schedule")(mongoose);
