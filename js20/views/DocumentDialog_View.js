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
function DocumentDialog_View(id,options){	

	options = options || {};
	
	options.controller = new Document_Controller();
	
	if(options.test){
	
		options.model = new DocumentDialog_Model();
		//options.model.setFieldValue("field_values",options.field_values);
		//options.model.setFieldValue("user_functions",options.userFunctions);
		options.model.recInsert();
	
		options.template = window.getApp().getTemplate("DocumentTest");
		options.addElement = function(){
			this.addElement(new EditJSON(id+":field_values",{
			}));		
		}
	
		options.cmdCancel = false;
		options.cmdOk = false;
		options.cmdSave = false;
	
		DocumentDialog_View.superclass.constructor.call(this,id,options);
		
	}
	else{
		options.model = (options.models&&options.models.DocumentDialog_Model)? options.models.DocumentDialog_Model:new DocumentDialog_Model();
	
		var self = this;
	
		var is_admin = (window.getApp().getServVar("role_id")=="admin");
		
		options.addElement = function(){
			this.addElement(new EditDateTime(id+":date_time",{
				"attrs":{"style":"width:250px;"},
				"inline":true,
				"dateFormat":"d/m/Y H:i",
				"cmdClear":false,
				"cmdSelect":false,
				"enabled":false,
				"required":false
			}));	
			this.addElement(new EditString(id+":doc_number",{
				"attrs":{"style":"width:150px;"},
				"inline":true,
				"cmdClear":false,
				"maxLength":"10",
				"enabled":false,
				"required":false
			}));	

			this.addElement(new EditText(id+":comment_text",{
				"labelCaption":"Комментарий",
				"rows":3
			}));	

			this.addElement(new DocTemplateEditRef(id+":doc_templates_ref",{
				"labelCaption":"Шаблон:",
				"required":true,
				"onClear":function(){
					self.renderTemplate(null,null,true,null);
				},
				"onSelect":function(fields){
					var pm = (new DocTemplate_Controller()).getPublicMethod("get_object");
					pm.setFieldValue("id",fields.id.getValue());
					pm.run({
						"ok":function(resp){
							var m = resp.getModel("DocTemplateDialog_Model");
							if(m.getNextRow()){
								self.renderTemplate(m.getFieldValue("fields"),null,true,m.getFieldValue("user_functions"));
							}
						}
					})
				}
			}));	

			this.addElement(new EmployeeEditRef(id+":employees_ref",{
				"labelCaption":"Сотрудник:",
				"value":CommonHelper.unserialize(window.getApp().getServVar("employees_ref")),
				"required":false,
				"enabled":is_admin
			}));		
			
			this.addElement(new EditJSON(id+":field_values",{
			}));		

			//********* permissions grid ***********************
			this.addElement(new AccessPermissionGrid(id+":permissions"));

			this.addElement(new EditCheckBox(id+":for_all_employees",{
				"labelCaption":"Разрешить использование документа для всех сотрудников",
				"value":true
			}));

			this.addElement(new ButtonCmd(id+":cmdProcess",{
				"caption":"Создать по шаблону",
				"title":"Создать новый документ по заполненному шаблону",
				"onClick":function(){
					if (!self.getModified()){
						self.getDocument();
					}
					else{
						self.getControlOK().setEnabled(false);
						self.getControlSave().setEnabled(false);
						self.onSave(
							function(){
								self.process(function(){
									self.getDocument();
								});
							},
							null,
							function(){
								self.getControlOK().setEnabled(true);
								self.getControlSave().setEnabled(true);				
							}
						);								
					}					
				}
			}));	
		
			/*				
			this.addElement(new EditFile(id+":picture_file",{
				"labelCaption":"Фотография:",
				"onDownload":function(){
					self.downloadPicture();
				},
				"onDeleteFile":function(){
					self.deletePicture();
				}
			
			}));		
			*/
			if(options.models&&options.models.DocTemplateDialog_Model&&options.models.DocTemplateDialog_Model.getNextRow()){
				options.model.getNextRow();				
				this.renderTemplate(options.models.DocTemplateDialog_Model.getFieldValue("fields"),options.model,false,options.models.DocTemplateDialog_Model.getFieldValue("user_functions"));
			}
			
			this.addElement(new ButtonCtrl(id+":document_delete",{
				"glyph":"glyphicon-remove",
				"title":"Удалить документ",
				"visible":false,
				"onClick":function(){
					self.deleteDocument();
				}
			}));
										
		}
	
		DocumentDialog_View.superclass.constructor.call(this,id,options);

		//****************************************************
		//read
		this.setDataBindings([
			new DataBinding({"control":this.getElement("date_time")})
			,new DataBinding({"control":this.getElement("doc_number")})
			,new DataBinding({"control":this.getElement("doc_templates_ref"),"fieldId":"doc_templates_ref"})
			,new DataBinding({"control":this.getElement("employees_ref"),"fieldId":"employees_ref"})
			,new DataBinding({"control":this.getElement("comment_text")})
			,new DataBinding({"control":this.getElement("field_values"),"fieldId":"field_values"})
			,new DataBinding({"control":this.getElement("permissions")})
			,new DataBinding({"control":this.getElement("for_all_employees")})
		]);
	
		//write
		this.setWriteBindings([
			new CommandBinding({"control":this.getElement("date_time")})
			,new CommandBinding({"control":this.getElement("doc_number")})
			,new CommandBinding({"control":this.getElement("doc_templates_ref"),"fieldId":"doc_template_id"})
			,new CommandBinding({"control":this.getElement("employees_ref"),"fieldId":"employee_id"})
			,new CommandBinding({"control":this.getElement("comment_text")})		
			,new CommandBinding({"control":this.getElement("field_values"),"fieldId":"field_values"})
			,new CommandBinding({"control":this.getElement("permissions"),"fieldId":"permissions"})
			,new CommandBinding({"control":this.getElement("for_all_employees")})
		]);
		
	}		
}
extend(DocumentDialog_View,ViewObjectAjx);

DocumentDialog_View.prototype.getEditInstance = function(templateField,containerId,userFunctions){
	var attr_types = window.getApp().getTemplateAttrTypes();
	
	var attr_vals = templateField.data_attr_cont;	
	attr_vals.id = this.getId()+":"+templateField.user_id;
	attr_vals.labelCaption = templateField.user_label;
	attr_vals.commentText = templateField.comment_text;				
	
	var edit_instance_params = attr_types[templateField.data_type].getInstanceParams(attr_vals,this,userFunctions);
	//edit_instance_params.value = templateField.
	var edit_instance_constr = eval(edit_instance_params.func);
	var edit_instance = new edit_instance_constr(
		containerId+":"+templateField.user_id,
		edit_instance_params.options
	);
	return edit_instance;
}
DocumentDialog_View.prototype.renderTemplate = function(templateFields,values,toDOM,userFunctions){
	this.m_userFunctions = userFunctions? eval('('+userFunctions+')'):null;
	/*if(!templateFields){
		throw new Error("Данный шаблон не содержит атрибутов!");
	}*/
	
	var field_values_ctrl = this.getElement("field_values");
	field_values_ctrl.clear();	
	
	if(templateFields){
		//var app = window.getApp();
		var attr_types = window.getApp().getTemplateAttrTypes();
		var ind = 0;
		for(var i=0;i<templateFields.length;i++){
			if (attr_types[templateFields[i].data_type]){
				/*
				var attr_vals = templateFields[i].data_attr_cont;
				
				attr_vals.id = this.getId()+":"+templateFields[i].user_id;
				attr_vals.labelCaption = templateFields[i].user_label;
				attr_vals.commentText = templateFields[i].comment_text;				
				
				var edit_instance_params = attr_types[templateFields[i].data_type].getInstanceParams(attr_vals,this,userFunctions);
				//edit_instance_params.value = templateFields[i].
				var edit_instance_constr = eval(edit_instance_params.func);
				var edit_instance = new edit_instance_constr(
					field_values_ctrl.getId()+":"+templateFields[i].user_id,
					edit_instance_params.options
				);
				*/
				var edit_instance = this.getEditInstance(templateFields[i],field_values_ctrl.getId(),this.m_userFunctions);
				field_values_ctrl.addElement(edit_instance);//edit_cont
				ind++;
			}
		}
	}
		
	if(toDOM){
		field_values_ctrl.toDOM();
		this.initUserFunctions();
	}		
}

DocumentDialog_View.prototype.get_formatted_value = function(control){
	var val;
	if(control.getFormattedValue){
		val = control.getFormattedValue();
	}
	else{
		val = control.getValue();
		if(typeof(val)=="object"){
			val = this.get_formatted_value(val);
		}
	}
	return val;
}

DocumentDialog_View.prototype.get_formatted_values = function(control,values){
	var elemets = control.getElements();
	for (var elem_id in elemets){
		//input elements
		if (elemets[elem_id] && !elemets[elem_id].getAttr("notForValue") && elemets[elem_id].getVisible()){
			if (elemets[elem_id] instanceof EditJSON){
				values[elem_id] = {};
				this.get_formatted_values(elemets[elem_id],values[elem_id]);
			}
			else{
				values[elem_id] = this.get_formatted_value(elemets[elem_id]);
			}
		}
	}
}

DocumentDialog_View.prototype.getDocument = function(){
	var self = this;
	var pm = this.getController().getPublicMethod("get_document");
	pm.setFieldValue("doc_id",this.getElement("id").getValue());
	pm.download(null,0,function(res,descr){
		if(res==101){//not genereated
			self.process(function(resp){
				self.getDocument();
			});
		}
		else if(res && descr && descr.length){//error
			throw Error(descr);
		}
	});	
}

DocumentDialog_View.prototype.process = function(callBack){
	values = {};	
	this.get_formatted_values(this.getElement("field_values"),values);
	console.dir(values)
	
	var pm = this.getController().getPublicMethod("process");
	pm.setFieldValue("doc_id",this.getElement("id").getValue());
	pm.setFieldValue("field_values",CommonHelper.serialize(values));
	var self = this;
	pm.run({
		"ok":function(resp){
			var m = resp.getModel("DocumentDialog_Model");
			//console.dir(m)
			if(m){
				if(m.getNextRow())
					self.iniDocumentInf(m);
			}		
			callBack();
		}
	});
	
}


DocumentDialog_View.prototype.doDeleteDocument = function(){
	var pm = this.getController().getPublicMethod("delete_document");
	pm.setFieldValue("doc_id",this.getElement("id").getValue());
	var self = this;
	pm.run({
		"ok":function(resp){
			self.setDocumentInf("");
			window.showTempNote("Документ удален",null,2000);
		}
	});			
}

DocumentDialog_View.prototype.deleteDocument = function(){
	var self = this;
	WindowQuestion.show({
		"text":"Удалить документ?",
		"no":false,
		"callBack":function(res){
			if(res==WindowQuestion.RES_YES){
				self.doDeleteDocument();
			}
		}
	});
	
}

DocumentDialog_View.prototype.toDOM = function(parent){
	DocumentDialog_View.superclass.toDOM.call(this,parent);
	
	//events
	var fields = this.getElement("field_values");
	if(fields){
		var l = fields.getElements();
		for(var i in l){
			var ev = l[i].getEvent("change");
			if(ev)ev();
		}
	}
}

DocumentDialog_View.prototype.setDocumentInf = function(t){
	var n = document.getElementById(this.getId()+":document");
	DOMHelper.setText(n,t);
	this.getElement("document_delete").setVisible((t.length? true:false));
	return n;
}

DocumentDialog_View.prototype.iniDocumentInf = function(m){
	var gen_d = DateHelper.format(m.getFieldValue("document_gen_date"),"d/m/y H:i");
	var gen_emp =m.getFieldValue("document_gen_employees_ref").getDescr();
	var n = this.setDocumentInf("Документ от "+gen_d+", "+gen_emp);
	
	var self = this;
	EventHelper.add(n, "click", function(){
		self.getDocument();
	});
}

DocumentDialog_View.prototype.initUserFunctions = function(){
	if(this.m_userFunctions && this.m_userFunctions.init){		
		var field_values = this.getElement("field_values");
		this.m_userFunctions.init(field_values);
	}
}

DocumentDialog_View.prototype.onGetData = function(resp,cmd){

	DocumentDialog_View.superclass.onGetData.call(this,resp,cmd);
	
	var m = this.getModel();
	if(m.getFieldValue("document_data_exists")){
		this.iniDocumentInf(m);
	}

	this.initUserFunctions();
}

