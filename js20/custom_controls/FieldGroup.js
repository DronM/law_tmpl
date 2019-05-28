/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @extends EditJSON
 * @requires core/extend.js
 * @requires controls/.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function FieldGroup(id,options){
	options = options || {};	
	
	var fields = (typeof(options.fields)=="string")? CommonHelper.unserialize(options.fields):options.fields;
	
	options.templateOptions = {
		"header":options.header
	}
	
	var attr_types = window.getApp().getTemplateAttrTypes();	
	options.elements = [];
	for(var i=0;i<fields.length;i++){
		var selected_type = attr_types[fields[i].data_type];
		if (selected_type){
			var inst_params = selected_type.getInstanceParams(fields[i].data_attr_cont);
			inst_params.options = inst_params.options || {};
			inst_params.options.labelCaption = fields[i].user_id+":";
			var inst_constr = eval(inst_params.func);
			var inst = new inst_constr(id+":"+fields[i].user_id,inst_params.options);
			options.elements.push(inst);
		}		
	}
	
	FieldGroup.superclass.constructor.call(this,id,options);
}
//ViewObjectAjx,ViewAjxList
extend(FieldGroup,EditJSON);

/* Constants */


/* private members */

/* protected*/


/* public methods */

