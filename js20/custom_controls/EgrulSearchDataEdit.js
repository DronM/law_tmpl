/** Copyright (c) 2018,2019
 *  Andrey Mikhalevich, Katren ltd.
 */
function EgrulSearchDataEdit(id,options){
	
	options = options || {};	
	
	options.viewClass = EgrulSearchData_View;
	//options.viewTemplate = "EgrulSearchDataEdit";
	options.labelCaption = (options.labelCaption==undefined)? "ЕГРЮЛ:":options.labelCaption;
	options.headTitle = "Редактирование данных ЕГРЮЛ";
	
	EgrulSearchDataEdit.superclass.constructor.call(this,id,options);
	
}
extend(EgrulSearchDataEdit,EditModalDialog);

/* Constants */


/* private members */

/* protected*/


/* public methods */

EgrulSearchDataEdit.prototype.formatValue = function(val){
	var descr = "";
	if (val){
		if (val["name"] && val["name"].length) descr+= ((descr=="")? "":", ") + val["name"];
		if (val["inn"] && val["inn"].length) descr+= ((descr=="")? "":", ") + val["inn"];
	}	
	return descr;
}

/* !!!custom structure!!! */
EgrulSearchDataEdit.prototype.getFormattedValue = function(){
	var val = this.getValueJSON();
	return !val? null:{
		"Наименование":val["name"],
		"ИНН":val["inn"],
		"КПП":val["kpp"],
		"ОГРН":val["ogrn"],
		"АдресЮридический":val["address_legal"],
		"РуководительДолжность":val["manager_post"],
		"РуководительФИО":val["manager_name"],
		"ДатаПолученияДанных":val["update_dt"]
	}
}

EgrulSearchDataEdit.prototype.m_onClick = function(){
	
	this.m_oldHash = this.m_valueJSON? CommonHelper.md5(CommonHelper.serialize(this.m_valueJSON)):null;
	this.m_oldKey = this.m_valueJSON? this.m_valueJSON["inn"]:null;

	EgrulSearchDataEdit.superclass.m_onClick.call(this);
}

EgrulSearchDataEdit.prototype.closeSelect = function(){
	EgrulSearchDataEdit.superclass.closeSelect.call(this);

	if(
	this.m_oldHash
	&&this.m_oldHash!=CommonHelper.md5(CommonHelper.serialize(this.m_valueJSON))
	&&this.m_oldKey==this.m_valueJSON["inn"]
	){
		var self = this;
		WindowQuestion.show({
			"yes":true,"no":true,"cancel":false,"text":"Данные изменены, записать?",
			"callBack":function(res){
				if(res==WindowQuestion.RES_YES){
					var v = self.getFormattedValue();
					var data = {
						"name":v["Наименование"],
						"inn":v["ИНН"],
						"kpp":v["КПП"],
						"ogrn":v["ОГРН"],
						"address_legal":v["АдресЮридический"],
						"manager_post":v["РуководительДолжность"],
						"manager_name":v["РуководительФИО"]
					}
					var pm = (new EgrulSearchData_Controller()).getPublicMethod("update");
					pm.setFieldValue("old_inn",self.m_valueJSON["inn"]);
					pm.setFieldValue("data",data);
					pm.run();
				}
			}
		});
	}
	
}
