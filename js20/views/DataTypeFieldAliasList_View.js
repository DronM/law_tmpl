/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2019

 * @extends ViewAjxList
 * @requires core/extend.js
 * @requires controls/ViewAjxList.js    

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function DataTypeFieldAliasList_View(id,options){
	options = options || {};	
	
	DataTypeFieldAliasList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.DataTypeFieldAlias_Model;
	var contr = new DataTypeFieldAlias_Controller();
	
	var constants = {"doc_per_page_count":null};
	window.getApp().getConstantManager().get(constants);
	
	var pagClass = window.getApp().getPaginationClass();
	
	var popup_menu = new PopUpMenu();
	
	var editable = (window.getApp().getServVar("role_id")=="admin");
	
	var detail = (options.detailFilters&&options.detailFilters.DataTypeFieldAlias_Model);
	var filters;
	if(!detail){
		filters = {
			"data_type":{
				"binding":new CommandBinding({
					"control":new Enum_data_types(id+":filter-ctrl-data_type",{
						"contClassName":"form-group-filter",
						"labelCaption":"Тип данных:"
					}),
					"field":new FieldString("data_type")}),
				"sign":"e"		
			}		
		}
	}
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["data_type","field"],
		"controller":contr,
		"editInline":true,
		"editWinClass":null,
		"popUpMenu":popup_menu,
		"filters":detail? options.detailFilters.DataTypeFieldAlias_Model:null,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"cmdInsert":editable,
			"cmdDelete":editable,
			"cmdCopy":editable,
			"cmdEdit":editable,
			"cmdFilter":!detail,
			"filters":filters			
		}),
		"head":new GridHead(id+":grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{					
					"elements":[
						new GridCellHead(id+":grid:head:data_type",{
							"value":"Тип данных",
							"columns":[
								new EnumGridColumn_data_types({
										"field":model.getField("data_type"),
										"ctrlClass":Enum_data_types,
										"ctrlBindField":model.getField("data_type")
									})
							],
							"sortable":true,
							"sort":"asc"
						})
						,new GridCellHead(id+":grid:head:field",{
							"value":"Поле БД",
							"columns":[
								new GridColumn({
									"field":model.getField("field"),
									"ctrlClass":EditString,
									"ctrlOptions":{
										"maxLength":"100"
									},
									"ctrlBindField":model.getField("field")
								})
							]
						})
						,new GridCellHead(id+":grid:head:alias",{
							"value":"Псевдоним для шаблона",
							"columns":[
								new GridColumn({
									"field":model.getField("alias"),
									"ctrlClass":EditString,
									"ctrlOptions":{
										"maxLength":"100"
									},
									"ctrlBindField":model.getField("alias")
									
								})
							]
						})
						
					]
				})
			]
		}),
		"pagination":new pagClass(id+"_page",
			{"countPerPage":constants.doc_per_page_count.getValue()}),		
		
		"autoRefresh":false,
		"refreshInterval":0,
		"rowSelect":false,
		"focus":true
	}));		
}
extend(DataTypeFieldAliasList_View,ViewAjxList);

/* Constants */


/* private members */

/* protected*/


/* public methods */

