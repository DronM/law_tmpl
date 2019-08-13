/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @extends 
 * @requires core/extend.js
 * @requires controls/.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 * @param {object} options.fields 
 */
 
//
function Collection_Model(options){
	options = options || {};
	
	options.fields = options.fields || {};
	options.fields.id = new FieldInt("id",{"primaryKey":true,"autoInc":true});	
	options.sequences = {"id":0};
	
	Collection_Model.superclass.constructor.call(this,"Collection_Model",options);
}
extend(Collection_Model,ModelJSON);

//
function CollectionGrid(id,options){
	options = options || {};	
	
	this.m_userFunctions = options.userFunctions? eval('('+options.userFunctions+')'):null;
	
	var fields = (typeof(options.fields)=="object")? options.fields:CommonHelper.unserialize(options.fields);
	var attr_types = window.getApp().getTemplateAttrTypes();
	var model_fields = {};
	var inst_params = {};
	var grid_elements = [];
	
	var contr = new ControllerObjClient();
	var pm_insert = contr.addInsert();
	var pm_update = contr.addUpdate();
	var pm_delete = contr.addDelete();
	var pm_getList = contr.addGetList();
	var pm_getObject = contr.addGetObject();
	
	pm_insert.addField(new FieldInt("id",{"primaryKey":true,"autoInc":true}));
	pm_update.addField(new FieldInt("id",{"primaryKey":true,"autoInc":true}));
	pm_update.addField(new FieldInt("old_id",{"primaryKey":true,"autoInc":true}));
	pm_delete.addField(new FieldInt("id",{"primaryKey":true,"required":true}));
	pm_getList.addField(new FieldInt(contr.PARAM_COUNT));
	pm_getList.addField(new FieldInt(contr.PARAM_FROM));
	pm_getList.addField(new FieldString(contr.PARAM_COND_FIELDS));
	pm_getList.addField(new FieldString(contr.PARAM_COND_SGNS));
	pm_getList.addField(new FieldString(contr.PARAM_COND_VALS));
	pm_getList.addField(new FieldString(contr.PARAM_COND_ICASE));
	pm_getList.addField(new FieldString(contr.PARAM_ORD_FIELDS));
	pm_getList.addField(new FieldString(contr.PARAM_ORD_DIRECTS));
	pm_getList.addField(new FieldString(contr.PARAM_FIELD_SEP));
	pm_getList.addField(new FieldInt("id",{"primaryKey":true,"autoInc":true}));
	pm_getObject.addField(new FieldInt("id",{"primaryKey":true,"autoInc":true}));

	//totals
	var foot_elements = null;	
	for(var i=0;i<fields.length;i++){
		if(attr_types[fields[i].data_type] && fields[i].column_total){
			if(!foot_elements){
				foot_elements = [];
				break;
			}
		}
	}
	var self = this;	
	for(var i=0;i<fields.length;i++){
		if(attr_types[fields[i].data_type]){
		
			inst_params[fields[i].user_id] = attr_types[fields[i].data_type].getInstanceParams(fields[i].data_attr_cont);
			
			var field_constr = eval(inst_params[fields[i].user_id].funcField);
			
			model_fields[fields[i].user_id] = new field_constr(fields[i].user_id);			
			
			inst_params[fields[i].user_id].options.labelCaption = "";
			
			//data aligning			
			if(inst_params[fields[i].user_id].func=="EditMoney"
			||inst_params[fields[i].user_id].func=="EditNum"
			||inst_params[fields[i].user_id].func=="EditInt"
			||inst_params[fields[i].user_id].func=="EditFloat"
			){
				inst_params[fields[i].user_id].colAlign = "right";
			}
			else if(inst_params[fields[i].user_id].funcField=="FieldDate"
			||inst_params[fields[i].user_id].func=="EditDate"
			||inst_params[fields[i].user_id].func=="EditDateTime"
			||inst_params[fields[i].user_id].func=="EditCheckBox"
			){
				inst_params[fields[i].user_id].colAlign = "center";
			}
			else{
				inst_params[fields[i].user_id].colAlign = "left";
			}
			//Head title
			inst_params[fields[i].user_id].colCaption = fields[i].user_label || fields[i].comment_text || fields[i].user_id;
			
			pm_insert.addField(new field_constr(fields[i].user_id));
			pm_update.addField(new field_constr(fields[i].user_id));
			pm_getList.addField(new field_constr(fields[i].user_id));
			pm_getObject.addField(new field_constr(fields[i].user_id));
			
			//totals
			if(foot_elements && fields[i].column_total){
				var col_class;
				var col_opts = {"id":"tot_"+fields[i].user_id};
				if(inst_params[fields[i].user_id].func=="EditFloat"||inst_params[fields[i].user_id].func=="EditMoney"){
					col_class = GridColumnFloat;
					col_opts.precision = "2";
				}
				else{
					col_class = GridColumn;
				}
				foot_elements.push(
					new GridCellFoot(id+":features_grid:foot:tot_"+fields[i].user_id,{
						"attrs":{"align":"right"},
						"calcOper":"sum",
						"calcFieldId":fields[i].user_id,
						"gridColumn":new col_class(col_opts)
					})						
				);
			}
			else if(foot_elements){
				foot_elements.push(
					new GridCell(id+":grid:foot:sp_"+i)
				);
			}
			
			if(foot_elements && fields[i].event_list){
				var event_list = CommonHelper.unserialize(fields[i].event_list);
				if(event_list && event_list.rows && event_list.rows.length){
					inst_params[fields[i].user_id].options = inst_params[fields[i].user_id].options || {};					
					inst_params[fields[i].user_id].options.events = inst_params[fields[i].user_id].options.events || {};
					
					var event_rec;
					/*if(event_list.rows.length){
						console.log("Event for "+fields[i].user_id)
					}*/
					for(var k=0;k<event_list.rows.length;k++){
						/**
						 * user function context:
						 *	this - edit control context
						 *	grid - current grid
						 *	userFunctions
						 */
						if(event_list.rows[k].fields.id=="onValueChange"
						||event_list.rows[k].fields.id=="onSelect"){
							event_rec = inst_params[fields[i].user_id].options;
						}
						else{
							event_rec = inst_params[fields[i].user_id].options.events;
						}
						event_rec[event_list.rows[k].fields.id] =
							(function(funcCode,grid,userFunctions){								
								return (function(event){
									eval(funcCode);
								});
							})(event_list.rows[k].fields.func,self,this.m_userFunctions);
					}
				}
			}
		}		
	}
	var model = new Collection_Model({
		"fields":model_fields		
	});
	contr.setClientModel(model);
	contr.setListModelClass(Collection_Model);
	contr.setObjModelClass(Collection_Model);
	/*
	grid_elements.push(
		new GridCellHead(id+":head:id",{
			"value":"Id",
			"columns":[
				new GridColumn({
					"field":model.getField("id"),
					"ctrlClass":EditInt
				})							
			]
		})
	);	
	*/
	//grid columns
	for(var f_id in model_fields){	
		if(!inst_params[f_id])continue;
		
		var col_constr = eval(inst_params[f_id].funcColumn);
		grid_elements.push(
			new GridCellHead(id+":head:"+f_id,{
				"value":inst_params[f_id].colCaption,
				"colAttrs":{"align":inst_params[f_id].colAlign},
				"columns":[
					new col_constr({
						"field":model.getField(f_id),
						"ctrlClass":eval(inst_params[f_id].func),
						"ctrlOptions":inst_params[f_id].options
					})							
				]
			})
		);	
	}
	
	//totals
	var foot = (foot_elements&&foot_elements.length)?
		(new GridFoot(id+":grid:foot",{
			"autoCalc":true,			
			"elements":[
				new GridRow(id+":grid:foot:row0",{
					"elements":foot_elements
				})		
			]
		}))
		:null
	;
	
	options = {
		"model":model,
		"keyIds":["id"],
		"controller":contr,
		"editInline":true,
		"editWinClass":null,
		"popUpMenu":new PopUpMenu(),
		"commands":new GridCmdContainerAjx(id+":cmd",{
			"cmdInsert":true,
			"cmdEdit":true,
			"cmdSearch":false,
			"cmdExport":false,
			"cmdAllCommands":false
		}),
		"head":new GridHead(id+":head",{
			"elements":[
				new GridRow(id+":head:row0",{
					"elements":grid_elements
				})
			]
		}),
		"foot":foot,				
		"rowSelect":true
	};	
	CollectionGrid.superclass.constructor.call(this,id,options);
}
//ViewObjectAjx,ViewAjxList
extend(CollectionGrid,GridJSON);

/* Constants */


/* private members */

/* protected*/


/* public methods */

/**
 * Возвращаем как есть текстиз колонок
 * Сложные типы!!! ToDo
 */
CollectionGrid.prototype.getFormattedValue = function(){
	//console.log("CollectionGrid.prototype.getFormattedValue")
	//console.dir(this.getModel());
	
	var res = [];
	var body_node = this.getBody().getNode();
	var rows = body_node.getElementsByTagName("tr");
	var field_ids = [];
	for(var i=0;i<rows.length;i++){
		var cols = rows[i].getElementsByTagName("td");
		var res_row = {};
		for(var j=0;j<cols.length;j++){
			if(i==0)
				field_ids.push(DOMHelper.getAttr(cols[j],"fieldid"));
			res_row[DOMHelper.getAttr(cols[j],"fieldid")] = DOMHelper.getText(cols[j]);
		}
		res.push(res_row);
	}
	
	//totals
	var foot_node = this.getFoot().getNode();
	var rows = foot_node.getElementsByTagName("tr");	
	for(var i=0;i<rows.length;i++){
		var cols = rows[i].getElementsByTagName("td");
		var res_row = {};
		for(var j=0;j<cols.length;j++){
			res_row[field_ids[j]] = DOMHelper.getText(cols[j]);
		}
		res.push(res_row);
	}
	
	/*
	var m = this.getModel();
	var fields = m.getFields();
	while(m.getNextRow()){
		var fld = {};
		for (var f_id in fields){
			//var f_val = fields[f_id].getFormattedValue? fields[f_id].getValue();
			//fld[f_id] = 
		}
		res.push(fld);
	}
	*/
	return res;
}
