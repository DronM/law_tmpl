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
function FieldGroupEdit(id,options){
	options = options || {};	
	
	FieldGroupEdit.superclass.constructor.call(this,id,options);
}
//ViewObjectAjx,ViewAjxList
extend(FieldGroupEdit,DocTemplateFieldEdit);

/* Constants */


/* private members */

/* protected*/


/* public methods */
FieldGroupEdit.prototype.getTestAttrBtnInstance = function(){
	var self = this;
	return (new ButtonCmd(this.getId()+":test",{
		"caption":"Проверить атрибут группы",
		"title":"Показать как будет выглядеть атрибут группы в шаблоне",
		"onClick":function(){
			self.testAttrClick();
		}
	}));
}


