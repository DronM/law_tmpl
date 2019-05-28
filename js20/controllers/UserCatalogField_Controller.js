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

function UserCatalogField_Controller(options){
	options = options || {};
	options.listModelClass = UserCatalogField_Model;
	options.objModelClass = UserCatalogField_Model;
	UserCatalogField_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addInsert();
	this.addUpdate();
	this.addDelete();
	this.addGetList();
	this.addGetObject();
		
}
extend(UserCatalogField_Controller,ControllerObjClient);

			UserCatalogField_Controller.prototype.addInsert = function(){
	UserCatalogField_Controller.superclass.addInsert.call(this);
	
	var pm = this.getInsert();
	
	var options = {};
	
	var field = new FieldString("id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldString("descr",options);
	
	pm.addField(field);
	
	
}

			UserCatalogField_Controller.prototype.addUpdate = function(){
	UserCatalogField_Controller.superclass.addUpdate.call(this);
	var pm = this.getUpdate();
	
	var options = {};
	
	var field = new FieldString("id",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldString("descr",options);
	
	pm.addField(field);
	
	
}

			UserCatalogField_Controller.prototype.addDelete = function(){
	UserCatalogField_Controller.superclass.addDelete.call(this);
	var pm = this.getDelete();
}

			UserCatalogField_Controller.prototype.addGetList = function(){
	UserCatalogField_Controller.superclass.addGetList.call(this);
	
	
	
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
	
	pm.addField(new FieldString("id",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("descr",f_opts));
}

			UserCatalogField_Controller.prototype.addGetObject = function(){
	UserCatalogField_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	
	pm.addField(new FieldString("mode"));
}

		