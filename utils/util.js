var jwt = require("jsonwebtoken")
var config = require("config")

function isAuthenticated(req, res, next) {
	if (typeof req.headers.authorization !== "undefined") {
		let token = req.headers.authorization.split(" ")[1];
		var privateKey = config.get('session.tokenKey');
		jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
		if (err) {
			res.status(401).json({ error: "Not Authorized" });
			return;
		}
		return next();
		});
	} else {
		res.status(401).json({ error: "Not Authorized" });
		return;
	}
}

function isAuthorized(req, res, next) {
	if (typeof req.headers.authorization !== "undefined") {
		let token = req.headers.authorization.split(" ")[1];
		var privateKey = config.get('session.tokenKey');
		jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
			if (err) {
				res.status(401).json({ error: "Not Authorized" });
				return;
			} if (user.isAdministrator){
				return next();
			}
			res.status(401).json({ error: "Not Authorized" });
			return;
		});
	} else {
		res.status(401).json({ error: "Not Authorized" });
		return;
	}
}

const isAdminOrOwner = (ownerID) => { return (req, res, next) => {
	console.log(ownerID)
	if (typeof req.headers.authorization !== "undefined") {
		let token = req.headers.authorization.split(" ")[1];
		var privateKey = config.get('session.tokenKey');
		jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
			if (err) {
				res.status(401).json({ error: "Not Authorized" });
				return;
			} if (user.isAdministrator || user.userID === ownerID){
				return next();
			}
			res.status(401).json({ error: "Not Authorized" });
			return;
		});
	} else {
		res.status(401).json({ error: "Not Authorized" });
		return;
	}
}
}


function readToken(token) {
	var privateKey = config.get('session.tokenKey');
	jwt.verify(token, privateKey, { algorithm: "HS256" }, (err, user) => {
		if (err) {
			res.status(500).json({ error: "Not Authorized" });
			return;
		}
		return user;
	})
}

module.exports = {
    isAuthenticated,
	isAuthorized,
	isAdminOrOwner,
	readToken
}