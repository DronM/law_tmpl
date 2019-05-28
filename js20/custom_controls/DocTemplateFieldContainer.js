/**	
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2018

 * @requires core/extend.js
 * @requires ControlContainer.js     

 * @class
 * @classdesc
 
 * @param {string} id - Object identifier
 * @param {object} options
 */
function DocTemplateFieldContainer(id,options){
	options = options || {};	
	options.elementOptions = options.elementOptions || {};
	
	this.m_elementClass = options.elementClass;
	this.m_elementOptions = options.elementOptions;
	
	this.m_mainView = options.elementOptions.mainView;
	
	this.m_readOnly = options.readOnly;

	options.template = window.getApp().getTemplate("DocTemplateFieldContainer");
	options.template.templateOptions = {"readOnly":options.readOnly};
	
	var self = this;
	
	this.m_panelClass = options.panelClass || "fieldPanel";
	
	options.addElement = function(){
		this.m_container = new ControlContainer(id+":container","DIV");
		this.addElement(this.m_container);
		
		this.addCommands();				
	}
	
	DocTemplateFieldContainer.superclass.constructor.call(this,id,options.tagName,options);
	
	if (options.valueJSON){
		this.setValue(options.valueJSON);
	}
}
//ViewObjectAjx,ViewAjxList
extend(DocTemplateFieldContainer,ControlContainer);

/* Constants */


/* private members */

/* protected*/
DocTemplateFieldContainer.prototype.m_container;
DocTemplateFieldContainer.prototype.m_elementClass;
DocTemplateFieldContainer.prototype.m_elementOptions;

/* public methods */
DocTemplateFieldContainer.prototype.addCommands = function(){	
	var self = this;
	
	this.addElement(new ButtonCmd(this.getId()+":cmdAdd",{
		"glyph":"glyphicon-plus",
		"title":"Добавить в шаблон новый атрибут",
		"caption":"Добавить атрибут ",	
		"onClick":function(){
			self.addAttrClick();
		}
	}));
	this.addElement(new ButtonCmd(this.getId()+":cmdCollapseAll",{
		"onClick":function(){
			self.collapseAll();
		}
	}));
	this.addElement(new ButtonCmd(this.getId()+":cmdExpandAll",{
		"onClick":function(){
			self.expandAll();
		}
	}));		
	this.addElement(new ButtonCmd(this.getId()+":cmdScrollBottom",{
		"onClick":function(){
			self.scrollBottom();
		}
	}));		
	this.addElement(new ButtonCmd(this.getId()+":cmdScrollAttr",{
		"onClick":function(e){
			self.scrollAttr(e);
		}
	}));		
	this.addElement(new ButtonCmd(this.getId()+":cmdAdd-btm",{
		"glyph":"glyphicon-plus",
		"title":"Добавить в шаблон новый атрибут",
		"caption":"Добавить атрибут ",	
		"onClick":function(){
			self.addAttrClick();
		}
	}));		
	this.addElement(new ButtonCmd(this.getId()+":cmdCollapseAll-btm",{
		"onClick":function(){
			self.collapseAll();
		}
	}));		
	this.addElement(new ButtonCmd(this.getId()+":cmdExpandAll-btm",{
		"onClick":function(){
			self.expandAll();
		}
	}));		
	this.addElement(new ButtonCmd(this.getId()+":cmdScrollTop",{
		"onClick":function(){
			self.scrollTop();
		}
	}));		
	this.addElement(new ButtonCmd(this.getId()+":cmdScrollAttr-btm",{
		"onClick":function(e){
			self.scrollAttr(e);
		}
	}));		

	this.addElement(new ButtonCmd(this.getId()+":cmdTest-btm",{
		"onClick":function(e){
			self.testTemplate();
		}
	}));		
	this.addElement(new ButtonCmd(this.getId()+":cmdTest",{
		"onClick":function(e){
			self.testTemplate();
		}
	}));		
	
}

DocTemplateFieldContainer.prototype.addAttrClick = function(){	
	var new_elem = this.createNewElement();
	this.m_container.addElement(new_elem);
	new_elem.toDOM(this.m_container.getNode());
	
	//toggle
	var toggle_ctrl = document.getElementById(new_elem.getId()+":cmdToggle");	
	if(toggle_ctrl){
		var self = this;
		EventHelper.add(toggle_ctrl,"click",function(e){
			self.evCollapse(e);
		});
	}
	
	new_elem.getElement("user_id").focus();
	this.scrollToElement(new_elem,300);

}
DocTemplateFieldContainer.prototype.doCollapse = function(collapse){	
	var elem_list = this.m_container.getElements();
	for(var elem_id in elem_list){		
		this.setPanelDescr(elem_list[elem_id]);
		var n = elem_list[elem_id].getNode();
		var body = DOMHelper.getElementsByAttr("panel-body",n,"class",true)[0];
		body.style.display = collapse? "none":"block";
		var rotate = DOMHelper.getElementsByAttr("collapse",n,"data-action",true)[0];
		if(collapse){
			DOMHelper.addClass(n,"panel-collapsed");
			DOMHelper.addClass(rotate,"rotate-180");
		}
		else{
			DOMHelper.delClass(n,"panel-collapsed");
			DOMHelper.delClass(rotate,"rotate-180");
		}		
		
	}	
}
DocTemplateFieldContainer.prototype.collapseAll = function(){
	this.doCollapse(true);
}
DocTemplateFieldContainer.prototype.expandAll = function(){
	this.doCollapse(false);
}
DocTemplateFieldContainer.prototype.scrollBottom = function(){	
	var elem = this.findElementByIndex(this.m_container.getCount()-1);
	if(elem)this.scrollToElement(elem,300);
}
DocTemplateFieldContainer.prototype.scrollAttr = function(e){	
	e = EventHelper.fixMouseEvent(e);
	var pop_up = new PopUpMenu();
	var elem_list = this.m_container.getElements();
	var self = this;
	for(var elem_id in elem_list){		
		if(elem_list[elem_id]){
			var user_id = elem_list[elem_id].getElement("user_id").getValue();
			var cap = user_id;
			cap = this.addPanelDataTypeDescr(elem_list[elem_id],cap);
			pop_up.add({
				"id":user_id,
				"caption":cap,
				"onClick":function(target,id){
					var elem_list = self.m_container.getElements();
					for(var elem_id in elem_list){		
						if(elem_list[elem_id].getElement("user_id").getValue()==id){
							self.scrollToElement(elem_list[elem_id],300);
							break;
						}
					}
				}
			});
		}
	}
	pop_up.show(e,e.target);
}
DocTemplateFieldContainer.prototype.scrollTop = function(){	
	var elem = this.findElementByIndex(0);
	if(elem)this.scrollToElement(elem,300);
}



DocTemplateFieldContainer.prototype.getValue = function(){	
	return CommonHelper.serialize(this.getValueJSON());
}

DocTemplateFieldContainer.prototype.getValueJSON = function(){	
	var o_ar = [];
	var elements = this.m_container.getElements();
	for (var id in elements){
		if (elements[id])
			o_ar[parseInt(elements[id].getAttr("ind"),10)] = (elements[id].getValueJSON());
	}
	return o_ar;
}

DocTemplateFieldContainer.prototype.createNewElement = function(){
	var opts = (this.m_elementOptions)? CommonHelper.clone(this.m_elementOptions):{};
	var elem_list = this.m_container.getElements();
	var ind = -1;
	for(var elem_id in elem_list){
		if (elem_list[elem_id]){
			var elem_ind = parseInt(elem_list[elem_id].getAttr("ind"),10);
			if (elem_ind>ind){
				ind = elem_ind; 
			}
		}
	}
	ind++;
	var id = CommonHelper.uniqid();//this.getId()+":container:"+ind;
	opts.cmdClose = true;
	opts.attrs = opts.attrs||{};
	opts.attrs.ind=ind;
	
	self = this;	
	opts.onClosePanel = function(e){
		var cur_index = this.getAttr("ind");
		//console.log("Looking for index "+cur_index)
		var element = self.findElementByIndex(cur_index);
		self.m_container.delElement(element.getName());
		this.delDOM();
		var elem_list = self.m_container.getElements();
		for(var id in elem_list){
			if (elem_list[id]){
				var elem_ind = parseInt(elem_list[id].getAttr("ind"),10);
				if ( elem_ind>=cur_index){
					elem_ind--;
					elem_list[id].setAttr("ind",elem_ind);
					elem_list[id].setAttr("class",("panel "+self.m_panelClass+" panel-"+((elem_ind%2==0)? "even":"odd")));
				}
			}
		}		
	}
	opts.onMoveUp = function(element){
		self.moveElementUp(element)
	}
	opts.onMoveDown = function(element){
		self.moveElementDown(element)
	}
	
	opts.templateOptions = opts.templateOptions || {};
	
	opts.templateOptions.IND = ind+1;
	opts.templateOptions.panelClass = "panel "+this.m_panelClass+" panel-"+((ind%2==0)? "even":"odd");
	opts.templateOptions.cmdClose = !this.m_readOnly;
	
	var new_elem = new this.m_elementClass(id,opts);
	
	return new_elem;	
}

DocTemplateFieldContainer.prototype.setValueOrInit = function(v,isInit){
	this.m_container.clear();
	
	var o_ar;
	if (typeof(v)=="string"){
		o_ar = CommonHelper.unserialize(v);
	}
	else{
		o_ar = v;
	}
//console.log("DocTemplateFieldContainer.prototype.setValueOrInit")
//console.dir(o_ar)
	
	for (var i=0;i<o_ar.length;i++){
		var new_elem = this.createNewElement();
		if (isInit && new_elem.setInitValue){
			new_elem.setInitValue(o_ar[i]);
		}
		else{
			new_elem.setValue(o_ar[i]);
		}
		this.m_container.addElement(new_elem);
		new_elem.toDOM(this.m_container.getNode());
	}
	
	//events to all panels, Collapse on click
	var self = this;
	$("."+this.m_panelClass+" [data-action=collapse]").click(function (e) {
		self.evCollapse(e);
	});
	
}

DocTemplateFieldContainer.prototype.setValue = function(v){
	this.setValueOrInit(v,false);
}

DocTemplateFieldContainer.prototype.setInitValue = function(v){
	this.setValueOrInit(v,true);
}

DocTemplateFieldContainer.prototype.setValid = function(){
	var elements = this.m_container.getElements();
	for (var id in elements){
		if (elements[id])
			elements[id].setValid();
	}
}

DocTemplateFieldContainer.prototype.setNotValid = function(str){
	//var list = this.getElements();
	//console.log("Error:"+str)
}

DocTemplateFieldContainer.prototype.getModified = function(){
	var res = false;
	var elements = this.m_container.getElements();
	for (var id in elements){
		if (!elements[id] || elements[id].getModified()){
			res = true;
			break;
		}
	}
	return res;
}

DocTemplateFieldContainer.prototype.isNull = function(){
	var res = true;
	var elements = this.m_container.getElements();
	for (var id in elements){
		if (elements[id] && !elements[id].isNull()){
			res = false;
			break;
		}
	}
	return res;
}

DocTemplateFieldContainer.prototype.addPanelDataTypeDescr = function(panelElem,txt){	
	var dt = panelElem.getElement("data_type").getValue();
	var dt_d = window.getApp().getTemplateAttrTypes()[dt];
	if(dt_d){
		txt+= " ("+dt_d.descr+")";
	}
	return txt;
}

DocTemplateFieldContainer.prototype.setPanelDescr = function(panelElem){	
	var attr_ids = DOMHelper.getElementsByAttr("attr-id", panelElem.getNode(),"class",true);
	if(attr_ids&&attr_ids.length){
		var t = panelElem.getElement("user_id").getValue();
		t = this.addPanelDataTypeDescr(panelElem,t);
		
		DOMHelper.setText(attr_ids[0],t);
		var com_t = panelElem.getElement("comment_text").getValue();
		if(com_t)DOMHelper.setAttr(attr_ids[0],"title",com_t);
	}
}

DocTemplateFieldContainer.prototype.evCollapse = function(e){	
	e.preventDefault();
	var this_elem = e.target;
	var $panelCollapse = $(this_elem).parent().parent().parent().parent().nextAll();
	
	var panel = $(this_elem).parents("."+this.m_panelClass);
	
	var ind = panel[0]? parseInt(panel[0].getAttribute("ind")):null;
	if(ind>=0){
		var panel_elem = this.findElementByIndex(ind);
		if(panel_elem){
			this.setPanelDescr(panel_elem);
		}
	}	
	
	panel.toggleClass("panel-collapsed");
	$(this_elem).toggleClass("rotate-180");

	//recalculate page height
	var availableHeight = $(window).height() - $(".page-container").offset().top - $(".navbar-fixed-bottom").outerHeight();

	$(".page-container").attr("style", "min-height:" + availableHeight + "px");
	$panelCollapse.slideToggle(150);
}

DocTemplateFieldContainer.prototype.moveElementDown = function(element){
	if (this.m_animating) {
		return;
	}
	var cur_ind = parseInt(element.getAttr("ind"));
	if (cur_ind+1 < this.m_container.getCount()){		
		this.moveElement(element,cur_ind,1);
	}
}
DocTemplateFieldContainer.prototype.moveElementUp = function(element){
	if (this.m_animating) {
		return;
	}
	var cur_ind = parseInt(element.getAttr("ind"));
	if (cur_ind){		
		this.moveElement(element,cur_ind,-1);
	}
}

DocTemplateFieldContainer.prototype.findElementByIndex = function(ind){
	var res;
	var elem_list = this.m_container.getElements();
	for(var elem_id in elem_list){
		if (elem_list[elem_id]&&elem_list[elem_id].getAttr("ind")==ind){
			res = elem_list[elem_id]; 
			break;
		}
	}
	return res;
}

DocTemplateFieldContainer.prototype.moveElement = function(element,curIndex,direction){
	var swap_index = curIndex + direction;
	var swap_element = this.findElementByIndex(swap_index);
	var element_jq = $(element.getNode());
	var swap_element_jq = $(swap_element.getNode());
	var distance = element_jq.outerHeight();
	
	this.m_animating = true;
	var self = this;
	
	$.when(element_jq.animate({
		top: distance*direction
	}, 600),	
	swap_element_jq.animate({
		top: distance*(-direction)
	}, 600)).done(function () {
		swap_element_jq.css('top', '0px');
		element_jq.css('top', '0px');
		
		if (direction==1){
			swap_element_jq.insertBefore(element_jq);			
		}
		else{
			element_jq.insertBefore(swap_element_jq);			
		}
		
		element.setAttr("ind",swap_index);
		var elem_cl = element.getAttr("class");
		element.setAttr("class",swap_element.getAttr("class"));
		swap_element.setAttr("ind",curIndex);
		swap_element.setAttr("class",elem_cl);
		self.scrollToElement(element,600);
		self.m_animating = false;
	});		

}

DocTemplateFieldContainer.prototype.scrollToElement = function(element,speed){
	speed = (speed!=undefined)? speed:600;
	$([document.documentElement, document.body]).animate({
		scrollTop: $(element.getNode()).offset().top
	}, speed);	
}

DocTemplateFieldContainer.prototype.testTemplate = function(){	
	if (!this.getModified()){
		this.testTemplateCont();
	}
	else{
		this.m_mainView.getControlOK().setEnabled(false);
		this.m_mainView.getControlSave().setEnabled(false);
		var self = this;
		this.m_mainView.onSave(
			function(){
				self.testTemplateCont();
			},
			null,
			function(){
				self.m_mainView.getControlOK().setEnabled(true);
				self.m_mainView.getControlSave().setEnabled(true);				
			}
		);								
	}					
}
DocTemplateFieldContainer.prototype.testTemplateCont = function(){
	var self = this;
	this.m_testCloseSelect = function(){
		self.m_testView.delDOM();
		self.m_testForm.close();
		delete self.m_testView;
		delete self.m_testForm;
	}			
	this.m_testView = new DocumentDialog_View("docTestView",{
		"test":true,
		"userFunctions":this.m_mainView.getElement("user_functions").getValue()
	});
	this.m_testForm = new WindowFormModalBS("docTestForm",{
		"cmdCancel":true,
		"controlCancelCaption":"Закрыть",
		"controlCancelTitle":"Закрыть",
		"cmdOk":false,
		"onClickCancel":function(){
			self.m_testCloseSelect();
		},	
		"content":self.m_testView,
		"contentHead":"Проверка шаблона"
	});

	this.m_testForm.open();
	this.m_testView.renderTemplate(this.getValueJSON())
	//edit_instance.focus();


}
