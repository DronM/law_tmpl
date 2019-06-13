/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @extends EditJSON
 * @requires core/extend.js
 * @requires controls/EditJSON.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function DocTemplateFieldEdit(id,options){
	options = options || {};	
	
	this.m_mainView = options.mainView;
//console.log("DocTemplateFieldEdit options.mainView="+options.mainView)	
	var self = this;
	
	this.m_baseAddElement = options.addElement;
	
	options.addElement = function(){
		var bs = window.getBsCol();
		var editContClassName = "input-group "+bs+"10";
		var labelClassName = "control-label "+bs+"2";
	
		this.addElement(new EditString(id+":user_id",{
			"labelCaption":"Идентификатор:",
			"placeholder":"Идентификатор атрибута",
			"title":"Идентификатор, как он задан в шаблоне. Может состоять из букв русского или латинского алфавитов, цифр, нажнего подчеркивания.",
			"editContClassName":editContClassName,
			"labelClassName":labelClassName,
			"regExpression":window.getApp().getUserIdRegExp(),
			"maxLength":"150",
			"events":{
				"keypress":function(){
					this.validate();
				}
			}
		}));

		this.addElement(new EditString(id+":user_label",{
			"labelCaption":"Представление:",
			"placeholder":"Представление атрибута",
			"title":"Как атрибут будет представлен в форме ввода",
			"editContClassName":editContClassName,
			"labelClassName":labelClassName,
			"maxLength":"250"
		}));

		this.addElement(new EditText(id+":comment_text",{
			"labelCaption":"Комментарий:",
			"title":"Описание атрибута",
			"editContClassName":editContClassName,
			"labelClassName":labelClassName,
			"rows":"2"
		}));

		var t_opts = [];		
		var attr_types = window.getApp().getTemplateAttrTypes();
		for(var attr in attr_types){
			t_opts.push({"value":attr,"descr":attr_types[attr].descr});
		}
		
		this.addElement(new EditSelect(id+":data_type",{
			"labelCaption":"Тип данных:",
			"editContClassName":editContClassName,
			"labelClassName":labelClassName,
			"title":"Тип данных атрибута. Определяет наличие дополнительных признаков.",
			"options":t_opts,
			"events":{
				"change":function(){
					self.setDataType(this.getValue());
				}
			}			
		}));
		
		//ControlContainer ,"DIV"
		this.addElement(new EditJSON(id+":data_attr_cont",{
		}));

		this.addElement(this.getTestAttrBtnInstance());
		
		this.addElement(new Control(id+":cmdClose","A",{
			"title":"Удалить атрибут",
			"events":{				
				"click":function(){
					WindowQuestion.show({
						"text":"Удалить атрибут?",
						"cancel":false,
						"callBack":function(res){			
							if (res==WindowQuestion.RES_YES){
								options.onClosePanel.call(self);
							}
						}
					});
				}
			}
		}));

		this.addElement(new Control(id+":cmdMoveUp","A",{
			"title":"Передвинуть атрибут вверх",
			"events":{				
				"click":function(){
					options.onMoveUp(self);
				}
			}
		}));
		this.addElement(new Control(id+":cmdMoveDown","A",{
			"title":"Передвинуть атрибут вниз",
			"events":{				
				"click":function(){
					options.onMoveDown(self);
				}
			}
		}));
		
		if(this.m_baseAddElement)
			this.m_baseAddElement();
	}
	
	DocTemplateFieldEdit.superclass.constructor.call(this,id,options);
}
//ViewObjectAjx,ViewAjxList
extend(DocTemplateFieldEdit,EditJSON);

/* Constants */


/* private members */

/* protected*/


/* public methods */	

/*
DocTemplateFieldEdit.prototype.getValueJSON = function(){
	var o = DocTemplateFieldEdit.superclass.getValueJSON.call(this);
	var attr_types = window.getApp().getTemplateAttrTypes();
	
	var type_attr_cont_list = this.getElement("data_attr_cont").getElements();
	o.data_attr_cont = {};
	for(var id in type_attr_cont_list){
		if (type_attr_cont_list[id] && !type_attr_cont_list[id].getAttr("notForValue")){
			o.data_attr_cont[id] = type_attr_cont_list[id].getValue();
		}
	}
	
	return o;
}

DocTemplateFieldEdit.prototype.setValueOrInit = function(v,isInit){
	DocTemplateFieldEdit.superclass.setValueOrInit.call(this,v,isInit);
	
	//Data type specific attributes
	if (v.data_type){
		this.setDataType(v.data_type);
		if (v.data_attr_cont){	
	
			var type_attr_cont = this.getElement("data_attr_cont");
			var type_attr_cont_list = type_attr_cont.getElements();
		
			for(var id in v.data_attr_cont){
				if (type_attr_cont_list[id] && !type_attr_cont_list[id].getAttr("notForValue")){
					if (isInit && type_attr_cont_list[id].setInitValue){
						type_attr_cont_list[id].setInitValue(v.data_attr_cont[id]);
					}
					else{
						type_attr_cont_list[id].setValue(v.data_attr_cont[id]);
					}
				}
			
			}
		}
	}
}
*/

DocTemplateFieldEdit.prototype.getTestAttrBtnInstance = function(){
	var self = this;
	return (new ButtonCmd(this.getId()+":test",{
		"caption":"Проверить атрибут шаблона",
		"title":"Показать как будет выглядеть атрибут в шаблоне",
		"onClick":function(){
			self.testAttrClick();
		}
	}));
}

DocTemplateFieldEdit.prototype.testAttrClick = function(){
	var dt = this.getElement("data_type").getValue();
	if(!dt || dt=="null"){
		throw Error("Не выбран тип данных!");
	}
	var attr_types = window.getApp().getTemplateAttrTypes();
	var attr_vals = this.getElement("data_attr_cont").getValueJSON();
	attr_vals.labelCaption = this.getElement("user_label").getValue();
	attr_vals.commentText = this.getElement("comment_text").getValue();	
	attr_vals.id = this.getElement("user_id").getValue();//"testAttr";				
	var edit_instance_params = attr_types[dt].getInstanceParams(attr_vals,null,this.m_mainView.getElement("user_functions").getValue());
	var edit_constr  = eval(edit_instance_params.func);
	var edit_instance = new edit_constr("testView:test",CommonHelper.clone(edit_instance_params.options));
	
	var btn_cont = this.getElement("test");
	btn_cont.closeSelect = function(){
		btn_cont.m_view.delDOM();
		btn_cont.m_form.close();
		delete btn_cont.m_view;
		delete btn_cont.m_form;
	}			
	btn_cont.m_view = new ControlContainer("testView:body:view","DIV",{
		"template":window.getApp().getTemplate("DocTemplateTest"),
		"templateOptions":{
			"dataType":attr_types[dt].descr
		},
		"addElement":function(){
			this.addElement(edit_instance);
		}
	});				
	btn_cont.m_form = new WindowFormModalBS("testView",{
		"cmdCancel":true,
		"controlCancelCaption":"Закрыть",
		"controlCancelTitle":"Закрыть",
		"cmdOk":false,
		"dialogWidth":"80%",
		"onClickCancel":function(){
			btn_cont.closeSelect();
		},	
		"content":btn_cont.m_view,
		"contentHead":"Проверка атрибута"
	});

	btn_cont.m_form.open();
	edit_instance.focus();

}

DocTemplateFieldEdit.prototype.setValueOrInit = function(v,isInit){
	//Data type specific attributes
	if (v.data_type){
		this.setDataType(v.data_type);
	}
	
	DocTemplateFieldEdit.superclass.setValueOrInit.call(this,v,isInit);
}

DocTemplateFieldEdit.prototype.setDataType = function(dataType){
	var attr_types = window.getApp().getTemplateAttrTypes();
	var selected_type = attr_types[dataType];
	if (!selected_type){
		throw new Error("Unsupported data type "+dataType);
	}
	
	var type_attr_cont = this.getElement("data_attr_cont");
	type_attr_cont.clear();
	if (selected_type.attributes){
		for(var i=0;i<selected_type.attributes.length;i++){
			var attr_elem = selected_type.attributes[i];
			if (attr_elem.attrOptions.attrOptionsElements){
				var radio_name = "";
				if(attr_elem.attrClass=="EditRadioGroup"){
					radio_name = CommonHelper.uniqid();
				}
				attr_elem.attrOptions.elements = [];
				for(var k=0;k<attr_elem.attrOptions.attrOptionsElements.length;k++){
					if(attr_elem.attrOptions.attrOptionsElements[k].elementClass=="EditRadio"){
						attr_elem.attrOptions.attrOptionsElements[k].elementOptions["name"]=radio_name;
					}
					var constr = eval(attr_elem.attrOptions.attrOptionsElements[k].elementClass);
					attr_elem.attrOptions.elements.push(
						new constr(
							this.getId()+":"+attr_elem.id+":"+attr_elem.attrOptions.attrOptionsElements[k].elementOptions.value,
							CommonHelper.clone(attr_elem.attrOptions.attrOptionsElements[k].elementOptions)
						)
					);
					
				}
			}
			var constr = eval(attr_elem.attrClass);
			type_attr_cont.addElement(
				new constr(
					this.getId()+":"+attr_elem.id,
					CommonHelper.clone(attr_elem.attrOptions)
				)
			);
		}
	}
	type_attr_cont.toDOM();

}
