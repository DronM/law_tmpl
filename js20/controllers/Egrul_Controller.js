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

function Egrul_Controller(options){
	options = options || {};
	Egrul_Controller.superclass.constructor.call(this,options);	
	
	//methods
	this.add_get_captcha();
	this.add_find();
	this.add_get_cache_list();
	this.add_get_cache_obj();
		
}
extend(Egrul_Controller,ControllerObjServer);

			Egrul_Controller.prototype.add_get_captcha = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('get_captcha',opts);
	
	this.addPublicMethod(pm);
}

			Egrul_Controller.prototype.add_find = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('find',opts);
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "20";
	
		pm.addField(new FieldString("query_id",options));
	
				
	
	var options = {};
	
		options.maxlength = "200";
	
		pm.addField(new FieldString("search_value",options));
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "20";
	
		pm.addField(new FieldString("search_by",options));
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "2";
	
		pm.addField(new FieldString("kind",options));
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "20";
	
		pm.addField(new FieldString("captcha",options));
	
				
	
	var options = {};
	
		pm.addField(new FieldInt("region",options));
	
			
	this.addPublicMethod(pm);
}

			Egrul_Controller.prototype.add_get_cache_list = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('get_cache_list',opts);
	
				
	
	var options = {};
	
		options.maxlength = "5";
	
		pm.addField(new FieldString("ic",options));
	
				
	
	var options = {};
	
		options.maxlength = "5";
	
		pm.addField(new FieldString("mid",options));
	
				
	
	var options = {};
	
		options.maxlength = "100";
	
		pm.addField(new FieldString("ord_fields",options));
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "250";
	
		pm.addField(new FieldString("val",options));
	
			
	this.addPublicMethod(pm);
}

			Egrul_Controller.prototype.add_get_cache_obj = function(){
	var opts = {"controller":this};	
	var pm = new PublicMethodServer('get_cache_obj',opts);
	
				
	
	var options = {};
	
		options.required = true;
	
		options.maxlength = "12";
	
		pm.addField(new FieldString("inn",options));
	
			
	this.addPublicMethod(pm);
}

		