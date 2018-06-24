var { MongoClient } = require('mongodb');
var async = require('async');
var url = require('url');

var mongoUrl = 'mongodb://localhost:27017/jm';

module.exports = {
		defaultRoute: ( req, res, next ) => {
      var type = req.cookies.loginState == 1 ? 'index' : 'login';
      	if( type == 'login' ){
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
						( db, cb )=>{
							db.collection('movies').distinct('year', ( err, yearArr ) => {
								if ( err ) throw err;
								yearArr.sort( ( a, b) => {
									return a - b;
								});
								cb( null, yearArr, db );
							})
						},
						( yearArr, db, cb ) => {
							db.collection('movies').find( {}, {_id:0} ).toArray( ( err, res ) => {
								if ( err ) throw err;
								cb( null, {
									res	,//	res就是拿到的所有数据
									yearArr
								});
								db.close();
							})
						}
				], ( err, result ) => {
						res.render('movies',{
							result:result.res,
							yearArr: result.yearArr
						})
				})
    },
		sortMoviesRoute: ( req, res, next ) => {
				var sortObj = {};
				var { type, num } = url.parse( req.url, true ).query;
				num = num * 1;
				try{
					sortObj[type]=num;
				}catch(e){
					//TODO handle the exception
				};
				async.waterfall([
						( cb ) => {
							MongoClient.connect( mongoUrl, ( err, db ) => {
								if ( err ) throw err;
								cb( null, db )
							})
						},
						( db, cb )=>{
							db.collection('movies').distinct('year', ( err, yearArr ) => {
								if ( err ) throw err;
								yearArr.sort( ( a, b) => {
									return a - b;
								});
								cb( null, yearArr, db );
							})
						},
						( yearArr, db, cb ) => {
							db.collection('movies').find( {}, {_id:0} ).sort( sortObj ).toArray( ( err, res ) => {
								if ( err ) throw err;
								cb( null, {
									res,			//	res就是拿到的所有数据
									yearArr
								});
							})
						}
				], ( err, result ) => {
						res.render('movies',{
							result:result.res,
							yearArr:result.yearArr
						})
				})
		},
		areaQueryMoviesRoute: ( req, res, next ) => {
			
			var whereObj = {};
			var { type, min, max } = url.parse( req.url, true ).query;
			min = min * 1;
			max = max * 1;
			try{
					whereObj[type] = {
							$gte: min,
							$lte: max
				}
			}catch(e){
				//TODO handle the exception
			};
				async.waterfall([
						( cb ) => {
							MongoClient.connect( mongoUrl, ( err, db ) => {
								if ( err ) throw err;
								cb( null, db )
							})
						},
						( db, cb )=>{
							db.collection('movies').distinct('year', ( err, yearArr ) => {
								if ( err ) throw err;
								yearArr.sort( ( a, b) => {
									return a - b;
								});
								cb( null, yearArr, db );
							})
						},
						( yearArr, db, cb ) => {
							db.collection('movies').find( whereObj, {_id:0}).toArray( ( err, res ) => {
								if ( err ) throw err;
								cb( null, {
									res,			//	res就是拿到的所有数据
									yearArr
								});
							})
						}
				], ( err, result ) => {
						res.render('movies',{
							result:result.res,
							yearArr:result.yearArr
						})
				})
		},
		searchMoviesRoute: ( req, res, next ) => {
			var { type, val } = url.parse( req.url, true ).query;
			var whereObj = {};
			try{
				whereObj[type] = eval("/"+val+"/");
			}catch(e){
				//TODO handle the exception
			};
			async.waterfall([
					( cb ) => {
						MongoClient.connect( mongoUrl, ( err, db ) => {
							if ( err ) throw err;
							cb( null, db )
						})
					},
					( db, cb )=>{
						db.collection('movies').distinct('year', ( err, yearArr ) => {
							if ( err ) throw err;
							yearArr.sort( ( a, b) => {
								return a - b;
							});
							cb( null, yearArr, db );
						})
					},
					( yearArr, db, cb ) => {
						db.collection('movies').find( whereObj, {_id:0}).toArray( ( err, res ) => {
							if ( err ) throw err;
							cb( null, {
								res,			//	res就是拿到的所有数据
								yearArr
							});
						})
					}
			], ( err, result ) => {
					res.render('movies',{
						result:result.res,
						yearArr:result.yearArr
					})
			})
		},
		getYearMovie: ( req, res, next ) => {
			var { year } = url.parse( req.url, true ).query;
			year = year*1;
				async.waterfall([
								( cb ) => {
									MongoClient.connect( mongoUrl, ( err, db ) => {
										if ( err ) throw err;
										cb( null, db )
									})
								},
								( db, cb )=>{
									db.collection('movies').distinct('year', ( err, yearArr ) => {
										if ( err ) throw err;
										yearArr.sort( ( a, b) => {
											return a - b;
										});
										cb( null, yearArr, db );
									})
								},
								( yearArr, db, cb ) => {
									db.collection('movies').find( {year:year}, {_id:0} ).toArray( ( err, res ) => {
										if ( err ) throw err;
										cb( null, {
											res	,//	res就是拿到的所有数据
											yearArr
										});
										db.close();
									})
								}
						], ( err, result ) => {
								res.render('movies',{
									result:result.res,
									yearArr: result.yearArr
								})
						})
		}
}