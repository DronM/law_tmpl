/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2019

 * @extends GridAjx
 * @requires core/extend.js
 * @requires GridAjx.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {Object} options
 */
function MultipleChoiceListGrid(id,options){
	var model = new MultipleChoiceList_Model({
	});

	var cells = [
		new GridCellHead(id+":head:id",{
			"value":"Идентификатор",
			"columns":[
				new GridColumn({					
					"field":model.getField("id")
				})
			]
		})
		,new GridCellHead(id+":head:caption",{
			"value":"Представление",
			"columns":[
				new GridColumn({					
					"field":model.getField("caption")
				})
			]
		})
		
	];

	options = {
		"showHead":false,
		"model":model,
		"keyIds":["id"],
		"controller":new MultipleChoiceList_Controller({"clientModel":model}),
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
	MultipleChoiceListGrid.superclass.constructor.call(this,id,options);
}
extend(MultipleChoiceListGrid,GridAjx);

/* Constants */


/* private members */

/* protected*/


/* public methods */
