/** Copyright (c) 2018
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocTemplateDialog_Form(options){
	options = options || {};	
	
	options.formName = "DocTemplateDialog";
	options.controller = "DocTemplate_Controller";
	options.method = "get_object";
	
	DocTemplateDialog_Form.superclass.constructor.call(this,options);
	
}
extend(DocTemplateDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

