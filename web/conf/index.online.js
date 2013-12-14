module.exports = {
  port: 80,
  hostname: '127.0.0.1',
  timeout: {
      desc: '十分钟',
      val: 1000 * 60 * 10
  },
  mongo: {
      host: '127.0.0.1',
      port: '27017',
      dbname: '4sdmpdb',
  },
  site_root: 'http://localhost',
  upload_root: '/var/www/web/upload',
  //upload_root: 'C:/upload/images',
  salt: '4sdmp1q2w3e4r5t6y7u8i9o0p',
  weixin: '4sdmp'
};

var environ = process.env.NODE_ENV || 'development';

try {
  var localConf = require('./' + environ);
  for (var i in localConf) {
    module.exports[i] = localConf[i];
  }
} catch (e) {}
