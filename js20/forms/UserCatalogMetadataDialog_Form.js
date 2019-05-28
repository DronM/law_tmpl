/** Copyright (c) 2018
 *	Andrey Mikhalevich, Katren ltd.
 */
function UserCatalogMetadataDialog_Form(options){
	options = options || {};	
	
	options.formName = "UserCatalogMetadataDialog";
	options.controller = "UserCatalogMetadata_Controller";
	options.method = "get_object";
	
	UserCatalogMetadataDialog_Form.superclass.constructor.call(this,options);
	
}
extend(UserCatalogMetadataDialog_Form,WindowFormObject);

/* Constants */


/* private members */

/* protected*/


/* public methods */

