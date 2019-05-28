/** Copyright (c) 2018
 *	Andrey Mikhalevich, Katren ltd.
 */
function DocumentDialog_Form(options){
	options = options || {};	
	
	options.formName = "DocumentDialog";
	options.controller = "Document_Controller";
	options.method = "get_object";
	
	DocumentDialog_Form.superclass.constructor.call(this,options);
	
}
extend(DocumentDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

