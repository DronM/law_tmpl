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
function FieldGroupContainer(id,options){
	options = options || {};	
	
	options.panelClass = "collectionPanel";
	
	options.elementClass = FieldGroupEdit;	
	options.elementOptions = {
		"template":window.getApp().getTemplate("CollectionField"),
		"templateOptions":{
			"title":"Сведения об атрибуте группы"
		}
	}
	
	FieldGroupContainer.superclass.constructor.call(this,id,options);
}
//ViewObjectAjx,ViewAjxList
extend(FieldGroupContainer,DocTemplateFieldContainer);

/* Constants */


/* private members */

/* protected*/


/* public methods */
FieldGroupContainer.prototype.addCommands = function(){	
	var self = this;
	this.addElement(new ButtonCmd(this.getId()+":cmdAdd",{
		"glyph":"glyphicon-plus",
		"title":"Добавить новый атрибут в группу",
		"caption":"Добавить атрибут в группу ",
		"onClick":function(){
			self.addAttrClick();
		}
	}));
	/*
	this.addElement(new ButtonCmd(this.getId()+":cmdCollapseAttrs",{
		"glyph":"glyphicon-collapse-up",
		"title":"Свернуть все атрибуты группы",
		"onClick":function(){
			alert("cmdCollapseAttrs")
			//self.addAttrClick();
		}
	}));
	this.addElement(new ButtonCmd(this.getId()+":cmdExpandAttrs",{
		"glyph":"glyphicon-collapse-down",
		"title":"Развернуть все атрибуты группы",
		"onClick":function(){
			alert("cmdExpandAttrs")
			//self.addAttrClick();
		}
	}));
	*/
}

FieldGroupContainer.prototype.setValueOrInit = function(v,isInit){
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
	
}
