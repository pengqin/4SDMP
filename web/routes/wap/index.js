/*
 * GET home page.
 */

exports.index = function(req, res) {
	var clubId = req.params.clubId;
	console.info(clubId);
 	res.render('wap/index', { title: "4sdmp" });
};