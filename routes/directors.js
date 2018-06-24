module.exports = {
	defaultRoute: ( req, res, next ) => {
		var type = req.cookies.loginState == 1 ? 'index' : 'login';
		if( type == 'login' ){
			res.render('login');
			return;
		}else{
			res.render('directors')
		}
    }
}