/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends ViewAjx
 * @requires js20/core/extend.js
 * @requires js20/controls/ViewAjx.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 */
function EmailTemplateList_View(id,options){
	options = options || {};	
	
	EmailTemplateList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.EmailTemplateList_Model;
	var contr = new EmailTemplate_Controller();
	
	var constants = {"doc_per_page_count":null,"grid_refresh_interval":null};
	window.getApp().getConstantManager().get(constants);
	
	var pagClass = window.getApp().getPaginationClass();
	
	var popup_menu = new PopUpMenu();
	
	var is_admin = (window.getApp().getServVar("role_id")=="admin");
	
	this.addElement(new GridAjx(id+":grid",{
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":false,
		"editWinClass":EmailTemplate_Form,
		"popUpMenu":popup_menu,
		"commands":new GridCmdContainerAjx(id+":grid:cmd",{
			"cmdInsert":is_admin,
			"cmdCopy":is_admin,
			"cmdDelete":is_admin,
			"cmdEdit":true
		}),
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":[
						new GridCellHead(id+":grid:head:email_type",{
							"value":this.COL_EMAIL_TYPE,
							"columns":[
								new EnumGridColumn_email_types({"field":model.getField("email_type")})
							],
							"sortable":true
						}),
					
						new GridCellHead(id+":grid:head:template",{
							"value":this.COL_TEMPLATE,
							"columns":[
								new GridColumn({"field":model.getField("template")})
							]
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
extend(EmailTemplateList_View,ViewAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */

