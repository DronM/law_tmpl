/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2019

 * @extends Control
 * @requires core/extend.js
 * @requires controls/Control.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function StaticText(id,options){
	options = options || {};	
	
	StaticText.superclass.constructor.call(this,id,options.tagName, options);
}
//ViewObjectAjx,ViewAjxList
extend(StaticText,Control);

/* Constants */


/* private members */

/* protected*/


/* public methods */

