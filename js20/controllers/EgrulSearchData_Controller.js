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

function EgrulSearchData_Controller(options){
	options = options || {};
	options.listModelClass = EgrulSearchData_Model;
	options.objModelClass = EgrulSearchData_Model;
	EgrulSearchData_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.addGetList();
	this.addGetObject();
	this.addComplete();
	this.add_search();
		
}
extend(EgrulSearchData_Controller,ControllerObjServer);

			EgrulSearchData_Controller.prototype.addGetList = function(){
	EgrulSearchData_Controller.superclass.addGetList.call(this);
	
	
	
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
	
	pm.addField(new FieldString("inn",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldString("ogrn",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldText("name",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldJSON("data",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldInt("user_id",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldDateTimeTZ("create_dt",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldDateTimeTZ("update_dt",f_opts));
	var f_opts = {};
	
	pm.addField(new FieldInt("update_count",f_opts));
}

			EgrulSearchData_Controller.prototype.addGetObject = function(){
	EgrulSearchData_Controller.superclass.addGetObject.call(this);
	
	var pm = this.getGetObject();
	var f_opts = {};
		
	pm.addField(new FieldString("inn",f_opts));
	
	pm.addField(new FieldString("mode"));
}

			EgrulSearchData_Controller.prototype.addComplete = function(){
	EgrulSearchData_Controller.superclass.addComplete.call(this);
	
	var f_opts = {};
	
	var pm = this.getComplete();
	pm.addField(new FieldString("inn",f_opts));
	pm.getField(this.PARAM_ORD_FIELDS).setValue("inn");	
}

			EgrulSearchData_Controller.prototype.add_search = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('search',opts);
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "250";
	
		pm.addField(new FieldString("query",options));
	
			
	this.addPublicMethod(pm);
}

		