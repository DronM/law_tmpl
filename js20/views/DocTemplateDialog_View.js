/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018
 
 * @extends ViewObjectAjx.js
 * @requires core/extend.js  
 * @requires controls/ViewObjectAjx.js 
 
 * @class
 * @classdesc
	
 * @param {string} id view identifier
 * @param {object} options
 * @param {object} options.models All data models
 * @param {object} options.variantStorage {name,model}
 */	
function DocTemplateDialog_View(id,options){	

	options = options || {};
	
	options.controller = new DocTemplate_Controller();
	options.model = options.models.DocTemplateDialog_Model;
	
	var self = this;
	
	options.addElement = function(){
		this.addElement(new EditString(id+":name",{
			"labelCaption":"Наименование",
			"required":true,
			"maxLength":100,
			"required":true
		}));	

		this.addElement(new EditText(id+":comment_text",{			
			"labelCaption":"Комментарий",
		}));	

		this.addElement(new EditString(id+":document_prefix",{
			"labelCaption":"Префикс номеров документов:",
			"maxLength":"10",
			"required":true,
			"regExpression":new RegExp(/^\D+-*$/),
			"regExpressionInvalidMessage":"Префикс должен состоять только из букв и/или знака тире (-)",
			"required":true
		}));	
	
		this.addElement(new EmployeeEditRef(id+":employees_ref",{			
			"labelCaption":"Автор:",
			"enabled":(window.getApp().getServVar("role_id")=="admin"),
			"value":CommonHelper.unserialize(window.getApp().getServVar("employees_ref"))
		}));	
		
		//*********** fields *******************************
		this.addElement(new DocTemplateFieldContainer(id+":fields",{
			"readOnly":options.readOnly,
			"elementClass":DocTemplateFieldEdit,
			"templateOptions":{},
			"elementOptions":{
				"mainView":this,
				"template":window.getApp().getTemplate("DocTemplateField"),
				"templateOptions":{}
			}
		}));	
		//**************************************************
		
		
		//********* permissions grid ***********************
		this.addElement(new AccessPermissionGrid(id+":permissions"));

		this.addElement(new EditCheckBox(id+":for_all_employees",{
			"labelCaption":"Разрешить использование шаблона для всех сотрудников"
		}));
		
		this.addElement(new EditFile(id+":template_file",{
			"labelClassName": "control-label",
			"labelCaption":"Файл шаблона",
			//"required":true,
			"template":window.getApp().getTemplate("EditFile"),
			"mainView":this,
			"onDeleteFile":function(fileId,callBack){
				self.deleteTemplate(fileId,callBack);
			},
			"onDownload":function(fileId,callBack){
				self.downloadTemplate(fileId,callBack);
			}
		}));	
		
		this.addElement(new EditText(id+":user_functions",{
			"rows":"15"
		}));
		
	}
	
	DocTemplateDialog_View.superclass.constructor.call(this,id,options);
	
	//****************************************************
	//read
	this.setDataBindings([
		new DataBinding({"control":this.getElement("name")})
		,new DataBinding({"control":this.getElement("comment_text")})
		,new DataBinding({"control":this.getElement("employees_ref"),"fieldId":"employee_id"})
		,new DataBinding({"control":this.getElement("permissions")})
		,new DataBinding({"control":this.getElement("for_all_employees")})
		,new DataBinding({"control":this.getElement("fields")})
		,new DataBinding({"control":this.getElement("document_prefix")})
		,new DataBinding({"control":this.getElement("template_file")})
		,new DataBinding({"control":this.getElement("user_functions")})
	]);
	
	//write
	this.setWriteBindings([
		new CommandBinding({"control":this.getElement("name")})
		,new CommandBinding({"control":this.getElement("comment_text")})
		,new CommandBinding({"control":this.getElement("permissions"),"fieldId":"permissions"})
		,new CommandBinding({"control":this.getElement("employees_ref"),"fieldId":"employee_id"})
		,new CommandBinding({"control":this.getElement("for_all_employees")})
		,new CommandBinding({"control":this.getElement("fields")})
		,new CommandBinding({"control":this.getElement("document_prefix")})
		,new CommandBinding({"control":this.getElement("template_file"),"fieldId":"template_file_data"})
		,new CommandBinding({"control":this.getElement("user_functions")})
	]);
		
}
extend(DocTemplateDialog_View,ViewObjectAjx);


DocTemplateDialog_View.prototype.validate = function(cmd,validate_res){
	DocTemplateDialog_View.superclass.validate.call(this,cmd,validate_res);
	
	var funcs = this.getElement("user_functions").getValue();
	if(funcs){
		try{
			eval('('+funcs+')');
		}
		catch(e){
			this.getElement("user_functions").setNotValid(e.message);
			validate_res.incorrect_vals = true;
		}
	}
}

DocTemplateDialog_View.prototype.collapseGroup = function(groupCtrl){
	var elem_list = groupCtrl.m_container.getElements();
	for(var elem_id in elem_list){		
		if(elem_list[elem_id]
		&&elem_list[elem_id].getElement
		&&elem_list[elem_id].getElement("data_type")
		&&elem_list[elem_id].getElement("data_type").getValue()=="fieldGroup"
		){
			this.collapseGroup(elem_list[elem_id].getElement("data_attr_cont").m_elements.fields);			
		}
	}
	groupCtrl.doCollapse(true);
}

DocTemplateDialog_View.prototype.onGetData = function(resp,cmd){
	DocTemplateDialog_View.superclass.onGetData.call(this,resp,cmd);

	this.m_readOnly = (
		this.getModel().getFieldValue("id")
		&& window.getApp().getServVar("role_id")!="admin"
		&& CommonHelper.unserialize(window.getApp().getServVar("employees_ref")).getKey()!=this.getModel().getFieldValue("employees_ref").getKey()
	);
	
	if (this.m_readOnly){
		this.setEnabled(false);
	}
	else{
		var f_ctrl = this.getElement("fields");
		//this.collapseGroup(f_ctrl);
		//f_ctrl.doCollapse(true);
	}
}

DocTemplateDialog_View.prototype.deleteTemplate = function(fileId,callBack){
	var self = this;
	WindowQuestion.show({
		"text":"Удалить шаблон?",
		"cancel":false,
		"callBack":function(res){			
			if (res==WindowQuestion.RES_YES){
				var pm = self.getController().getPublicMethod("delete_template");
				pm.setFieldValue("doc_id",self.getElement("id").getValue());
				pm.setFieldValue("file_id",fileId);
				pm.run({
					"ok":callBack
				});
			}
		}
	});			
}
DocTemplateDialog_View.prototype.downloadTemplate = function(fileId,callBack){
	var pm = this.getController().getPublicMethod("get_template");
	pm.setFieldValue("doc_id",this.getElement("id").getValue());
	pm.setFieldValue("file_id",fileId);
	pm.download();

}

DocTemplateDialog_View.prototype.onAfterUpsert = function(resp,initControls){	
	DocTemplateDialog_View.superclass.onAfterUpsert.call(this,resp,false);	
}
