/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @extends ControlContainer
 * @requires core/extend.js
 * @requires controls/ControlContainer.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function UserCatalogDataEdit(id,options){
	options = options || {};
	
	options.cashable = false;//different types
	options.model = new UserCatalogDataList_Model();
	//
	options.keyIds = options.keyIds || ["id"];
	options.modelKeyFields = [options.model.getField("id")];
	options.modelDescrFormatFunction = function(fields){
		var res;
		var o = fields.field_values.getValue();
		var first_v;
		for(id in o){
			if(o[id].descrField){
				res+= ((res=="")? "":" ")+o[id] ;
			}
			else if(!first_v){
				first_v = o[id];
			}
		}
		return res? res:first_v;
	}
	//[options.model.getField("field_values")];
	
	var contr = new UserCatalogData_Controller();
	options.readPublicMethod = contr.getPublicMethod("get_list");
	
	options.readPublicMethod.setFieldValue(contr.PARAM_COND_FIELDS,"user_catalog_metadata_id");
	options.readPublicMethod.setFieldValue(contr.PARAM_COND_SGNS,contr.PARAM_SGN_EQUAL);
	options.readPublicMethod.setFieldValue(contr.PARAM_COND_VALS,options.mdId);
	
	UserCatalogDataEdit.superclass.constructor.call(this,id,options);
}
//ViewObjectAjx,ViewAjxList
extend(UserCatalogDataEdit,EditSelectRef);

/* Constants */


/* private members */

/* protected*/


/* public methods */

