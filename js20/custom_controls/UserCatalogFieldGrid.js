/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends GridAjx
 * @requires core/extend.js
 * @requires GridAjx.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {Object} options
 */
function UserCatalogFieldGrid(id,options){
	
	options = options||{};

	var model = new UserCatalogField_Model();

	var cells = [
		new GridCellHead(id+":head:id",{
			"value":"Идентификатор поля",
			"columns":[
				new GridColumn({
					"field":model.getField("id")
				})
			]
		})
		,new GridCellHead(id+":head:descr",{
			"value":"Описание",
			"columns":[
				new GridColumn({
					"field":model.getField("descr")
				})
			]
		})
		
	];

	var commands;
	if (options.enabled!==false){
		commands = new GridCmdContainerAjx(id+":cmd",{
				"cmdSearch":false,
				"cmdExport":false,
				"cmdAllCommands":false
		});
	}

	options = {
		"showHead":true,
		"model":model,
		"keyIds":["id"],
		"controller":new UserCatalogField_Controller({"clientModel":model}),
		"editInline":true,
		"editWinClass":null,
		"popUpMenu":new PopUpMenu(),
		"commands":commands,
		"head":new GridHead(id+":head",{
			"elements":[
				new GridRow(id+":head:row0",{
					"elements":cells
				})
			]
		}),
		"pagination":null,				
		"autoRefresh":false,
		"refreshInterval":0,
		"rowSelect":true
	};	
	UserCatalogFieldGrid.superclass.constructor.call(this,id,options);
}
extend(UserCatalogFieldGrid,GridAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */
