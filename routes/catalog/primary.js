/*--																					--*\
						PRIMARY ADMIN API ROUTES
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

var primaryExports = {};

/*
	Route: Add textSection
	Input:
		payload: {"title": String, "content": String}
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
primaryExports.addTextSection = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.TextSection.findOne(function(err, textSections){
			textSections.sections.push(req.body);
			textSections.save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		});
	}
};

/*
	Route: Re-order text sections
	Input:
		payload: [
			{"_id": "12345"},
			{"_id": "67890"},
			{"_id": "34567"}
		]
	Output:
		{"success": Boolean}
	Created: 04/24/2016 Tyler Yasaka
	Modified:
*/
primaryExports.reorderTextSections = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.TextSection.findOne(function(err, doc){
			var reordered = [];
			for(i in req.body) {
				var id = req.body[i]._id;
				for(var j in doc.sections) {
					var textSection = doc.sections[j];
					if(id == textSection._id) {
						reordered.push(textSection);
					}
				}
			}
			// Make sure the length of the original array and the reordered array are the same
			// If they're not the same, an error must have occured and we will probably lose data.
			if(doc.sections.length == reordered.length) {
				doc.sections = reordered;
			}
			doc.save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		});
	}
};

/*
	Route: Update textSection
	Input:
		url parameters:
			id: id of textSection
		payload: {"title": String, "content": String}
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
primaryExports.updateTextSection = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.TextSection.findOne(function(err, textSections){
			var section = textSections.sections.id(req.params.id);
			if(section) {
				for(var attribute in req.body) {
					section[attribute] = req.body[attribute];
				}
			}
			textSections.save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		});
	}
};

/*
	Route: Remove textSection
	Input:
		url parameters:
			id: id of textSection
	Output:
		{"success": Boolean}
	Created: 03/24/2016 Tyler Yasaka
	Modified:
*/
primaryExports.removeTextSection = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.TextSection.findOne(function(err, textSections){
			var section = textSections.sections.id(req.params.id);
			if(section) {
				section.remove();
			}
			textSections.save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		});
	}
};

/*
	Route: Add requirement to area
	Input:
		url parameters:
			area: id of area to add program to
		payload: {"name": String, "items": []}
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.addRequirementToArea = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.GeneralRequirement.findOne({area: req.params.area}).exec(function(err, area){
			if(area) {
				if(area.requirements) {
					area.requirements.push(req.body);
				}
				area.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Area does not exist'});
			}
		});
	}
};

/*
	Route: Update requirement in area
	Input:
		url parameters:
			area: id of area containing requirement
			requirement: id of requirement
		payload: {"name": String, "items": []}
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.updateRequirementInArea = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.GeneralRequirement.findOne({area: req.params.area}).exec(function(err, area){
			if(area) {
				if(area.requirements) {
					var requirement = area.requirements.id(req.params.requirement);
					if(requirement) {
						for(var attribute in req.body) {
							requirement[attribute] = req.body[attribute];
						}
					}
				}
				area.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Area does not exist'});
			}
		});
	}
};

/*
	Route: Remove general requirement from area
	Input:
		url parameters:
			area: id of area containing requirement
			requirement: id of requirement
	Output:
		{"success": Boolean}
	Created: 04/16/2016 John Batson
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.removeGeneralRequirementFromArea = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.GeneralRequirement.findOne({area: req.params.area}).exec(function(err, area){
			if(area) {
				if(area.requirements) {
					var requirement = area.requirements.id(req.params.requirement);
					if(requirement) {
						requirement.remove();
					}
				}
				area.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Area does not exist'});
			}
		});
	}
};

/*
	Route: Add category
	Input:
		payload: {"name": String, "description": String, "departments": [], "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.addCategory = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program(req.body).save(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/*
	Route: Update category
	Input:
		url parameters:
			category: id of category to update
		payload: {"name": String, "description": String, "departments": [], "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.updateCategory = function(req, res){

	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				for(var attribute in req.body) {
					category[attribute] = req.body[attribute];
				}
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Remove category
	Input:
		url parameters:
			category: id of category to update
	Output:
		{"success": Boolean}
	Created: 04/15/2016 Kaitlin Snyder
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.removeCategory = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				category.remove(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Add department
	Input:
		url parameters:
			category: id of category to add department to
		payload: {"name": String, "description": String, "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.addDepartment = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				category.departments.push(req.body);
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Update department
	Input:
		url parameters:
			category: id of category that department is in
			department: id of department
		payload: {"name": String, "description": String, "programs": []}
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.updateDepartment = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				var department = category.departments.id(req.params.department);
				if(department) {
					for(var attribute in req.body) {
						department[attribute] = req.body[attribute];
					}
				}
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Remove department
	Input:
		url parameters:
			category: id of category that department is in
			department: id of department
	Output:
		{"success": Boolean}
	Created: 04/9/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.removeDepartment = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				var department = category.departments.id(req.params.department);
				if(department) {
					department.remove();
				}
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Add program to category
	Input:
		url parameters:
			category: id of category to add program to
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.addProgramToCategory = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				category.programs.push(req.body);
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Add program to department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department to add program to
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.addProgramToDepartment = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				var department = category.departments.id(req.params.department);
				if(department){
					department.programs.push(req.body);
				}
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Update program in category
	Input:
		url parameters:
			category: id of category containing department
			program: id of program
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.updateProgramInCategory = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				var program = category.programs.id(req.params.program);
				if(program) {
					for(var attribute in req.body) {
						program[attribute] = req.body[attribute];
					}
				}
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Update program in department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department containing program
			program: id of program
		payload: {"type": String, "name": String, "description": String, requirements: []}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.updateProgramInDepartment = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				var department = category.departments.id(req.params.department);
				if(department) {
					var program = department.programs.id(req.params.program);
					if(program) {
						for(var attribute in req.body) {
							program[attribute] = req.body[attribute];
						}
					}
				}
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

 /*
	Route: Remove program from category
	Input:
		url parameters:
			category: id of category containing program
			program: id of program
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.removeProgramFromCategory = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				var program = category.programs.id(req.params.program);
				if(program) {
					program.remove();
				}
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Remove program from department
	Input:
		url parameters:
			category: id of category containing department
			department: id of department containing program
			program: id of program
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
		04/17/2016 Tyler Yasaka
*/
primaryExports.removeProgramFromDepartment = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Program.findOne({_id: req.params.category}).exec(function(err, category){
			if(category) {
				var department = category.departments.id(req.params.department);
				if(department) {
					var program = department.programs.id(req.params.program);
					if(program) {
						program.remove();
					}
				}
				category.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Category does not exist'});
			}
		});
	}
};

/*
	Route: Add course subject
	Input:
		payload: {"title": String, "abbreviation": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
primaryExports.addCourseSubject = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Subject.findOne(function(err, subjects){
			subjects.name = (req.body.name);
			subjects.abbreviation = (req.body.abbreviation);

			subjects.save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
		});
	}
};

/*
	Route: Update course subject
	Input:
		url parameters:
			id: id of subject
		payload: {"title": String, "abbreviation": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
primaryExports.updateCourseSubject = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Subject.findOne({_id: req.params.id}).update({},{ $set: req.body}).exec(
			function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
	}
};

/*
	Route: Remove course subject
	Input:
		url parameters:
			id: id of subject
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:
*/
primaryExports.removeCourseSubject = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Subject.remove({_id: req.params.id}).exec(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/*
	Route: Add course
	Input:
		payload: {"title": String, "description": String, "number": String, "offerings": [],
				  "hours": {"min": String, "max": String}, "fee": String, "subject": {}}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
primaryExports.addCourse = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		new db.models.Course(req.body).populate('subject').save(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/*
	Route: Update course
	Input:
		url parameters:
			id: id of course
		payload: {"title": String, "description": String, "number": String, "offerings": [],
				  "hours": {"min": String, "max": String}, "fee": String, "subject": {}}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:

*/
primaryExports.updateCourse = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Course.findOne({_id: req.params.id}).update({},{ $set: req.body}).exec(
			function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
	}
};

/*
	Route: Remove course
	Input:
		url parameters:
			id: id of course
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Kaitlin Snyder
	Modified:
*/
primaryExports.removeCourse = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Course.remove({_id: req.params.id}).exec(function(err){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

 /*
	Route: Update facultyAndStaff
	Input:
		payload: {"content": String}
	Output:
		{"success": Boolean}
	Created: 04/11/2016 Tyler Yasaka
	Modified:
*/
primaryExports.updateFacultyAndStaff = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.FacultyAndStaff.update(
			{},
			{ $set: req.body}
		).exec(
			function(err){
				var success = err ? false : true;
				res.send({success: success});
			}
		);
	}
};

/*
	Route: Change password
	Input:
		payload: {"password": String}
	Output:

	Created: 04/24/2016 Andrew Fisher
	Modified:
 */
primaryExports.changePassword = function(req, res){
	if(isAuthenticated(appname, privilege.secondaryAdmin, req.session, res))
	{
		db.models.Admin.update({ author: req.session.username},
		{ $set: req.body }).exec(function(err, request){
			var success = err ? false : true;
			res.send({success: success});
		});
	}
};

/*
	Route: View change request queue
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
	Created: 04/23/2016 John Batson
	Modified:
		04/25/2016 John Batson
 */
primaryExports.viewChangeRequestQueue = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.find({status: "pending"}).exec(function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
};

/*
	Route: Approve change request
	Input:
		url parameters:
			id: id of change request to approve
		payload: {"comment": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 John Batson
	Modified:
 */
primaryExports.approveChangeRequest = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.findOne({_id: req.params.id}).exec(function(err, request){
			if(request) {
				request.status = "approved";
				request.timeOfApproval = Date.now();
				if (req.body.comment) {
					request.comment = (req.body.comment);
				}
				request.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Change request does not exist'});
			}
		});
	}
};

/*
	Route: Deny change request
	Input:
		url parameters:
			id: id of change request to deny
		payload: {"comment": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 John Batson
	Modified:
 */
primaryExports.denyChangeRequest = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.ChangeRequest.findOne({_id: req.params.id}).exec(function(err, request){
			if(request) {
				request.status = "denied";
				request.timeOfApproval = Date.now();
				if (req.body.comment) {
					request.comment = (req.body.comment);
				}
				request.save(function(err){
					var success = err ? false : true;
					res.send({success: success});
				});
			}
			else {
				res.send({success: false, error: 'Change request does not exist'});
			}
		});
	}
};

 /*
	Route: Add admins
	Input:
		payload: {"username": String, "password": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
primaryExports.addAdmin = function(req, res){
	// restrict this to primary admins
	console.log(req.session);
	req.body.privilege = 2;
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		new db.models.Admin(req.body).save(function(err){
				var success = err ? false : true;
				res.send({success: success});
			});
	}
};

 /*
	Route: Update admins
	Input:
		payload: {"password": String}
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
primaryExports.updateAdmin = function(req, res){
	// restrict this to primary admins
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Admin.update(
			{_id: req.params.id},
			{ $set: req.body}
		).exec(
			function(err){
				var success = err ? false : true;
				res.send({success: success});
			}
		);
	}
};

/*
	Route: Remove admins
	Input:
		url parameters:
			id: id of admins
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
primaryExports.removeAdmin = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Admin.remove({_id: req.params.id}).exec(function(err){
				var success = err ? false : true;
				res.send({success: success});
		});
	}
};

/*
	Route: List admins
	Input:
	Output:
		{"success": Boolean, data: [{
			"_id": String,
			"username": String
			"privilege": Number
			"password": String
			"apps": [String]
		}]}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
primaryExports.listAdmins = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Admin.find().exec( function(err, results) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: results
			});
		});
	}
};

/*
	Route: View admins
	Input:
		url parameters:
			id: id of admins
	Output:
		{"success": Boolean}
	Created: 04/23/2016 Andrew Fisher
	Modified:
*/
primaryExports.viewAdmin = function(req, res){
	if(isAuthenticated(appname, privilege.primaryAdmin, req.session, res))
	{
		db.models.Admin.findOne({_id: req.params.id}).exec( function(err, result) {
			var success = err ? false : true;
			res.send({
				success: success,
				data: result
			});
		});
	}
};

module.exports = primaryExports;