/** Copyright (c) 2018
 *	Andrey Mikhalevich, Katren ltd.
 */
function UserCatalogDataDialog_View(id,options){	

	options = options || {};
	options.controller = new UserCatalogData_Controller();	
	options.model = options.models.UserCatalogData_Model;
	
	var self = this;
	
	options.templateOptions = {
		"columns":options.columns
	};
//console.dir(options.columns)	
	var read_b = [];
	var write_b = [];
	options.addElement = function(){
		this.addElement(new HiddenKey(id+":id"));	
		
		if (options.columns){
			for(var i=0;i<options.columns.length;i++){
			
				this.addElement(new EditString(id+":"+options.columns[i].fieldId,{				
					"labelCaption":(options.columns[i].fields.descr? options.columns[i].fields.descr:options.columns[i].fieldId)
				}));
			
				read_b.push(new DataBinding({
					"control":this.getElement(options.columns[i].fieldId),
					"fieldId":"field_values",
					"assocIndex":options.columns[i].fields.id
				}));
				write_b.push(new CommandBinding({
					"control":this.getElement(options.columns[i].fieldId),//fieldId
					"model":options.model,
					"fieldId":"field_values",
					"assocIndex":options.columns[i].fields.id
				}));
			}
		}
	}
	
	UserCatalogDataDialog_View.superclass.constructor.call(this,id,options);
	
	//****************************************************			
	read_b.push(new DataBinding({"control":this.getElement("id")}));	
	
	this.setDataBindings(read_b);
	this.setWriteBindings(write_b);
	
	var frm_cmd = this.getCmd();
	if (frm_cmd){
		var pm_id = (frm_cmd=="insert"||frm_cmd=="copy")? this.m_controller.METH_INSERT:this.m_controller.METH_UPDATE;
		this.m_controller.getPublicMethod(pm_id).setFieldValue("user_catalog_metadata_id",options.metadataId);
	}
	
}
extend(UserCatalogDataDialog_View,ViewObjectAjx);

