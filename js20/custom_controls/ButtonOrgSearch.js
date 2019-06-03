/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017

 * @extends ButtonCtrl
 * @requires core/extend.js
 * @requires ButtonCtrl.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {namespace} options
 * @param {string} options.viewContext
 * @param {functions} options.onGetData 
 */
function ButtonOrgSearch(id,options){
	options = options || {};	
	
	options.glyph = "glyphicon-search";
	options.title = this.TITLE;
	this.m_viewContext = options.viewContext;
	this.m_onGetData = options.onGetData;
	
	var self = this;
	
	options.onClick = options.onClick || 
		function(event){
			self.doSearch();	
		};
	
	ButtonOrgSearch.superclass.constructor.call(this,id,options);
}
extend(ButtonOrgSearch,ButtonCtrl);

/* Constants */


/* private members */

/* protected*/


/* public methods */
ButtonOrgSearch.prototype.doSearch = function(){
	var q = this.getEditControl().getValue();
	if (!q || !q.length){
		throw new Error("Не задан параметр поиска!");
	}
	var pm = (new EgrulSearchData_Controller()).getPublicMethod("search");
	pm.setFieldValue("query",q);
	
	this.setEnabled(false);
	var self = this;
	pm.run({
		"ok":function(resp){
			if (self.m_onGetData){
				self.m_onGetData(resp.getModel("EgrulSearchData_Model"));
			}
			else{
				self.applyResult(resp.getModel("EgrulSearchData_Model"));
			}
		},
		"all":function(){
			self.setEnabled(true);
		}
	});
}

ButtonOrgSearch.prototype.applyResult = function(model){
	if(model.getNextRow()){
		var param = model.getFieldValue("data");
		for(var param_id in param){
			var el = this.m_viewContext.getElement(param_id);
			if (el){
				el.setValue(param[param_id]);
			}
		}
	}

}
