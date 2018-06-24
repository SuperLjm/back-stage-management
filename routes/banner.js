var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');
var fs = require('fs');
var mongoUrl = 'mongodb://localhost:27017/jm';


module.exports = {
	defaultRoute: ( req, res, next ) => {
		if( req.cookies.loginState != 1 ){
			res.render('login');
			return;
		};
		async.waterfall([
			( cb ) => {
				MongoClient.connect( mongoUrl, ( err, db ) => {
					if ( err ) throw err;
					cb( null, db )
				})
			},
			( db, cb ) => {
				db.collection('banner').find({},{_id:0}).toArray( ( err, data ) => {
					if ( err ) throw err;
					cb( null, data );
					db.close();
 				})
			}
		], ( err, result ) => {
			if ( err ) throw err;
			res.render('banner', {
				result
			})
		})
    },
	addBannerRouter: ( req, res, next ) => {
		if( req.cookies.loginState != 1 ){
			res.render('login')
			return;
		}
		res.render('banner_add');
	},
	addBannnerAction: ( req, res, next ) => {
// 		console.log( 'req.body', req.body);
// 		console.log( 'req.file', req.file );
// 		req.body { bannerid: 'text2', bannerurl: 'http://www.baidu.com' }
// 		req.file { fieldname: 'bannerimg',
// 		  originalname: '3.jpg',
// 		  encoding: '7bit',
// 		  mimetype: 'image/jpeg',
// 		  destination: 'uploads/',
// 		  filename: '8d36ee5365a5ad4f84e0f3cb8a5c8f53',
// 		  path: 'uploads\\8d36ee5365a5ad4f84e0f3cb8a5c8f53',
// 		  size: 48123 }
		var oldName = './uploads/' + req.file.filename;
		var originalnameArr = req.file.originalname.split('.');
		var finish = originalnameArr[originalnameArr.length - 1];
		var newName = './uploads/' + req.file.filename + '.' + finish;
		var imgurl = req.file.filename + '.' + finish;
		var { bannerimg, bannerurl } = req.body;
		async.waterfall([
		
		   ( cb ) => {
		   fs.rename( oldName, newName, ( err, data ) => {
						if ( err ) throw err;
						cb( null, imgurl );
				})
		   },
		   ( imgurl, cb ) => {
			   MongoClient.connect( mongoUrl, ( err, db ) => {
				   if ( err ) throw err;
				   cb( null, imgurl, db );
			   })
		   },
		   ( imgurl, db, cb ) =>{
			   db.collection('banner').insert({ bannerimg, bannerurl, imgurl }, ( err , data) => {
				   if ( err ) throw err;
				   cb( null, 'ok' );
			   })
		   }
		], ( err, result ) => {
			if ( err ) throw err;
			if ( result == 'ok' ){
				res.redirect('/banner')
			}
		})
	}
}