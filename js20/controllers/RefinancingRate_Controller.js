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

function RefinancingRate_Controller(options){
	options = options || {};
	options.listModelClass = RefinancingRate_Model;
	options.objModelClass = RefinancingRate_Model;
	RefinancingRate_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addInsert();
	this.addUpdate();
	this.addDelete();
	this.addGetList();
	this.addGetObject();
		
}
extend(RefinancingRate_Controller,ControllerObjServer);

			RefinancingRate_Controller.prototype.addInsert = function(){
	RefinancingRate_Controller.superclass.addInsert.call(this);
	
	var pm = this.getInsert();
	
	var options = {};
	options.primaryKey = true;
	var field = new FieldDate("set_date",options);
	
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldFloat("rate",options);
	
	pm.addField(field);
	
	
}

			RefinancingRate_Controller.prototype.addUpdate = function(){
	RefinancingRate_Controller.superclass.addUpdate.call(this);
	var pm = this.getUpdate();
	
	var options = {};
	options.primaryKey = true;
	var field = new FieldDate("set_date",options);
	
	pm.addField(field);
	
	field = new FieldDate("old_set_date",{});
	pm.addField(field);
	
	var options = {};
	
	var field = new FieldFloat("rate",options);
	
	pm.addField(field);
	
	
}

			RefinancingRate_Controller.prototype.addDelete = function(){
	RefinancingRate_Controller.superclass.addDelete.call(this);
	var pm = this.getDelete();
	var options = {"required":true};
		
	pm.addField(new FieldDate("set_date",options));
}

			RefinancingRate_Controller.prototype.addGetList = function(){
	RefinancingRate_Controller.superclass.addGetList.call(this);
	
	
	
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
	
	pm.addField(new FieldDate("set_date",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldFloat("rate",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("set_date");
	
}

			RefinancingRate_Controller.prototype.addGetObject = function(){
	RefinancingRate_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldDate("set_date",f_opts));
	
	pm.addField(new FieldString("mode"));
}

		