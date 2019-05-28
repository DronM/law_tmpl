/* Copyright (c) 2018
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocTemplateList_Form(options){
	options = options || {};	
	
	options.formName = "DocTemplateList";
	options.controller = "DocTemplate_Controller";
	options.method = "get_list";
	
	DocTemplateList_Form.superclass.constructor.call(this,options);
		
}
extend(DocTemplateList_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

