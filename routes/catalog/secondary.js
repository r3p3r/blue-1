/*--																					--*\
						SECONDARY ADMIN API ROUTES
\*--																					--*/

// housekeeping
var globals = require('../global');
var modules = globals.modules;
var db = require('../../models/catalog.model');
var isAuthenticated = globals.isAuthenticated;
var router = modules.express.Router();
var definitions = require('./definitions');
var privilege = definitions.privilege;
var appname = definitions.appname;

var secondaryExports = {};

/*
	Route: View change requests (created by that admin)
	Input:
	Output:
		{"success": Boolean,
		 "data": {
			"_id": String,
			"author": String,
			"timeOfRequest": Date,
			"timeOfApproval": Date,
			"status": String,
			"requestTypes": [],
			"newCourseInfo": {
				"syllabusFile": String,
				"title": String,
				"name": String,
				"description": String,
				"number": String,
				"hours": String,
				"fee": String,
				"prerequisitesCorequisites": String,
				"offerings": []
			},
			"revisedFacultyCredentials": {
				"needed": Boolean,
				"content": String
			},
			"courseListChange": {
				"needed": Boolean,
				"content": String
			},
			"effective": {
				"semester": String,
				"year": String
			},
			"courseFeeChange": String,
			"affectedDepartmentsPrograms": String,
			"approvedBy": String,
			"description": String,
			"comment": String
		}}
	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
secondaryExports.viewChangeRequests = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.find({author: req.session.username}).exec(function(err, results){
				var success = err ? false : true;
				res.send({success: success, data: results});
		});
	}
};

/*
	Route: Create change request
	Input:
		payload: {
			"author": String,
			"timeOfRequest": Date,
			"timeOfApproval": Date,
			"status": String,
			"requestTypes": [],
			"newCourseInfo": {
				"syllabusFile": String,
				"title": String,
				"name": String,
				"description": String,
				"number": String,
				"hours": String,
				"fee": String,
				"prerequisitesCorequisites": String,
				"offerings": []
			},
			"revisedFacultyCredentials": {
				"needed": Boolean,
				"content": String
			},
			"courseListChange": {
				"needed": Boolean,
				"content": String
			},
			"effective": {
				"semester": String,
				"year": String
			},
			"courseFeeChange": String,
			"affectedDepartmentsPrograms": String,
			"approvedBy": String,
			"description": String,
			"comment": String
		}
		file: file
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
secondaryExports.createChangeRequest = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		if(req.session.privilege >= privilege.primaryAdmin){
			req.body.status = "approved";
		}
		else{
			req.body.status = "pending";
		}
		req.body.author = req.session.username;
		new db.models.ChangeRequest(req.body).save(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/*
	Route: Edit change request
	Input:
		payload: {"effective": {
					"semester": String,
					"year": String
					}}
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
secondaryExports.editChangeRequest = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.update({_id: req.params.id, status: "pending"},
		{ $set: req.body }).exec(function(err, request){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/*
	Route: Remove change request
	Input:
		url parameters:
			id: id of course
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
secondaryExports.removeChangeRequest = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.remove({_id: req.params.id, status: "pending"}).exec(function(err){
				var success = err ? false : true;
				res.send({success: success});
		});
	}
};

/*
	Route: View change log
	Input:
	Output:
		{"success": Boolean,
		 "data": {
			"_id": String,
			"author": String,
			"timeOfRequest": Date,
			"timeOfApproval": Date,
			"status": String,
			"requestTypes": [],
			"newCourseInfo": {
				"syllabusFile": String,
				"title": String,
				"name": String,
				"description": String,
				"number": String,
				"hours": String,
				"fee": String,
				"prerequisitesCorequisites": String,
				"offerings": []
			},
			"revisedFacultyCredentials": {
				"needed": Boolean,
				"content": String
			},
			"courseListChange": {
				"needed": Boolean,
				"content": String
			},
			"effective": {
				"semester": String,
				"year": String
			},
			"courseFeeChange": String,
			"affectedDepartmentsPrograms": String,
			"approvedBy": String,
			"description": String,
			"comment": String
		}}
	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
secondaryExports.viewChangeLog = function(req, res){
	// restrict this to primary and secondary admins
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.find({status: "approved"}).exec(function(err, results){
				var success = err ? false : true;
				res.send({success: success, data: results});
		});
	}
};

module.exports = secondaryExports;