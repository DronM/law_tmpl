/* Copyright (c) 2018
	Andrey Mikhalevich, Katren ltd.
*/
function UserCatalogMetadataDialog_View(id,options){	

	options = options || {};
	options.controller = new UserCatalogMetadata_Controller();
	options.model = options.models.UserCatalogMetadataDialog_Model;
	
	var self = this;
	
	options.addElement = function(){
		this.addElement(new HiddenKey(id+":id"));	
		
		this.addElement(new EditString(id+":user_id",{				
			"regExpression":window.getApp().getUserIdRegExp(),
			"labelCaption":"Идентификатор:",
			"maxLength":100
		}));	

		this.addElement(new EditString(id+":name",{				
			"labelCaption":"Наименование:",
			"maxLength":500
		}));	

		//Структура полей
		this.addElement(new UserCatalogFieldGrid(id+":fields"));		
		
		//Значения
		var field_values_view = new UserCatalogDataList_View(id+":field_values",{
			"template":window.getApp().getTemplate("UserCatalogDataListFromMd"),
			"autoRefresh":true,
			"filters":[{
				"field":"user_catalog_metadata_id",
				"sign":"e",
				"val":options.model.getFieldValue("id")
			}],
			"readOnly":false
			,"metadata":false
		});
		this.addElement(field_values_view);
	}
	
	UserCatalogMetadataDialog_View.superclass.constructor.call(this,id,options);
	
	//****************************************************	
	
	//read
	this.setDataBindings([
		new DataBinding({"control":this.getElement("id")})
		,new DataBinding({"control":this.getElement("user_id")})
		,new DataBinding({"control":this.getElement("name")})
		,new DataBinding({"control":this.getElement("fields")})
	]);
	
	//write
	this.setWriteBindings([
		new CommandBinding({"control":this.getElement("user_id")})
		,new CommandBinding({"control":this.getElement("name")})
		,new CommandBinding({"control":this.getElement("fields"),"fieldId":"fields"})
	]);
	
}
extend(UserCatalogMetadataDialog_View,ViewObjectAjx);


UserCatalogMetadataDialog_View.prototype.initValues = function(){
	var fld = CommonHelper.unserialize(this.getElement("fields").getValue());
	if(fld){
		this.getElement("field_values").defineGrid(fld.rows,this.getElement("id").getValue());
	}
}

UserCatalogMetadataDialog_View.prototype.onGetData = function(resp,cmd){

	UserCatalogMetadataDialog_View.superclass.onGetData.call(this,resp,cmd);
	
	this.initValues();
}

UserCatalogMetadataDialog_View.prototype.onAfterUpsert = function(resp,initControls){
	UserCatalogMetadataDialog_View.superclass.onAfterUpsert.call(this,resp,initControls);
	
	this.initValues();
}
