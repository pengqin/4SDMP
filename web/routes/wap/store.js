var store = {name: '北京现代旗舰店'};
exports.index = function(req, res){
 	res.render('wap/store/index', {title: "车型展示", store: store});
};
exports.activity = function(req, res){
 	res.render('wap/store/activity', {title: "热点活动", store: store});
};
exports.news = function(req, res){
 	res.render('wap/store/news', {title: "新闻资讯", store: store});
};