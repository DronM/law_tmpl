/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2019

 * @extends ControlContainer
 * @requires core/extend.js
 * @requires controls/ControlContainer.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function EgrulEdit(id,options){
	options = options || {};	
	
	options.template = window.getApp().getTemplate("EgrulEdit");
	options.className = options.className || "form-group";
	
	
	EgrulEdit.superclass.constructor.call(this,id,"DIV",options);
	
	this.m_modified = false;
	
	if (options.valueJSON){
		this.setValue(options.valueJSON);
	}
}
//ViewObjectAjx,ViewAjxList
extend(EgrulEdit,ControlContainer);

/* Constants */


/* private members */

/* protected*/


/* public methods */

