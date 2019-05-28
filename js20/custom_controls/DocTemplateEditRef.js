/** Copyright (c) 2018 
 *  Andrey Mikhalevich, Katren ltd.
 */
function DocTemplateEditRef(id,options){
	options = options || {};	
	if (options.labelCaption!=""){
		options.labelCaption = options.labelCaption || "Сотрудник:";
	}
	options.cmdInsert = (options.cmdInsert!=undefined)? options.cmdInsert:false;
	
	options.keyIds = options.keyIds || ["id"];
	
	//форма выбора из списка
	options.selectWinClass = DocTemplateList_Form;
	options.selectDescrIds = options.selectDescrIds || ["name"];
	
	//форма редактирования элемента
	options.editWinClass = DocTemplateDialog_Form;
	
	options.acMinLengthForQuery = 1;
	options.acController = new DocTemplate_Controller();
	options.acModel = new DocTemplateList_Model();
	options.acPatternFieldId = options.acPatternFieldId || "name";
	options.acKeyFields = options.acKeyFields || [options.acModel.getField("id")];
	options.acDescrFields = options.acDescrFields || [options.acModel.getField("name")];
	options.acICase = options.acICase || "1";
	options.acMid = options.acMid || "1";
	
	DocTemplateEditRef.superclass.constructor.call(this,id,options);
}
extend(DocTemplateEditRef,EditRef);

/* Constants */


/* private members */

/* protected*/


/* public methods */

