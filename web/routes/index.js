/*
 * route to the wap
 */
var indexRoutes = require('./wap/index.js');
var storeRoutes = require('./wap/store.js');
var reservationRoutes = require('./wap/reservation.js');
var profileRoutes = require('./wap/profile.js');

module.exports = function(app) {
	app.get('/wap/shortcut', indexRoutes.index);
	app.get('/wap/store/:id', storeRoutes.index);
	app.get('/wap/store/:id/activity', storeRoutes.activity);
	app.get('/wap/store/:id/news', storeRoutes.news);
	app.get('/wap/reservation/index', reservationRoutes.index);
	app.get('/wap/reservation/repair', reservationRoutes.repair);
	app.get('/wap/reservation/care', reservationRoutes.care);
	app.get('/wap/reservation/insurance', reservationRoutes.insurance);
	app.get('/wap/reservation/refit', reservationRoutes.refit);
	app.get('/wap/reservation/peds', reservationRoutes.peds);
	app.get('/wap/profile/:id', profileRoutes.index);
	app.get('/wap/profile/:id/password', profileRoutes.password);
	app.get('/wap/profile/:id/reservation', profileRoutes.reservation);
	app.get('/wap/profile/:id/reminder', profileRoutes.reminder);
}