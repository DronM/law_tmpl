/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends GridAjx
 * @requires core/extend.js  

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {Object} options
 * @param {string} options.className
 */
function DocAttrEventGrid(id,options){
	var model = new DocAttrEvent_Model();

	var cells = [
		new GridCellHead(id+":head:id",{
			"value":"Событие",
			"columns":[
				new GridColumn({
					"field":model.getField("id"),
					"ctrlClass":EditString,
					"ctrlOptions":{
					}					
				})
			]
		})
		,new GridCellHead(id+":head:func",{
			"value":"Функция",
			"columns":[
				new GridColumn({
					"field":model.getField("func"),
					"ctrlClass":EditText,
					"ctrlOptions":{
					}					
				})
			]
		})
		
	];

	options = {
		"model":model,
		"keyIds":["id"],
		"controller":new DocAttrEvent_Controller({"clientModel":model}),
		"editInline":true,
		"editWinClass":null,
		"popUpMenu":new PopUpMenu(),
		"commands":new GridCmdContainerAjx(id+":cmd",{
			"cmdSearch":false,
			"cmdExport":false
		}),
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
	DocAttrEventGrid.superclass.constructor.call(this,id,options);
}
extend(DocAttrEventGrid,GridAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */
