/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/controllers/Controller_js20.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 
 * @class
 * @classdesc controller
 
 * @extends ControllerObjClient
  
 * @requires core/extend.js
 * @requires core/ControllerObjClient.js
  
 * @param {Object} options
 * @param {Model} options.listModelClass
 * @param {Model} options.objModelClass
 */ 

function DocTemplateField_Controller(options){
	options = options || {};
	options.listModelClass = DocTemplateField_Model;
	options.objModelClass = DocTemplateField_Model;
	DocTemplateField_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addInsert();
	this.addUpdate();
	this.addDelete();
	this.addGetList();
	this.addGetObject();
		
}
extend(DocTemplateField_Controller,ControllerObjClient);

			DocTemplateField_Controller.prototype.addInsert = function(){
	DocTemplateField_Controller.superclass.addInsert.call(this);
	
	var pm = this.getInsert();
	
	var options = {};
	options.primaryKey = true;
	var field = new FieldString("user_id",options);
	
	pm.addField(field);
	
	
}

			DocTemplateField_Controller.prototype.addUpdate = function(){
	DocTemplateField_Controller.superclass.addUpdate.call(this);
	var pm = this.getUpdate();
	
	var options = {};
	options.primaryKey = true;
	var field = new FieldString("user_id",options);
	
	pm.addField(field);
	
	field = new FieldString("old_user_id",{});
	pm.addField(field);
	
	
}

			DocTemplateField_Controller.prototype.addDelete = function(){
	DocTemplateField_Controller.superclass.addDelete.call(this);
	var pm = this.getDelete();
	var options = {"required":true};
		
	pm.addField(new FieldString("user_id",options));
}

			DocTemplateField_Controller.prototype.addGetList = function(){
	DocTemplateField_Controller.superclass.addGetList.call(this);
	
	
	
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
	
	pm.addField(new FieldString("user_id",f_opts));
}

			DocTemplateField_Controller.prototype.addGetObject = function(){
	DocTemplateField_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldString("user_id",f_opts));
	
	pm.addField(new FieldString("mode"));
}

		