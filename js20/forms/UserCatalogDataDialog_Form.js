/** Copyright (c) 2018
 *	Andrey Mikhalevich, Katren ltd.
 */
function UserCatalogDataDialog_Form(options){
	options = options || {};	
	
	options.formName = "UserCatalogDataDialog";
	options.controller = "UserCatalogData_Controller";
	options.method = "get_object";
	
	UserCatalogDataDialog_Form.superclass.constructor.call(this,options);
	
}
extend(UserCatalogDataDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

