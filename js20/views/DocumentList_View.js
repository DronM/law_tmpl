/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends ViewAjx
 * @requires core/extend.js
 * @requires controls/ViewAjx.js    

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function DocumentList_View(id,options){
	options = options || {};	
	
	DocumentList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.DocumentList_Model;
	var contr = new Document_Controller();
	
	var constants = {"doc_per_page_count":null,"grid_refresh_interval":null};
	window.getApp().getConstantManager().get(constants);
	
	var pagClass = window.getApp().getPaginationClass();
	
	var period_ctrl = new EditPeriodDate(id+":filter-ctrl-period",{
		"field":new FieldDateTime("date_time")
	});
	
	var filters = {
		"period":{
			"binding":new CommandBinding({
				"control":period_ctrl,
				"field":period_ctrl.getField()
			}),
			"bindings":[
				{"binding":new CommandBinding({
					"control":period_ctrl.getControlFrom(),
					"field":period_ctrl.getField()
					}),
				"sign":"ge"
				},
				{"binding":new CommandBinding({
					"control":period_ctrl.getControlTo(),
					"field":period_ctrl.getField()
					}),
				"sign":"le"
				}
			]
		}	
		,"employee":{
			"binding":new CommandBinding({
				"control":new EmployeeEditRef(id+":filter-ctrl-employee",{
					"contClassName":"form-group-filter",
					"labelCaption":"Сотрудник:"
				}),
				"field":new FieldInt("employee_id")}),
			"sign":"e"		
		}	
		,"doc_template":{
			"binding":new CommandBinding({
				"control":new DocTemplateEditRef(id+":filter-ctrl-doc_template",{
					"contClassName":"form-group-filter",
					"labelCaption":"Шаблон:"
				}),
				"field":new FieldInt("doc_template_id")}),
			"sign":"e"		
		}	
		
	};
	
	var popup_menu = new PopUpMenu();
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":false,
		"editWinClass":DocumentDialog_Form,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"filters":filters
		}),
		"head":new GridHead(id+":grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{					
					"elements":[
						new GridCellHead(id+":grid:head:doc_number",{
							"value":"Номер",
							"columns":[
								new GridColumn({"field":model.getField("doc_number")})
							],
							"sortable":true							
						})
						,new GridCellHead(id+":grid:head:date_time",{
							"value":"Дата",
							"columns":[
								new GridColumnDate({
									"field":model.getField("date_time"),
									"ctrlClass":EditDate,
									"searchOptions":{
										"field":new FieldDate("date_time"),
										"searchType":"on_beg"
									}
								})
							],
							"sortable":true,
							"sort":"desc"
						})						
						,new GridCellHead(id+":grid:head:employees_ref",{
							"value":"Сотрудник",
							"columns":[
								new GridColumnRef({
									"field":model.getField("employees_ref"),
									"form":EmployeeDialog_Form
								})
							]
							//,"sortable":true
						})
						,new GridCellHead(id+":grid:head:doc_templates_ref",{
							"value":"Шаблон",
							"columns":[
								new GridColumnRef({
									"field":model.getField("doc_templates_ref"),
									"form":DocTemplateDialog_Form
								})
							]
							,"sortable":true
						})
						
					]
				})
			]
		}),
		"pagination":new pagClass(id+"_page",
			{"countPerPage":constants.doc_per_page_count.getValue()}),		
		
		"autoRefresh":false,
		"refreshInterval":constants.grid_refresh_interval.getValue()*1000,
		"rowSelect":false,
		"focus":true
	}));		
}
extend(DocumentList_View,ViewAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */

