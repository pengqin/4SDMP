/*
 * route to the wap
 */
var storeRoutes = require('./wap/store.js');
var profileRoutes = require('./wap/profile.js');

module.exports = function(app) {
	app.get('/wap/store/:id', storeRoutes.index);
	app.get('/wap/store/:id/activity', storeRoutes.activity);
	app.get('/wap/store/:id/news', storeRoutes.news);
	app.get('/wap/profile/:id', profileRoutes.index);
	app.get('/wap/profile/:id/password', profileRoutes.password);
	app.get('/wap/profile/:id/reminder', profileRoutes.reminder);
}