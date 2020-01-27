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

function Document_Controller(options){
	options = options || {};
	options.listModelClass = DocumentList_Model;
	options.objModelClass = DocumentDialog_Model;
	Document_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addInsert();
	this.addUpdate();
	this.addDelete();
	this.addGetList();
	this.addGetObject();
	this.addComplete();
	this.add_process();
	this.add_get_document();
	this.add_delete_document();
		
}
extend(Document_Controller,ControllerObjServer);

			Document_Controller.prototype.addInsert = function(){
	Document_Controller.superclass.addInsert.call(this);
	
	var pm = this.getInsert();
	
	var options = {};
	options.primaryKey = true;options.autoInc = true;
	var field = new FieldInt("id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldDateTimeTZ("date_time",options);
	
	pm.addField(field);
	
	var options = {};
	options.required = true;
	var field = new FieldInt("employee_id",options);
	
	pm.addField(field);
	
	var options = {};
	options.alias = "Комментарий";
	var field = new FieldText("comment_text",options);
	
	pm.addField(field);
	
	var options = {};
	options.required = true;
	var field = new FieldInt("doc_template_id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSON("field_values",options);
	
	pm.addField(field);
	
	var options = {};
	options.alias = "Номер";
	var field = new FieldString("doc_number",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldBytea("document_data",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSONB("permissions",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldArray("permission_ar",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldBool("for_all_employees",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldDateTimeTZ("document_gen_date",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldInt("document_gen_employee_id",options);
	
	pm.addField(field);
	
	pm.addField(new FieldInt("ret_id",{}));
	
	
}

			Document_Controller.prototype.addUpdate = function(){
	Document_Controller.superclass.addUpdate.call(this);
	var pm = this.getUpdate();
	
	var options = {};
	options.primaryKey = true;options.autoInc = true;
	var field = new FieldInt("id",options);
	
	pm.addField(field);
	
	field = new FieldInt("old_id",{});
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldDateTimeTZ("date_time",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldInt("employee_id",options);
	
	pm.addField(field);
	
	var options = {};
	options.alias = "Комментарий";
	var field = new FieldText("comment_text",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldInt("doc_template_id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSON("field_values",options);
	
	pm.addField(field);
	
	var options = {};
	options.alias = "Номер";
	var field = new FieldString("doc_number",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldBytea("document_data",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldJSONB("permissions",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldArray("permission_ar",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldBool("for_all_employees",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldDateTimeTZ("document_gen_date",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldInt("document_gen_employee_id",options);
	
	pm.addField(field);
	
	
}

			Document_Controller.prototype.addDelete = function(){
	Document_Controller.superclass.addDelete.call(this);
	var pm = this.getDelete();
	var options = {"required":true};
		
	pm.addField(new FieldInt("id",options));
}

			Document_Controller.prototype.addGetList = function(){
	Document_Controller.superclass.addGetList.call(this);
	
	
	
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
	
	pm.addField(new FieldDateTimeTZ("date_time",f_opts));
	var f_opts = {};
	f_opts.alias = "Номер";
	pm.addField(new FieldString("doc_number",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldInt("employee_id",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldJSON("employees_ref",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldInt("doc_template_id",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldJSON("doc_templates_ref",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldBool("for_all_employees",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldArray("permission_ar",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("date_time");
	
}

			Document_Controller.prototype.addGetObject = function(){
	Document_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldInt("id",f_opts));
	
	pm.addField(new FieldString("mode"));
}

			Document_Controller.prototype.addComplete = function(){
	Document_Controller.superclass.addComplete.call(this);
	
	var f_opts = {};
	
	var pm = this.getComplete();
	pm.addField(new FieldInt("id",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("id");	
}

			Document_Controller.prototype.add_process = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('process',opts);
	
	pm.setRequestType('post');
	
	pm.setEncType(ServConnector.prototype.ENCTYPES.MULTIPART);
	
				
	
	var options = {};
	
		options.required = true;
	
		pm.addField(new FieldInt("doc_id",options));
	
				
	
	var options = {};
	
		options.required = true;
	
		pm.addField(new FieldJSON("field_values",options));
	
			
	this.addPublicMethod(pm);
}

			Document_Controller.prototype.add_get_document = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('get_document',opts);
	
				
	
	var options = {};
	
		options.required = true;
	
		pm.addField(new FieldInt("doc_id",options));
	
			
	this.addPublicMethod(pm);
}

			Document_Controller.prototype.add_delete_document = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('delete_document',opts);
	
				
	
	var options = {};
	
		options.required = true;
	
		pm.addField(new FieldInt("doc_id",options));
	
			
	this.addPublicMethod(pm);
}

		