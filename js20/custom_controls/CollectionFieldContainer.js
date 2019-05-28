/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @extends DocTemplateFieldContainer
 * @requires core/extend.js
 * @requires custom_controls/DocTemplateFieldContainer.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function CollectionFieldContainer(id,options){
	options = options || {};	
	
	options.panelClass = "collectionPanel";
	
	options.elementClass = CollectionFieldEdit;	
	options.elementOptions = {
		"template":window.getApp().getTemplate("CollectionField"),
		"templateOptions":{
			"title":"Сведения об атрибуте группы"
		}
	}
	
	CollectionFieldContainer.superclass.constructor.call(this,id,options);
}
//ViewObjectAjx,ViewAjxList
extend(CollectionFieldContainer,DocTemplateFieldContainer);

/* Constants */


/* private members */

/* protected*/


/* public methods */
CollectionFieldContainer.prototype.addCommands = function(){	
	var self = this;
	this.addElement(new ButtonCmd(this.getId()+":cmdAdd",{
		"glyph":"glyphicon-plus",
		"title":"Добавить колонку в таблицу",
		"caption":"Добавить колонку в таблицу ",
		"onClick":function(){
			self.addAttrClick();
		}
	}));
}


