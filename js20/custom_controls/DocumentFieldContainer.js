/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @requires core/extend.js
 * @requires ControlContainer.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function DocumentFieldContainer(id,options){
	options = options || {};	
	
	
	this.m_readOnly = options.readOnly;

	var self = this;
	
	DocumentFieldContainer.superclass.constructor.call(this,id,options.tagName,options);
	
}
//ViewObjectAjx,ViewAjxList
extend(DocumentFieldContainer,EditJSON);

/* Constants */


/* private members */

