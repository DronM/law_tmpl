/** Copyright (c) 2018
 *	Andrey Mikhalevich, Katren ltd.
 */
function UserCatalogDataList_View(id,options){	

	options = options || {};
	options.templateOptions = options.templateOptions||{};

	options.templateOptions.metadata = (options.metadata==undefined || options.metadata==true);

	var self = this;
	
	this.m_constants = {"doc_per_page_count":null,"grid_refresh_interval":null};
	window.getApp().getConstantManager().get(this.m_constants);	

	if (options.templateOptions.metadata){
		options.addElement = function(){
			this.addElement(new UserCatalogMetadataSelect(id+":user_metadata",{
				"onSelect":function(row){
					var f = row.fields.getValue();
					if (f){
						self.defineGrid(f.rows,row.id.getValue());
						//console.log("refreshed")
					}
				}
			}));
		}
	}

	UserCatalogDataList_View.superclass.constructor.call(this,id,options);	
}
extend(UserCatalogDataList_View,ViewAjx);

UserCatalogDataList_View.prototype.defineGrid = function(columns,metadataId){
	var id = this.getId();
	this.m_columns = columns;
	var model = new UserCatalogDataList_Model();
	var elements = [];
	var tmpl_fields = [];
	
	for(var i=0;i<columns.length;i++){
		columns[i].fieldId = "fld_"+i;
		elements.push(
			new GridCellHead(id+":grid:head:fld_"+i,{
				"value":columns[i].fields.descr,
				"columns":[
					new GridColumn({
						"id":"fld_"+i,
						"field":model.getField("field_values"),
						"assocIndex":columns[i].fields.id
					})
				]
			})
		);
	}
	
	var dlg_m = new UserCatalogData_Model();
	dlg_m.setFieldValue("user_catalog_metadata_id",metadataId);
	dlg_m.recInsert();
	
	if (this.m_grid)this.m_grid.delDOM();
	var self = this;	
	this.m_grid = new GridAjx(id+":grid",{
		"model":model,
		"controller":new UserCatalogData_Controller(),
		"editInline":false,
		"editWinClass":UserCatalogDataDialog_Form,
		"insertViewOptions":{
			"models":{"UserCatalogData_Model":dlg_m},
			"columns":columns,
			"metadataId":metadataId
		},
		"editViewOptions":function(){
			return {
				"metadataId":metadataId,
				"columns":columns
			};
		},
		"commands":new GridCmdContainerAjx(id+":grid:cmd"),		
		"popUpMenu":new PopUpMenu(),
		"head":new GridHead(id+"-grid:head",{
			"elements":[
				new GridRow(id+":grid:head:row0",{
					"elements":elements/*[
						new GridCellHead(id+":grid:head:0",{
							"value":"Значения колонок",
							"columns":[
								new GridColumn({
									"field":model.getField("field_values"),
									"formatFunction":function(fields){
										var res = "";
										var o = fields.field_values.getValue();
										for(var i=0;i<self.m_columns.length;i++){
											res+=(res=="")? "":", ";
											res+=self.m_columns[i].fields.id+"="+o[self.m_columns[i].fields.id];
										}
										return res;
									}
								})
							]
						})
					
					]*/
				})
			]
		}),
		"pagination":new GridPagination(id+"_page",
			{"countPerPage":this.m_constants.doc_per_page_count.getValue()}),		
		
		"autoRefresh":false,
		"refreshInterval":0,//this.m_constants.grid_refresh_interval.getValue()*1000,
		"rowSelect":false,
		"focus":true
	});
	
	this.m_grid.setFilter({
		"field":"user_catalog_metadata_id",
		"sign":"e",
		"val":metadataId,
		"icase":0
	});
	this.m_grid.toDOM(document.getElementById(id+":grid-container"));
	this.m_grid.onRefresh();
	
}
