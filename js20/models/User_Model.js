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

function User_Model(options){
	var id = 'User_Model';
	options = options || {};
	
	options.fields = {};
	
			
				
			
				
	
	var filed_options = {};
	filed_options.primaryKey = true;	
	
	filed_options.autoInc = true;	
	
	options.fields.id = new FieldInt("id",filed_options);
	options.fields.id.getValidator().setRequired(true);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.name = new FieldString("name",filed_options);
	options.fields.name.getValidator().setRequired(true);
	options.fields.name.getValidator().setMaxLength('50');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.role_id = new FieldEnum("role_id",filed_options);
	filed_options.enumValues = 'admin,lawyer';
	options.fields.role_id.getValidator().setRequired(true);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.email = new FieldString("email",filed_options);
	options.fields.email.getValidator().setMaxLength('50');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.pwd = new FieldPassword("pwd",filed_options);
	options.fields.pwd.getValidator().setMaxLength('32');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	filed_options.alias = 'Дата создания';
	filed_options.autoInc = false;	
	
	options.fields.create_dt = new FieldDateTimeTZ("create_dt",filed_options);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	filed_options.defValue = true;
	filed_options.alias = 'Адрес электр.почты подтвержден';
	filed_options.autoInc = false;	
	
	options.fields.email_confirmed = new FieldBool("email_confirmed",filed_options);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.locale_id = new FieldEnum("locale_id",filed_options);
	filed_options.enumValues = 'ru';
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	filed_options.alias = 'Цветовая схема';
	filed_options.autoInc = false;	
	
	options.fields.color_palette = new FieldText("color_palette",filed_options);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.phone_cel = new FieldString("phone_cel",filed_options);
	options.fields.phone_cel.getValidator().setMaxLength('10');
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	
	filed_options.autoInc = false;	
	
	options.fields.time_zone_locale_id = new FieldInt("time_zone_locale_id",filed_options);
	
				
	
	var filed_options = {};
	filed_options.primaryKey = false;	
	filed_options.defValue = true;
	
	filed_options.autoInc = false;	
	
	options.fields.banned = new FieldBool("banned",filed_options);
	
			
		User_Model.superclass.constructor.call(this,id,options);
}
extend(User_Model,ModelXML);

