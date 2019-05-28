/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/controllers/Controller_js20.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 
 * @class
 * @classdesc controller
 
 * @extends ControllerObjServer
  
 * @requires core/extend.js
 * @requires core/ControllerObjServer.js
  
 * @param {Object} options
 * @param {Model} options.listModelClass
 * @param {Model} options.objModelClass
 */ 

function DocTemplate_Controller(options){
	options = options || {};
	options.listModelClass = DocTemplateList_Model;
	options.objModelClass = DocTemplateDialog_Model;
	DocTemplate_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addInsert();
	this.addUpdate();
	this.addDelete();
	this.addGetList();
	this.addGetObject();
	this.addComplete();
	this.add_delete_template();
	this.add_get_template();
		
}
extend(DocTemplate_Controller,ControllerObjServer);

			DocTemplate_Controller.prototype.addInsert = function(){
	DocTemplate_Controller.superclass.addInsert.call(this);
	
	var pm = this.getInsert();
	
	pm.setRequestType('post');
	
	pm.setEncType(ServConnector.prototype.ENCTYPES.MULTIPART);
	
	var options = {};
	options.primaryKey = true;options.autoInc = true;
	var field = new FieldInt("id",options);
	
	pm.addField(field);
	
	var options = {};
	options.alias = "Наименование";options.required = true;
	var field = new FieldString("name",options);
	
	pm.addField(field);
	
	var options = {};
	options.alias = "Комментарий";
	var field = new FieldText("comment_text",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldInt("employee_id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSONB("permissions",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldArray("permission_ar",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSON("fields",options);
	
	pm.addField(field);
	
	var options = {};
	options.required = true;
	var field = new FieldString("document_prefix",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldBool("for_all_employees",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSONB("template_file",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldText("template_data",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldText("user_functions",options);
	
	pm.addField(field);
	
	pm.addField(new FieldInt("ret_id",{}));
	
		var options = {};
				
		pm.addField(new FieldText("template_file_data",options));
	
	
}

			DocTemplate_Controller.prototype.addUpdate = function(){
	DocTemplate_Controller.superclass.addUpdate.call(this);
	var pm = this.getUpdate();
	
	pm.setRequestType('post');
	
	pm.setEncType(ServConnector.prototype.ENCTYPES.MULTIPART);
	
	var options = {};
	options.primaryKey = true;options.autoInc = true;
	var field = new FieldInt("id",options);
	
	pm.addField(field);
	
	field = new FieldInt("old_id",{});
	pm.addField(field);
	
	var options = {};
	options.alias = "Наименование";
	var field = new FieldString("name",options);
	
	pm.addField(field);
	
	var options = {};
	options.alias = "Комментарий";
	var field = new FieldText("comment_text",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldInt("employee_id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSONB("permissions",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldArray("permission_ar",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSON("fields",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldString("document_prefix",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldBool("for_all_employees",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSONB("template_file",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldText("template_data",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldText("user_functions",options);
	
	pm.addField(field);
	
		var options = {};
				
		pm.addField(new FieldText("template_file_data",options));
	
	
}

			DocTemplate_Controller.prototype.addDelete = function(){
	DocTemplate_Controller.superclass.addDelete.call(this);
	var pm = this.getDelete();
	var options = {"required":true};
		
	pm.addField(new FieldInt("id",options));
}

			DocTemplate_Controller.prototype.addGetList = function(){
	DocTemplate_Controller.superclass.addGetList.call(this);
	
	
	
	var pm = this.getGetList();
	
	pm.addField(new FieldInt(this.PARAM_COUNT));
	pm.addField(new FieldInt(this.PARAM_FROM));
	pm.addField(new FieldString(this.PARAM_COND_FIELDS));
	pm.addField(new FieldString(this.PARAM_COND_SGNS));
	pm.addField(new FieldString(this.PARAM_COND_VALS));
	pm.addField(new FieldString(this.PARAM_COND_ICASE));
	pm.addField(new FieldString(this.PARAM_ORD_FIELDS));
	pm.addField(new FieldString(this.PARAM_ORD_DIRECTS));
	pm.addField(new FieldString(this.PARAM_FIELD_SEP));

	var f_opts = {};
	
	pm.addField(new FieldInt("id",f_opts));
	var f_opts = {};
	f_opts.alias = "Наименование";
	pm.addField(new FieldString("name",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldInt("employee_id",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldJSON("employees_ref",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldArray("permission_ar",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldBool("for_all_employees",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("document_prefix",f_opts));
}

			DocTemplate_Controller.prototype.addGetObject = function(){
	DocTemplate_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldInt("id",f_opts));
	
	pm.addField(new FieldString("mode"));
}

			DocTemplate_Controller.prototype.addComplete = function(){
	DocTemplate_Controller.superclass.addComplete.call(this);
	
	var f_opts = {};
	f_opts.alias = "";
	var pm = this.getComplete();
	pm.addField(new FieldString("name",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("name");	
}

			DocTemplate_Controller.prototype.add_delete_template = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('delete_template',opts);
	
				
	
	var options = {};
	
		options.required = true;
	
		pm.addField(new FieldInt("doc_id",options));
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "36";
	
		pm.addField(new FieldString("file_id",options));
	
			
	this.addPublicMethod(pm);
}

			DocTemplate_Controller.prototype.add_get_template = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('get_template',opts);
	
				
	
	var options = {};
	
		options.required = true;
	
		pm.addField(new FieldInt("doc_id",options));
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "36";
	
		pm.addField(new FieldString("file_id",options));
	
			
	this.addPublicMethod(pm);
}

		