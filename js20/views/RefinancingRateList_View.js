/** Copyright (c) 2019
 *	Andrey Mikhalevich, Katren ltd.
 */
function RefinancingRateList_View(id,options){	

	RefinancingRateList_View.superclass.constructor.call(this,id,options);
	
	var model = options.models.RefinancingRate_Model;
	var contr = new RefinancingRate_Controller();
	
	var constants = {"doc_per_page_count":null};
	window.getApp().getConstantManager().get(constants);
	
	var popup_menu = new PopUpMenu();
	var pagClass = window.getApp().getPaginationClass();
	this.addElement(new GridAjx(id+":grid",{
		"keyIds":["set_date"],
		"model":model,
		"controller":contr,
		"editInline":true,
		"editWinClass":null,
		"commands":new GridCmdContainerAjx(id+":grid:cmd"),		
		"popUpMenu":popup_menu,
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":[
						new GridCellHead(id+":grid:head:set_date",{
							"value":"Дата",
							"columns":[
								new GridColumnDate({"field":model.getField("set_date")})
							],
							"sortable":true,
							"sort":"desc"							
						}),
						new GridCellHead(id+":grid:head:rate",{
							"value":"Ставка",
							"columns":[
								new GridColumnFloat({"field":model.getField("rate")})
							]
						}),											
					]
				})
			]
		}),
		"pagination":new pagClass(id+"_page",
			{"countPerPage":constants.doc_per_page_count.getValue()}),		
		
		"autoRefresh":false,
		"refreshInterval":false,
		"rowSelect":false,
		"focus":true
	}));	
	


}
extend(RefinancingRateList_View,ViewAjx);
