/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {namespace} options
 */	
function UserCatalogMetadataSelect(id,options){
	options = options || {};
	options.model = new UserCatalogMetadataList_Model();
	
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "Пользовательский справочник:";
	}
	
	options.keyIds = options.keyIds || ["id"];
	options.modelKeyFields = [options.model.getField("id")];
	options.modelDescrFields = [options.model.getField("name")];
	
	var contr = new UserCatalogMetadata_Controller();
	options.readPublicMethod = contr.getPublicMethod("get_list");
	
	UserCatalogMetadataSelect.superclass.constructor.call(this,id,options);
	
}
extend(UserCatalogMetadataSelect,EditSelectRef);

