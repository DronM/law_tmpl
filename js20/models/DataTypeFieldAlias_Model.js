/**	
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/models/Model_js.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 *
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 * @class
 * @classdesc Model class. Created from template build/templates/models/Model_js.xsl. !!!DO NOT MODEFY!!!
 
 * @extends ModelXML
 
 * @requires core/extend.js
 * @requires core/ModelXML.js
 
 * @param {string} id 
 * @param {Object} options
 */

function DataTypeFieldAlias_Model(options){
	var id = 'DataTypeFieldAlias_Model';
	options = options || {};
	
	options.fields = {};
	
			
				
				
			
				
	
	var filed_options = {};
	filed_options.primaryKey = true;	
	
	filed_options.autoInc = false;	
	
	options.fields.data_type = new FieldEnum("data_type",filed_options);
	filed_options.enumValues = 'users,employees,departments,banks';
	
				
	
	var filed_options = {};
	filed_options.primaryKey = true;	
	
	filed_options.autoInc = false;	
	
	options.fields.field = new FieldString("field",filed_options);
	options.fields.field.getValidator().setMaxLength('100');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.alias = new FieldString("alias",filed_options);
	options.fields.alias.getValidator().setMaxLength('100');
	
		DataTypeFieldAlias_Model.superclass.constructor.call(this,id,options);
}
extend(DataTypeFieldAlias_Model,ModelXML);

