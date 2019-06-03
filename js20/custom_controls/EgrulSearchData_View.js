function EgrulSearchData_View(id,options){

	options = options || {};
	
	options.className = options.className || "form-group";
	
	var self = this;
	
	options.addElement = function(){
		var id = this.getId();
		
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
			"onSelect":function(f){
				var fields = f.data.getValue();
				for(var f_id in fields){
					var el = self.getElement(f_id);
					if(el)
						el.setValue(fields[f_id]);
				}
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
			"labelCaption":"АдресЮридический:",
			"maxLength":"250"
		}));
		this.addElement(new EditString(id+":manager_name",{
			"labelCaption":"РуководительФИО:",
			"maxLength":"250"
		}));
		
		this.addElement(new EditString(id+":manager_post",{
			"labelCaption":"РуководительДолжность:",
			"maxLength":"250"
		}));
		
	}	
	EgrulSearchData_View.superclass.constructor.call(this,id,options);
	
}
extend(EgrulSearchData_View,EditJSON);
