/*
 * route to the wap
 */
var profileRoutes = require('./wap/profile.js');

module.exports = function(app) {
	app.get('/wap/profile/:id', profileRoutes.index);
	app.get('/wap/profile/:id/password', profileRoutes.password);
	app.get('/wap/profile/:id/reminder', profileRoutes.reminder);
}