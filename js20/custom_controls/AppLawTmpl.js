/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2016
 
 * @class
 * @classdesc
	
 * @param {namespace} options
 */	
function AppLawTmpl(options){
	options = options || {};
	
	options.lang = "rus";	
	options.paginationClass = Pagination;
	
	this.setColorClass(options.servVars.color_palette || this.COLOR_CLASS);
	
	this.setDataTypes({
		"departments":{
			"dataTypeDescrLoc":"Отдел",
			"ctrlClass":DepartmentSelect,
			"ctrlOptions":{"keyIds":["id"]}
		}
		,"employees":{
			"dataTypeDescrLoc":"Сотрудник",
			"ctrlClass":EmployeeEditRef,
			"ctrlOptions":{"keyIds":["id"]}
		}
		,"short_messages":{
			"dataTypeDescrLoc":"Сообщение чата",
			"ctrlClass":null,
			"ctrlOptions":{"keyIds":["id"]},
			"dialogClass":ShortMessage_Form
		
		}
	});
		
	AppLawTmpl.superclass.constructor.call(this,"AppLawTmpl",options);
	
	if (this.storageGet(this.getSidebarId())=="xs"){
		$('body').toggleClass('sidebar-xs');
	}
		
}
extend(AppLawTmpl,App);

/* Constants */

/* private members */
AppLawTmpl.prototype.m_colorClass;

/* protected*/

AppLawTmpl.prototype.makeItemCurrent = function(elem){
	if (elem){
		var l = DOMHelper.getElementsByAttr("active", document.body, "class", true,"LI");
		for(var i=0;i<l.length;i++){
			DOMHelper.delClass(l[i],"active");
		}
		DOMHelper.addClass(elem.parentNode,"active");
		if (elem.nextSibling){
			elem.nextSibling.style="display: block;";
		}
	}
}

AppLawTmpl.prototype.showMenuItem = function(item,c,f,t,extra,title){
	AppLawTmpl.superclass.showMenuItem.call(this,item,c,f,t,extra,title);
	this.makeItemCurrent(item);
}


/* public methods */
AppLawTmpl.prototype.getSidebarId = function(){
	return this.getServVar("user_name")+"_"+"sidebar-xs";
}
AppLawTmpl.prototype.toggleSidebar = function(){
	var id = this.getSidebarId();
	this.storageSet(id,(this.storageGet(id)=="xs")? "":"xs");
}

AppLawTmpl.prototype.formatError = function(erCode,erStr){
	return (erStr +( (erCode)? (", код:"+erCode):"" ) );
}

AppLawTmpl.prototype.getColorClass = function(){
	return this.m_colorClass;
}
AppLawTmpl.prototype.setColorClass = function(v){
	this.m_colorClass = v;
}

AppLawTmpl.prototype.getTemplateAttrTypes = function(){
	if (!this.m_templateAttrTypes){
		this.m_templateAttrTypes = {
			//Сумма
			"money":{
				"descr":"Сумма",
				"template":null,
				"attributes":[
					{"id":"defValue",
					"attrClass":EditString,
					"attrOptions":{
						"labelCaption":"Значение по умолчанию:"
						}
					}
					
				]
				,"getInstanceParams":function(attrVals){
					var inst_opts = self.getInstanceOptions(attrVals);
					inst_opts.value = attrVals.defValue;
					var res = {
						"func":null,
						"funcColumn":"GridColumnFloat",
						"funcField":null,
						"options":inst_opts
					};
					res.options.precision = 2;
					res.func = "EditMoney";
					res.funcField = "FieldFloat";
		
					return res;
				}
			}		
			//Число
			,"number":{
				"descr":"Число",
				"template":"dtNumber",
				"attributes":[
					{"id":"numberType",
					"attrClass":"EditRadioGroup",
					"attrOptions":{
						"attrOptionsElements":[
							{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Целое",
									"checked":true,
									"value":"int",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}
							,{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Дробное",
									"value":"float",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}						
						]					
						}
					}
					,{"id":"defValue",
					"attrClass":EditString,
					"attrOptions":{
						"labelCaption":"Значение по умолчанию:"
						}
					}
					
				]
				,"getInstanceParams":function(attrVals){
					var inst_opts = self.getInstanceOptions(attrVals);
					inst_opts.value = attrVals.defValue;
					var res = {
						"func":null,
						"funcColumn":"GridColumn",
						"funcField":null,
						"options":inst_opts
					};
					if (attrVals.numberType=='int'){
						res.func = "EditInt";
						res.funcField = "FieldInt";
					}
					else{
						res.options.precision = 4;
						res.func = "EditFloat";
						res.funcField = "FieldFloat";
					}
		
					return res;
				}
			}
			//Строка
			,"string":{
				"descr":"Строка",
				"template":"dtString",
				"attributes":[
					{"id":"stringLength",
					"attrClass":"EditInt",
					"attrOptions":{
						"labelCaption":"Длина:"
						}
					}
					,{"id":"editMask",
					"attrClass":"EditString",
					"attrOptions":{
						"labelCaption":"Маска ввода:",
						"maxLength":"20",
						"value":"",
						"placeholder":""
						}
					}
					,{"id":"defValue",
					"attrClass":"EditString",
					"attrOptions":{
						"labelCaption":"Значение по умолчанию:"
						}
					}										
				]
				,"getInstanceParams":function(attrVals){
					var inst_opts = self.getInstanceOptions(attrVals);
					inst_opts.value = attrVals.defValue;
					inst_opts.maxLength = attrVals.stringLength;
					inst_opts.editMask = attrVals.editMask;
					
					return ({
						"func":"EditString",
						"funcColumn":"GridColumn",
						"funcField":"FieldString",						
						"options":{
							"labelCaption":attrVals.labelCaption						
						}
					});
				}														
			}
			//Многостройчный текст
			,"text":{
				"descr":"Текст",
				"template":"dtText",
				"attributes":[
					{"id":"rowCount",
					"attrClass":"EditInt",
					"attrOptions":{
						"labelCaption":"Количество строк:"
						}
					}
					,{"id":"defValue",
					"attrClass":"EditText",
					"attrOptions":{
						"labelCaption":"Значение по умолчанию:"
						}
					}										
				]
				,"getInstanceParams":function(attrVals){
					var inst_opts = self.getInstanceOptions(attrVals);
					inst_opts.value = attrVals.defValue;
					return ({
						"func":"EditText",
						"funcColumn":"GridColumn",
						"funcField":"FieldString",						
						"options":inst_opts
					});
				}														
			}			
			//Булево
			,"boolean":{
				"descr":"Включатель (да/нет)",
				"template":"dtBoolean",
				"attributes":[
					{"id":"defValue",
					"attrClass":"EditCheckBox",
					"attrOptions":{
						"labelCaption":"Значение по умолчанию:"
						}
					}										
					,{"id":"events",
					"attrClass":"DocAttrEventGrid",
					"attrOptions":{
						"labelCaption":"Список событий"
						}
					}										
					
				]
				,"getInstanceParams":function(attrVals,formContext){
					this.m_userEvents = undefined;
					if(attrVals.events&&attrVals.events.length&&formContext){
						var ev_o = CommonHelper.unserialize(attrVals.events);
						if(!CommonHelper.isEmpty(ev_o)&&ev_o.rows&&ev_o.rows.length){
							var self = this;
							var m = new ModelJSON({"data":ev_o});
							this.m_userEvents = {};
							while(m.getNextRow()){
								/**
								 * user function context:
								 *	 fields - collection of all fields
								 */
								this.m_userEvents[m.getFieldValue("id")] = (function(fields,func){
									return (function(event){
										eval(func);
									});
								}(formContext.getElement("field_values"),m.getFieldValue("func")));
								
							}
						}
					}
					var inst_opts = self.getInstanceOptions(attrVals);
					inst_opts.value = attrVals.defValue;
					inst_opts.events = this.m_userEvents;
					return ({
						"func":"EditCheckBox",
						"funcColumn":"GridColumnBool",
						"funcField":"EditCheckBox",						
						"options":inst_opts
					});
				}														
			}			
			
			//Дата
			,"date":{
				"descr":"Дата",
				"template":"dtDate",
				"attributes":[
					{"id":"editMask",
					"attrClass":"EditString",
					"attrOptions":{
						"labelCaption":"Маска ввода:",
						"maxLength":"20",
						"value":"99/99/9999 99:99:99"
						}
					}
					,{"id":"dateFormat",
					"attrClass":"EditString",
					"attrOptions":{
						"labelCaption":"Формат результата:",
						"maxLength":"20",
						"value":"d/m/Y H:i:s"
						}
					}
					,{"id":"defValue",
					"attrClass":"EditRadioGroup",
					"attrOptions":{
						"labelCaption":"Значение по умолчанию",
						"attrOptionsElements":[
							{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Пустое значение",
									"checked":true,
									"value":"not_selected",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}
							,{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Текущая дата",
									"value":"current_date",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}
							,{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Дата документа",
									"value":"document_date",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}							
							,{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Начало недели",
									"value":"current_week",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}						
							,{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Конец недели",
									"value":"current_week_end",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}																			
							,{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Начало месяца",
									"value":"current_month",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}
							,{"elementClass":"EditRadio",						
							"elementOptions":{
									"labelCaption":"Конец месяца",
									"value":"current_month_end",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}						
							,{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Начало квартала",
									"value":"current_quarter",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}
							,{"elementClass":"EditRadio",						
							"elementOptions":{
									"labelCaption":"Конец квартала",
									"value":"current_quarter_end",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}						
							,{"elementClass":"EditRadio",
							"elementOptions":{
									"labelCaption":"Начало года",
									"value":"current_year",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}
							,{"elementClass":"EditRadio",						
							"elementOptions":{
									"labelCaption":"Конец года",
									"value":"current_year_end",
									"name":"number_type",
									"labelAlign":"right",
									"labelClassName":window.getBsCol(9),
									"editContClassName":"input-group "+window.getBsCol(12),
									"className":window.getBsCol(1),
									"contClassName":window.getBsCol(2)
								}
							}													
						]					
						}
					}
										
				]
				,"getInstanceParams":function(attrVals){
					var def;
					if (attrVals.defValue=="current_date"){
						def = DateHelper.time();
					}
					else if (attrVals.defValue=="document_date"){
						def = DateHelper.time();
					}					
					else if (attrVals.defValue=="current_week"){
						def = DateHelper.weekStart();
					}
					else if (attrVals.defValue=="current_week_end"){
						def = DateHelper.weekEnd();
					}					
					else if (attrVals.defValue=="current_month"){
						def = DateHelper.monthStart();
					}
					else if (attrVals.defValue=="current_month_end"){
						def = DateHelper.monthEnd();
					}
					else if (attrVals.defValue=="current_quarter"){
						def = DateHelper.quarterStart();
					}
					else if (attrVals.defValue=="current_quarter_end"){
						def = DateHelper.quarterEnd();
					}					
					else if (attrVals.defValue=="current_year"){
						def = DateHelper.yearStart();
					}
					else if (attrVals.defValue=="current_year_end"){
						def = DateHelper.yearEnd();
					}
					var inst_opts = self.getInstanceOptions(attrVals);
					inst_opts.editMask = attrVals.editMask;
					inst_opts.dateFormat = attrVals.dateFormat;
					inst_opts.value = def;
					
					return ({
						"func":"EditDateTime",
						"funcColumn":"GridColumnDateTime",
						"funcField":"FieldDateTime",												
						"options":inst_opts
					});
				}																					
			}
			//Телефон
			,"phone":{
				"descr":"Телефон",
				"template":null,
				"attributes":[
					{"id":"defValue",
					"attrClass":"EditString",
					"attrOptions":{
						"labelCaption":"Значение по умолчанию:"
						}
					}				
				]				
				,"getInstanceParams":function(attrVals){
					var inst_opts = self.getInstanceOptions(attrVals);
					return ({
						"func":"EditPhone",
						"funcColumn":"GridColumn",
						"funcField":"FieldString",
						"options":inst_opts
					});
				}																									
			}
			//ЕГРЮЛ
			,"egrul":{
				"descr":"ЕГРЮЛ",
				"template":null,
				"attributes":null
				,"getInstanceParams":function(attrVals){
					var inst_opts = self.getInstanceOptions(attrVals);
					return ({
						"func":"EgrulSearchDataEdit",
						"funcColumn":"GridColumn",
						"funcField":"FieldJSON",						
						"options":inst_opts
					});
				}
			}	
			//Группа полей
			,"fieldGroup":{
				"descr":"Группа полей",				
				"attributes":[
					{"id":"header",
					"attrClass":"EditString",
					"attrOptions":{
							"labelCaption":"Заголовок группы полей:",
							"maxLength":250
						}
					}
					,{"id":"visible",
					"attrClass":"EditCheckBox",
					"attrOptions":{
							"defValue":true,
							"labelCaption":"Видимость группы:",
						}
					}														
					,{"id":"fields",
					"attrClass":"FieldGroupContainer",
					"attrOptions":{
							"template":this.getTemplate("FieldCollectionEdit")
						}
					}									
				]
				,"getInstanceParams":function(attrVals){
					var inst_opts = self.getInstanceOptions(attrVals);
					inst_opts.fields = attrVals.fields;
					inst_opts.header = attrVals.header;
					inst_opts.visible = attrVals.visible;
					
					return ({
						"func":"FieldGroup",
						"funcColumn":"GridColumn",
						"funcField":"FieldJSON",						
						"options":inst_opts
					});
				}
			}						
					
			//Коллеция
			,"collection":{
				"descr":"Таблица",				
				"attributes":[
					{"id":"fields",
					"attrClass":"CollectionFieldContainer",
					"attrOptions":{
							"template":this.getTemplate("FieldCollectionEdit")
						}
					}				
				]
				,"getInstanceParams":function(attrVals,formContext,userFunctions){
					var inst_opts = self.getInstanceOptions(attrVals);
					inst_opts.fields = attrVals.fields;
					inst_opts.userFunctions = userFunctions;
					
					return ({
						"func":"CollectionGrid",
						"funcColumn":"GridColumn",
						"funcField":"FieldJSON",
						"options":inst_opts
					});
				}
			}						
		};
		
		//user defined catalogs
		var self = this;
		(new UserCatalogMetadata_Controller()).getPublicMethod("get_list").run({
			"async":false,
			"ok":function(resp){
				var m = resp.getModel("UserCatalogMetadataList_Model");
				while(m.getNextRow()){
					var user_id = m.getFieldValue("user_id");
					//console.log("Adding dataType="+user_id)
					self.m_templateAttrTypes[user_id] = {
						"descr":"Пользовательский тип: "+m.getFieldValue("name"),
						"mdId":m.getFieldValue("id"),
						"mdName":m.getFieldValue("name"),
						"mdUserId":m.getFieldValue("user_id"),
						"mdFields":m.getFieldValue("fields"),
						"attributes":[
							{"id":"events",
							"attrClass":"DocAttrEventGrid",
							"attrOptions":{
								"labelCaption":"Список событий"
								}
							}										
						]	
						,"getInstanceParams":function(attrVals,formContext){
							this.m_userEvents = undefined;
							if(attrVals.events && formContext){
								var self = this;
								var m = new ModelJSON({"data":CommonHelper.unserialize(attrVals.events)});
								this.m_userEvents = {};
								while(m.getNextRow()){
									this.m_userEvents[m.getFieldValue("id")] = (function(fields,func){
										return (function(e){
											var ref_id = this.getValue().getKeys().id;
											this.getFieldValue = function(fieldId){
												var res;
												if(!this.models||!this.models[ref_id]){
													var contr = new UserCatalogData_Controller();
													var pm = contr.getPublicMethod("get_object");
													pm.setFieldValue("id",ref_id);													
													var fn_cont = this;
													pm.run(
													{"async":false,
													"ok":function(resp){
														if(!fn_cont.models)fn_cont.models={};
														fn_cont.models[ref_id] = resp.getModel("UserCatalogData_Model");
														fn_cont.models[ref_id].getNextRow();
													}
													});
												}
												return (this.models&&this.models[ref_id]&&this.models[ref_id].getRowCount())? this.models[ref_id].getFieldValue("field_values")[fieldId]:null;
											}
											eval(func);
										});
									}(formContext.getElement("field_values"),m.getFieldValue("func")));
								
								}
							}					
							var inst_opts = self.getInstanceOptions(attrVals);
							inst_opts.mdFields = this.mdFields;
							inst_opts.mdUserId = this.mdUserId;
							inst_opts.mdName = this.mdName;
							inst_opts.mdId = this.mdId;
							inst_opts.events = this.m_userEvent;
							
							return ({
								"func":"UserCatalogDataEdit",
								"funcColumn":"GridColumn",
								"funcField":"FieldJSON",						
								"options":inst_opts
							});
						}
				
					}
				}
			}
		});		
	}
	
	return this.m_templateAttrTypes;
}	

AppLawTmpl.prototype.getInstanceOptions = function(attrVals){
	var res = {
		"labelCaption":attrVals.labelCaption
	};
	if(attrVals.commentText&&attrVals.commentText.length){
		res.title = attrVals.commentText;
	}
	return res;
}

AppLawTmpl.prototype.magnify = function(dir){
	this.currFFZoom = this.currFFZoom? this.currFFZoom : 1;
	this.currIEZoom = this.currIEZoom? this.currIEZoom : 100;
	
	if (dir){
		    var step = 0.02;
		    this.currFFZoom += step; 
		    $('body').css('MozTransform','scale(' + this.currFFZoom + ')');
		/*	
		if ($.browser.mozilla){
		    var step = 0.02;
		    currFFZoom += step; 
		    $('body').css('MozTransform','scale(' + currFFZoom + ')');
		} else {
		    var step = 2;
		    currIEZoom += step;
		    $('body').css('zoom', ' ' + currIEZoom + '%');
		}
		*/
	}
	else{
		    var step = 0.02;
		    this.currFFZoom -= step;                 
		    $('body').css('MozTransform','scale(' + this.currFFZoom + ')');
	
		/*
		if ($.browser.mozilla){
		    var step = 0.02;
		    currFFZoom -= step;                 
		    $('body').css('MozTransform','scale(' + currFFZoom + ')');

		} else {
		    var step = 2;
		    currIEZoom -= step;
		    $('body').css('zoom', ' ' + currIEZoom + '%');
		}
		*/	
	}
}

AppLawTmpl.prototype.getUserIdRegExp = function(){
	return /^([а-яА-Яa-zA-Z]|_)+([а-яА-Яa-zA-Z0-9]|_)*$/;
}
