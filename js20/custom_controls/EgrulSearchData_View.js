function EgrulSearchData_View(id,options){

	options = options || {};
	
	options.className = options.className || "form-group";
	
	this.m_id = id;
	var self = this;
	
	options.addElement = function(){
		//var id = this.getId();

		this.addElement(new Control(id+":update_dt","DIV",{
		}));
		
		/*
		this.addElement(new ButtonCmd(id+":refresh",{
			"caption":"Обновить",
			"title":"Обновить данные из базы ЕГРЮЛ",
			//"visible":false,
			"onClick":function(){
				self.refreshData();
			}
		}));
		*/
		
		//var bs = window.getBsCol(4);
		var ac_model = new EgrulSearchData_Model();
		var ac_contr = new EgrulSearchData_Controller();
		this.addElement(new EditString(id+":name",{
			"buttonOpen":new ButtonOrgSearch(id+":name:cmd-search",{"viewContext":this}),
			"attrs":{"autofocus":"true"},
			"labelCaption":"Наименование:",
			"placeholder":"ИНН,наименование или ОГРН организации/ИП",
			"cmdAutoComplete":true,
			"acMinLengthForQuery":1,
			"acController":ac_contr,
			"acModel":ac_model,
			"acPatternFieldId":"inn",
			"acKeyFields":[ac_model.getField("inn")],
			"acDescrFields":[ac_model.getField("name"),ac_model.getField("inn"),ac_model.getField("ogrn")],
			"acICase":"1",
			"acMid":"1",
			"acPublicMethod":ac_contr.getPublicMethod("complete"),
			"onGetData":function(model){
				if(model.getNextRow()){
					self.onGetEGRULData(model.getFieldValue("data"),model.getFieldValue("update_dt"));
				}			
			},
			"onSelect":function(f){
				self.onGetEGRULData(f.data.getValue(),f.update_dt.getValue());
			},
			"onClear":function(){				
				DOMHelper.hide(self.m_id+":update_cont");	
				self.getElement("update_dt").setValue("");
			}
		}));
	
		this.addElement(new EditNum(id+":inn",{
			"labelCaption":"ИНН:",
			"maxLength":"12"
		}));
		this.addElement(new EditNum(id+":kpp",{
			"labelCaption":"КПП:",
			"maxLength":"10"
		}));
		this.addElement(new EditNum(id+":ogrn",{
			"labelCaption":"ОГРН:",
			"maxLength":"20"
		}));
		
		this.addElement(new EditString(id+":address_legal",{
			"labelCaption":"Юридический адрес:",
			"maxLength":"250"
		}));
		this.addElement(new EditString(id+":manager_name",{
			"labelCaption":"ФИО руководителя:",
			"maxLength":"250"
		}));
		
		this.addElement(new EditString(id+":manager_post",{
			"labelCaption":"Должность руководителя:",
			"maxLength":"250"
		}));
		
	}	
	EgrulSearchData_View.superclass.constructor.call(this,id,options);
	
}
extend(EgrulSearchData_View,EditJSON);

EgrulSearchData_View.prototype.refreshData = function(){
	//alert("EgrulSearchData_View")
	this.getElement("name").getButtonOpen().doSearch(true);
}

EgrulSearchData_View.prototype.toDOM = function(p){
	EgrulSearchData_View.superclass.toDOM.call(this,p)
	
	if(this.getElement("update_dt").getValue()){
		DOMHelper.show(self.m_id+":update_cont");
	}
}

EgrulSearchData_View.prototype.onGetEGRULData = function(data,update_dt){
	for(var f_id in data){
		var el = this.getElement(f_id);
		if(el)
			el.setValue(data[f_id]);
	}
	this.getElement("update_dt").setValue(DateHelper.format(update_dt,"d/m/y"));
	DOMHelper.show(this.m_id+":update_cont");

}
