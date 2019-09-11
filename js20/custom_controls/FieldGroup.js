/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @extends EditJSON
 * @requires core/extend.js
 * @requires controls/.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 * @param {object} options.formContext
 * @param {object} options.userFunctions  
 */
function FieldGroup(id,options){
	options = options || {};	
//console.trace()	
	this.m_formContext = options.formContext;
	this.m_userFunctions = options.userFunctions;//? eval('('+options.userFunctions+')'):null;

	var fields = (typeof(options.fields)=="string")? CommonHelper.unserialize(options.fields):options.fields;
	
	options.templateOptions = {
		"header":options.header
	}
	
	var attr_types = window.getApp().getTemplateAttrTypes();	
	options.elements = [];
	for(var i=0;i<fields.length;i++){
		if (attr_types[fields[i].data_type]){
			
			var attr_vals = fields[i].data_attr_cont;
			if(!this.m_formContext){
				attr_vals.id = this.getId()+":"+fields[i].user_id;
				attr_vals.labelCaption = fields[i].user_label;
				attr_vals.commentText = fields[i].comment_text;				
			
				var edit_instance_params = attr_types[fields[i].data_type].getInstanceParams(attr_vals);
				edit_instance_params.options = edit_instance_params.options || {};
				edit_instance_params.options.labelCaption = fields[i].user_id+":";
				var inst_constr = eval(edit_instance_params.func);
				var edit_instance = new inst_constr(id+":"+fields[i].user_id,edit_instance_params.options);
			}
			else{
				var edit_instance = this.m_formContext.getEditInstance(fields[i],id,this.m_userFunctions);
			}
			options.elements.push(edit_instance);
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

