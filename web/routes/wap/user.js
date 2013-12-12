/*
 * GET register page.
 */
exports.register = function(req, res){
	var clubId = req.params.clubId;
	console.info(clubId);
 	res.render('wap/user/register', {});
};