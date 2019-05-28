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

function DataTypeFieldAlias_Controller(options){
	options = options || {};
	options.listModelClass = DataTypeFieldAlias_Model;
	options.objModelClass = DataTypeFieldAlias_Model;
	DataTypeFieldAlias_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addInsert();
	this.addUpdate();
	this.addDelete();
	this.addGetList();
	this.addGetObject();
		
}
extend(DataTypeFieldAlias_Controller,ControllerObjServer);

			DataTypeFieldAlias_Controller.prototype.addInsert = function(){
	DataTypeFieldAlias_Controller.superclass.addInsert.call(this);
	
	var pm = this.getInsert();
	
	var options = {};
	options.primaryKey = true;	
	options.enumValues = 'users,employees,departments,banks';
	var field = new FieldEnum("data_type",options);
	
	pm.addField(field);
	
	var options = {};
	options.primaryKey = true;
	var field = new FieldString("field",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldString("alias",options);
	
	pm.addField(field);
	
	
}

			DataTypeFieldAlias_Controller.prototype.addUpdate = function(){
	DataTypeFieldAlias_Controller.superclass.addUpdate.call(this);
	var pm = this.getUpdate();
	
	var options = {};
	options.primaryKey = true;	
	options.enumValues = 'users,employees,departments,banks';
	
	var field = new FieldEnum("data_type",options);
	
	pm.addField(field);
	
	field = new FieldEnum("old_data_type",{});
	pm.addField(field);
	
	var options = {};
	options.primaryKey = true;
	var field = new FieldString("field",options);
	
	pm.addField(field);
	
	field = new FieldString("old_field",{});
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldString("alias",options);
	
	pm.addField(field);
	
	
}

			DataTypeFieldAlias_Controller.prototype.addDelete = function(){
	DataTypeFieldAlias_Controller.superclass.addDelete.call(this);
	var pm = this.getDelete();
	var options = {"required":true};
		
	pm.addField(new FieldEnum("data_type",options));
	var options = {"required":true};
		
	pm.addField(new FieldString("field",options));
}

			DataTypeFieldAlias_Controller.prototype.addGetList = function(){
	DataTypeFieldAlias_Controller.superclass.addGetList.call(this);
	
	
	
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
	
	pm.addField(new FieldEnum("data_type",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("field",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("alias",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("data_type,alias");
	
}

			DataTypeFieldAlias_Controller.prototype.addGetObject = function(){
	DataTypeFieldAlias_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldEnum("data_type",f_opts));
	var f_opts = {};
		
	pm.addField(new FieldString("field",f_opts));
	
	pm.addField(new FieldString("mode"));
}

		