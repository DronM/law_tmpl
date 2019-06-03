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
		"РуководительФИО":val["manager_name"]
	}
}
