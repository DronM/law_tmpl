/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @requires core/extend.js
 * @requires ControlContainer.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function DocumentFieldValueContainer(id,options){
	options = options || {};	
	
	this.m_elementClass = options.elementClass;
	this.m_elementOptions = options.elementOptions;
	
	this.m_mainView = options.elementOptions.mainView;
	
	this.m_readOnly = options.readOnly;

	var self = this;
	
	options.addElement = function(){
		this.m_container = new ControlContainer(id+":container","DIV");
		this.addElement(this.m_container);
	}
	
	DocTemplateFieldContainer.superclass.constructor.call(this,id,options.tagName,options);
	
	if (options.valueJSON){
		this.setValue(options.valueJSON);
	}
}
//ViewObjectAjx,ViewAjxList
extend(DocumentFieldValueContainer,ControlContainer);

/* Constants */


/* private members */

/* protected*/
DocumentFieldValueContainer.prototype.m_container;
DocumentFieldValueContainer.prototype.m_elementClass;
DocumentFieldValueContainer.prototype.m_elementOptions;

/* public methods */
DocumentFieldValueContainer.prototype.getValue = function(){	
	return CommonHelper.serialize(this.getValueJSON());
}

DocumentFieldValueContainer.prototype.getValueJSON = function(){	
	var o_ar = [];
	var elements = this.m_container.getElements();
	for (var id in elements){
		if (elements[id])
			o_ar[parseInt(elements[id].getAttr("ind"),10)] = (elements[id].getValueJSON());
	}
	return o_ar;
}

DocumentFieldValueContainer.prototype.setValueOrInit = function(v,isInit){
	this.m_container.clear();
	
	var o_ar;
	if (typeof(v)=="string"){
		o_ar = CommonHelper.unserialize(v);
	}
	else{
		o_ar = v;
	}
	for (var i=0;i<o_ar.length;i++){
		var new_elem = this.createNewElement();
		if (isInit && new_elem.setInitValue){
			new_elem.setInitValue(o_ar[i]);
		}
		else{
			new_elem.setValue(o_ar[i]);
		}
		this.m_container.addElement(new_elem);
		new_elem.toDOM(this.m_container.getNode());
	}
	this.addPanelEvents();	
}

DocumentFieldValueContainer.prototype.setValue = function(v){
	this.setValueOrInit(v,false);
}

DocumentFieldValueContainer.prototype.setInitValue = function(v){
	this.setValueOrInit(v,true);
}

DocumentFieldValueContainer.prototype.setValid = function(){
	var elements = this.m_container.getElements();
	for (var id in elements){
		if (elements[id])
			elements[id].setValid();
	}
}

DocumentFieldValueContainer.prototype.setNotValid = function(str){
	//var list = this.getElements();
	//console.log("Error:"+str)
}

DocumentFieldValueContainer.prototype.getModified = function(){
	var res = false;
	var elements = this.m_container.getElements();
	for (var id in elements){
		if (!elements[id] || elements[id].getModified()){
			res = true;
			break;
		}
	}
	return res;
}

DocumentFieldValueContainer.prototype.isNull = function(){
	var res = true;
	var elements = this.m_container.getElements();
	for (var id in elements){
		if (elements[id] && !elements[id].isNull()){
			res = false;
			break;
		}
	}
	return res;
}
