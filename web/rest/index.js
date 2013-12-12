/*
 * route to the wap
 */
var model= require('../model');

module.exports = function(app) {
	model.Club.register(app, "/api/club");
	model.User.register(app, "/api/user");
	model.Store.register(app, "/api/store");
	model.Service.register(app, "/api/service");
	model.Schedule.register(app, "/api/schedule");

	model.Club.extend(app);
	model.Store.extend(app);
}