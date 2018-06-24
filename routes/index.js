var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({
	dest: 'uploads/'
})

var movies = require('./movies.js');
var casts = require('./casts.js');
var directors = require('./directors.js');
var admin = require('./admin.js');
var banner = require('./banner.js');
/* GET home page. */
router.get('/', function(req, res, next) {
  var type = req.cookies.loginState == 1 ? 'index' : 'login';
  res.render( type );
});
/*电影相关的路由*/
router.get('/movies', movies.defaultRoute);
router.get('/sortMoviesRoute', movies.sortMoviesRoute);
router.get('/areaQueryMoviesRoute', movies.areaQueryMoviesRoute);//区间排序
router.get('/searchMoviesRoute', movies.searchMoviesRoute);//搜索框排序
router.get('/getYearMovie', movies.getYearMovie);//年份筛选排序


/* 演员相关的路由 */
router.get('/casts', casts.defaultRoute);  // 默认路由，调用形式为  /casts
router.get('/castspaging', casts.castspaging);// 分页路由，调用形式为  /castspaging?limitNum=*&skipNum=*
router.get('/deleteThis', casts.deleteThis);
router.get('/createNew', casts.createNew);//添加演员
router.post('/addCastsAction', casts.addCastsAction);
router.get('/updateThis', casts.updateThis);
router.post('/updateCastsAction', casts.updateCastsAction);

router.get('/directors', directors.defaultRoute);

/*登陆相关的路由*/
router.get('/admin', admin.defaultRoute);
router.post('/addminLoginActon', admin.addminLoginActon);

router.get('/banner', banner.defaultRoute);
router.get('/addBannerRouter', banner.addBannerRouter);
router.post('/addBannnerAction', upload.single('bannerimg'), banner.addBannnerAction);
module.exports = router;
