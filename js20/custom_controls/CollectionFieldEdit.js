/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @extends DocTemplateFieldEdit
 * @requires core/extend.js
 * @requires controls/DocTemplateFieldEdit.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function CollectionFieldEdit(id,options){
	options = options || {};	
	
	options.addElement = function(){
		var bs = window.getBsCol();
		var editContClassName = "input-group "+bs+"10";
		var labelClassName = "control-label "+bs+"2";
	
		this.addElement(new EditCheckBox(id+":column_total",{
			"labelCaption":"Сумма по колонке:",
			"title":"Рассчитывать сумму по колонке",
			"editContClassName":editContClassName,
			"labelClassName":labelClassName,
		}));
		
		this.addElement(new DocAttrEventGrid(id+":event_list",{
			"labelCaption":"Список событий"
		}));
		
	}
		
	CollectionFieldEdit.superclass.constructor.call(this,id,options);
}
//ViewObjectAjx,ViewAjxList
extend(CollectionFieldEdit,DocTemplateFieldEdit);

/* Constants */


/* private members */

/* protected*/


/* public methods */
CollectionFieldEdit.prototype.getTestAttrBtnInstance = function(){
	var self = this;
	return (new ButtonCmd(this.getId()+":test",{
		"caption":"Проверить колонку",
		"title":"Показать как будет выглядеть колонка таблицы в шаблоне",
		"onClick":function(){
			self.testAttrClick();
		}
	}));
}


