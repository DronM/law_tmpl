/** Copyright (c) 2018
 *  Andrey Mikhalevich, Katren ltd.
 *
 * Форма работала со старым ЕГРЮЛ с egrul
 */
 
/*
		<controller id="Egrul" parentId="ControllerSQL">
			<publicMethod id="get_captcha" />
			<publicMethod id="find">
				<field id="query_id" dataType="String" length="20" required="FALSE" />
				<field id="search_value" dataType="String" length="200" required="TRUE"/>
				<field id="search_by" dataType="String" length="20" required="FALSE" />
				<field id="kind" dataType="String" length="2" required="FALSE" />
				<field id="captcha" dataType="String" length="20" required="FALSE" />
				<field id="region" dataType="Int" required="FALSE"/>
			</publicMethod>
			<publicMethod id="get_cache_list">
				<field id="ic" dataType="String" length="5" />
				<field id="mid" dataType="String" length="5" />
				<field id="ord_fields" dataType="String" length="100" />
				<field id="val" dataType="String" length="250" required="TRUE" />
			</publicMethod>
			<publicMethod id="get_cache_obj">
				<field id="inn" dataType="String" length="12" required="TRUE" />
			</publicMethod>
		</controller>

*/ 
function EgrulEdit(id,options){

	options = options || {};
	
	options.template = window.getApp().getTemplate("EgrulEdit");
	options.className = options.className || "form-group";
	
	var self = this;
	
	options.addElement = function(){
		var id = this.getId();
		
		var bs = window.getBsCol(4);
		
		this.addElement(new EgrulSearchDataEditRef(id+":search_data",{
			"labelCaption":options.labelCaption,
			"attrs":{"autofocus":"true"},
			"onSelect":function(fields){
				var pm = (new Egrul_Controller()).getPublicMethod("get_cache_obj");
				pm.setFieldValue("inn",fields.inn.getValue());
				pm.run({
					"ok":function(resp){
						var m = new ModelXML("EgrulCacheObject_Model",{"data":resp.getModelData("EgrulCacheObject_Model")});
						if(m.getNextRow()){
							//self.m_queryId = DateHelper.strtotime(m.getFieldValue("create_dt"));
							self.setValueOrInit(CommonHelper.unserialize(m.getFieldValue("data")),false);
							self.m_modified = true;
						}
					
					}
				});
			}
		}));

		this.addElement(new EditRadioGroup(id+":kind",{
			"elements":[
				new EditRadio(id+":kind:ul",{
					"labelCaption":"Юридическое лицо",
					"checked":true,
					"value":"ul",
					"name":"kind",
					"labelAlign":"right",
					"labelClassName":window.getBsCol(9),
					"editContClassName":"input-group "+window.getBsCol(12),
					"className":window.getBsCol(1),
					"contClassName":window.getBsCol(6)
				})
				,new EditRadio(id+":kind:fl",{
					"labelCaption":"Индивидуальный предприниматель",
					"value":"fl",
					"name":"kind",
					"labelAlign":"right",
					"labelClassName":window.getBsCol(9),
					"editContClassName":"input-group "+window.getBsCol(12),
					"className":window.getBsCol(1),
					"contClassName":window.getBsCol(6)				
				})
			]					
		}));

		this.addElement(new EditSelect(id+":region_list",{
			"visible":false,
			"labelCaption":"Регион:",
			"elements":[
				new EditSelectOption(id+":region_list:77",{"descr":"77 - МОСКВА Г","value":"77"}),
				new EditSelectOption(id+":region_list:78",{"descr":"78 - САНКТ-ПЕТЕРБУРГ Г","value":"78"}),
				new EditSelectOption(id+":region_list:01",{"descr":"01 - АДЫГЕЯ РЕСП","value":"01"}),
				new EditSelectOption(id+":region_list:02",{"descr":"02 - БАШКОРТОСТАН РЕСП","value":"02"}),
				new EditSelectOption(id+":region_list:03",{"descr":"03 - БУРЯТИЯ РЕСП","value":"03"}),
				new EditSelectOption(id+":region_list:04",{"descr":"04 - АЛТАЙ РЕСП","value":"04"}),
				new EditSelectOption(id+":region_list:05",{"descr":"05 - ДАГЕСТАН РЕСП","value":"05"}),
				new EditSelectOption(id+":region_list:06",{"descr":"06 - ИНГУШЕТИЯ РЕСП","value":"06"}),
				new EditSelectOption(id+":region_list:07",{"descr":"07 - КАБАРДИНО-БАЛКАРСКАЯ РЕСП","value":"07"}),
				new EditSelectOption(id+":region_list:08",{"descr":"08 - КАЛМЫКИЯ РЕСП","value":"08"}),
				new EditSelectOption(id+":region_list:09",{"descr":"09 - КАРАЧАЕВО-ЧЕРКЕССКАЯ РЕСП","value":"09"}),
				new EditSelectOption(id+":region_list:10",{"descr":"10 - КАРЕЛИЯ РЕСП","value":"10"}),
				new EditSelectOption(id+":region_list:11",{"descr":"11 - КОМИ РЕСП","value":"11"}),
				new EditSelectOption(id+":region_list:12",{"descr":"12 - МАРИЙ ЭЛ РЕСП","value":"12"}),
				new EditSelectOption(id+":region_list:13",{"descr":"13 - МОРДОВИЯ РЕСП","value":"13"}),
				new EditSelectOption(id+":region_list:14",{"descr":"14 - САХА /ЯКУТИЯ/ РЕСП","value":"14"}),
				new EditSelectOption(id+":region_list:15",{"descr":"15 - СЕВЕРНАЯ ОСЕТИЯ - АЛАНИЯ РЕСП","value":"15"}),
				new EditSelectOption(id+":region_list:16",{"descr":"16 - ТАТАРСТАН РЕСП","value":"16"}),
				new EditSelectOption(id+":region_list:17",{"descr":"17 - ТЫВА РЕСП","value":"17"}),
				new EditSelectOption(id+":region_list:18",{"descr":"18 - УДМУРТСКАЯ РЕСП","value":"18"}),
				new EditSelectOption(id+":region_list:19",{"descr":"19 - ХАКАСИЯ РЕСП","value":"19"}),
				new EditSelectOption(id+":region_list:20",{"descr":"20 - ЧЕЧЕНСКАЯ РЕСП","value":"20"}),
				new EditSelectOption(id+":region_list:21",{"descr":"21 - ЧУВАШСКАЯ РЕСПУБЛИКА - ЧУВАШИЯ","value":"21"}),
				new EditSelectOption(id+":region_list:22",{"descr":"22 - АЛТАЙСКИЙ КРАЙ","value":"22"}),
				new EditSelectOption(id+":region_list:23",{"descr":"23 - КРАСНОДАРСКИЙ КРАЙ","value":"23"}),
				new EditSelectOption(id+":region_list:24",{"descr":"24 - КРАСНОЯРСКИЙ КРАЙ","value":"24"}),
				new EditSelectOption(id+":region_list:25",{"descr":"25 - ПРИМОРСКИЙ КРАЙ","value":"25"}),
				new EditSelectOption(id+":region_list:26",{"descr":"26 - СТАВРОПОЛЬСКИЙ КРАЙ","value":"26"}),
				new EditSelectOption(id+":region_list:27",{"descr":"27 - ХАБАРОВСКИЙ КРАЙ","value":"27"}),
				new EditSelectOption(id+":region_list:28",{"descr":"28 - АМУРСКАЯ ОБЛ","value":"28"}),
				new EditSelectOption(id+":region_list:29",{"descr":"29 - АРХАНГЕЛЬСКАЯ ОБЛ","value":"29"}),
				new EditSelectOption(id+":region_list:30",{"descr":"30 - АСТРАХАНСКАЯ ОБЛ","value":"30"}),
				new EditSelectOption(id+":region_list:31",{"descr":"31 - БЕЛГОРОДСКАЯ ОБЛ","value":"31"}),
				new EditSelectOption(id+":region_list:32",{"descr":"32 - БРЯНСКАЯ ОБЛ","value":"32"}),
				new EditSelectOption(id+":region_list:33",{"descr":"33 - ВЛАДИМИРСКАЯ ОБЛ","value":"33"}),
				new EditSelectOption(id+":region_list:34",{"descr":"34 - ВОЛГОГРАДСКАЯ ОБЛ","value":"34"}),
				new EditSelectOption(id+":region_list:35",{"descr":"35 - ВОЛОГОДСКАЯ ОБЛ","value":"35"}),
				new EditSelectOption(id+":region_list:36",{"descr":"36 - ВОРОНЕЖСКАЯ ОБЛ","value":"36"}),
				new EditSelectOption(id+":region_list:37",{"descr":"37 - ИВАНОВСКАЯ ОБЛ","value":"37"}),
				new EditSelectOption(id+":region_list:38",{"descr":"38 - ИРКУТСКАЯ ОБЛ","value":"38"}),
				new EditSelectOption(id+":region_list:39",{"descr":"39 - КАЛИНИНГРАДСКАЯ ОБЛ","value":"39"}),
				new EditSelectOption(id+":region_list:40",{"descr":"40 - КАЛУЖСКАЯ ОБЛ","value":"40"}),
				new EditSelectOption(id+":region_list:41",{"descr":"41 - КАМЧАТСКИЙ КРАЙ","value":"41"}),
				new EditSelectOption(id+":region_list:42",{"descr":"42 - КЕМЕРОВСКАЯ ОБЛ","value":"42"}),
				new EditSelectOption(id+":region_list:43",{"descr":"43 - КИРОВСКАЯ ОБЛ","value":"43"}),
				new EditSelectOption(id+":region_list:44",{"descr":"44 - КОСТРОМСКАЯ ОБЛ","value":"44"}),
				new EditSelectOption(id+":region_list:45",{"descr":"45 - КУРГАНСКАЯ ОБЛ","value":"45"}),
				new EditSelectOption(id+":region_list:46",{"descr":"46 - КУРСКАЯ ОБЛ","value":"46"}),
				new EditSelectOption(id+":region_list:47",{"descr":"47 - ЛЕНИНГРАДСКАЯ ОБЛ","value":"47"}),
				new EditSelectOption(id+":region_list:48",{"descr":"48 - ЛИПЕЦКАЯ ОБЛ","value":"48"}),
				new EditSelectOption(id+":region_list:49",{"descr":"49 - МАГАДАНСКАЯ ОБЛ","value":"49"}),
				new EditSelectOption(id+":region_list:50",{"descr":"50 - МОСКОВСКАЯ ОБЛ","value":"50"}),
				new EditSelectOption(id+":region_list:51",{"descr":"51 - МУРМАНСКАЯ ОБЛ","value":"51"}),
				new EditSelectOption(id+":region_list:52",{"descr":"52 - НИЖЕГОРОДСКАЯ ОБЛ","value":"52"}),
				new EditSelectOption(id+":region_list:53",{"descr":"53 - НОВГОРОДСКАЯ ОБЛ","value":"53"}),
				new EditSelectOption(id+":region_list:54",{"descr":"54 - НОВОСИБИРСКАЯ ОБЛ","value":"54"}),
				new EditSelectOption(id+":region_list:55",{"descr":"55 - ОМСКАЯ ОБЛ","value":"55"}),
				new EditSelectOption(id+":region_list:56",{"descr":"56 - ОРЕНБУРГСКАЯ ОБЛ","value":"56"}),
				new EditSelectOption(id+":region_list:57",{"descr":"57 - ОРЛОВСКАЯ ОБЛ","value":"57"}),
				new EditSelectOption(id+":region_list:58",{"descr":"58 - ПЕНЗЕНСКАЯ ОБЛ","value":"58"}),
				new EditSelectOption(id+":region_list:59",{"descr":"59 - ПЕРМСКИЙ КРАЙ","value":"59"}),
				new EditSelectOption(id+":region_list:60",{"descr":"60 - ПСКОВСКАЯ ОБЛ","value":"60"}),
				new EditSelectOption(id+":region_list:61",{"descr":"61 - РОСТОВСКАЯ ОБЛ","value":"61"}),
				new EditSelectOption(id+":region_list:62",{"descr":"62 - РЯЗАНСКАЯ ОБЛ","value":"62"}),
				new EditSelectOption(id+":region_list:63",{"descr":"63 - САМАРСКАЯ ОБЛ","value":"63"}),
				new EditSelectOption(id+":region_list:64",{"descr":"64 - САРАТОВСКАЯ ОБЛ","value":"64"}),
				new EditSelectOption(id+":region_list:65",{"descr":"65 - САХАЛИНСКАЯ ОБЛ","value":"65"}),
				new EditSelectOption(id+":region_list:66",{"descr":"66 - СВЕРДЛОВСКАЯ ОБЛ","value":"66"}),
				new EditSelectOption(id+":region_list:67",{"descr":"67 - СМОЛЕНСКАЯ ОБЛ","value":"67"}),
				new EditSelectOption(id+":region_list:68",{"descr":"68 - ТАМБОВСКАЯ ОБЛ","value":"68"}),
				new EditSelectOption(id+":region_list:69",{"descr":"69 - ТВЕРСКАЯ ОБЛ","value":"69"}),
				new EditSelectOption(id+":region_list:70",{"descr":"70 - ТОМСКАЯ ОБЛ","value":"70"}),
				new EditSelectOption(id+":region_list:71",{"descr":"71 - ТУЛЬСКАЯ ОБЛ","value":"71"}),
				new EditSelectOption(id+":region_list:72",{"descr":"72 - ТЮМЕНСКАЯ ОБЛ","value":"72"}),
				new EditSelectOption(id+":region_list:73",{"descr":"73 - УЛЬЯНОВСКАЯ ОБЛ","value":"73"}),
				new EditSelectOption(id+":region_list:74",{"descr":"74 - ЧЕЛЯБИНСКАЯ ОБЛ","value":"74"}),
				new EditSelectOption(id+":region_list:75",{"descr":"75 - ЗАБАЙКАЛЬСКИЙ КРАЙ","value":"75"}),
				new EditSelectOption(id+":region_list:76",{"descr":"76 - ЯРОСЛАВСКАЯ ОБЛ","value":"76"}),
				new EditSelectOption(id+":region_list:79",{"descr":"79 - ЕВРЕЙСКАЯ АОБЛ","value":"79"}),
				new EditSelectOption(id+":region_list:83",{"descr":"83 - НЕНЕЦКИЙ АО","value":"83"}),
				new EditSelectOption(id+":region_list:86",{"descr":"86 - ХАНТЫ-МАНСИЙСКИЙ АВТОНОМНЫЙ ОКРУГ - ЮГРА АО","value":"86"}),
				new EditSelectOption(id+":region_list:87",{"descr":"87 - ЧУКОТСКИЙ АО","value":"87"}),
				new EditSelectOption(id+":region_list:89",{"descr":"89 - ЯМАЛО-НЕНЕЦКИЙ АО","value":"89"}),
				new EditSelectOption(id+":region_list:91",{"descr":"91 - КРЫМ РЕСП","value":"91"}),
				new EditSelectOption(id+":region_list:92",{"descr":"92 - СЕВАСТОПОЛЬ Г","value":"92"}),
				new EditSelectOption(id+":region_list:99",{"descr":"99 - БАЙКОНУР Г","value":"99"})			]
		}));

		this.addElement(new EditRadioGroup(id+":search_type",{
			"labelCaption":"Вид поиска:",
			"elements":[
				new EditRadio(id+":search_type:innogrn",{
					"labelCaption":"ОГРН/ИНН",
					"checked":true,
					"value":"innogrn",
					"name":"search_type",
					"labelAlign":"right",
					"labelClassName":window.getBsCol(9),
					"editContClassName":"input-group "+window.getBsCol(12),
					"className":window.getBsCol(1),
					"contClassName":window.getBsCol(6),
					"events":{
						"change":function(){
							self.searchTypeChanged(this.getValue());
						}
					}
				})
				,new EditRadio(id+":search_type:name",{
					"labelCaption":"Наименование/ФИО",
					"value":"name",
					"name":"search_type",
					"labelAlign":"right",
					"labelClassName":window.getBsCol(9),
					"editContClassName":"input-group "+window.getBsCol(12),
					"className":window.getBsCol(1),
					"contClassName":window.getBsCol(6),
					"events":{
						"change":function(){
							self.searchTypeChanged(this.getValue());
						}
					}					
				})
			]					
		}));
		
		this.addElement(new Control(id+":captcha_pic","IMG"));
		
		this.addElement(new Control(id+":value_for_template","DIV"));		
		
		this.addElement(new EditString(id+":captcha_str",{
			"placeholder":"Введите цифры с картинки",
			"editContClassName":("input-group "+window.getBsCol(12)),
			"maxLength":6,
			"events":{
				"keydown":function(e){
					e = EventHelper.fixKeyEvent(e);
					if (e.keyCode==13){
						self.find();
					}					
				}
			}
		}));

		this.addElement(new Control(id+":captcha_refresh","A",{
			"events":{
				"click":function(e){
					self.captcha_refresh();
					self.getElement("captcha_str").focus();
					return EventHelper.stopPropagation(e);
				}
			}
		}));
		
		this.addElement(new Control(id+":data","DIV"));
		
		this.addElement(new ButtonCmd(id+":find",{
			"caption":"Найти",
			"title":"Найти организацию/ИП в базе ФНС",
			"onClick":function(){
				self.find();
			}
		}));
	};	

	EgrulEdit.superclass.constructor.call(this,id,"DIV",options);
	
	this.m_modified = false;
	
	if (options.valueJSON){
		this.setValue(options.valueJSON);
	}
	
}

extend(EgrulEdit,ControlContainer);

EgrulEdit.prototype.m_queryId;
EgrulEdit.prototype.m_value;
EgrulEdit.prototype.m_modified;

EgrulEdit.prototype.find = function(){
	if(!this.m_queryId||!this.m_queryId.length){
		throw Error("Не получены данные о картинке!");
	}

	var search_type = this.getElement("search_type").getValue();
	var kind = this.getElement("kind").getValue();
	
	var pm = (new Egrul_Controller()).getPublicMethod("find");
	pm.setFieldValue("search_by", search_type);
	pm.setFieldValue("search_value", this.getElement("search_data").getValue().getDescr());
	pm.setFieldValue("kind", kind);
	pm.setFieldValue("query_id", this.m_queryId);
	pm.setFieldValue("captcha", this.getElement("captcha_str").getValue());
	if(search_type=="name"){
		var reg_ctrl = this.getElement("region_list");
		if(reg_ctrl.isSet()){
			pm.setFieldValue("region", reg_ctrl.getValue());
		}
	}
	var self = this;
	pm.run({
		"ok":function(respJSON){
			self.m_value = respJSON;			
			self.m_modified = true;
			self.getElement("captcha_pic").setAttr("src","");
			self.renderData(true);			
		}
		,"fail":function(resp,errCode,errStr){
			self.getElement("search_data").setNotValid(errStr);
			self.getElement("captcha_str").reset();
			self.captcha_refresh();
		}
		
	});
}

EgrulEdit.prototype.renderData = function(show){
	//prepare template data
	var tmpl_opts = {"sections":[]};
	for(var sec_id in this.m_value){
		var rows = [];
		for(var i=0;i<this.m_value[sec_id].value.length;i++){
			for(field_id in this.m_value[sec_id].value[i]){
				rows.push(
					{"descr":this.m_value[sec_id].value[i][field_id].descr,
					"value":this.m_value[sec_id].value[i][field_id].value,
					"id":field_id
				});
			}
			
		}
		tmpl_opts.sections.push({
			"descr":this.m_value[sec_id].descr,
			"rows":rows,
			"id":sec_id
		});
	}
		
	var ctrl = this.getElement("data");
	ctrl.getNode().innerHTML = Mustache.render(window.getApp().getTemplate("EgrulEditData"),tmpl_opts);
	if(show)
		$('#documentTabs a[href="#found_data"]').tab("show");
	//ctrl.toDOM()
	//console.dir(tmpl_opts.sections)
}

EgrulEdit.prototype.captcha_refresh = function(){
	if(this.m_captcha_refreshing){
		throw new Error("Уже отправлен запрос на получение данных!");
	}
	
	var self = this;
	this.m_captcha_refreshing = true;
	(new Egrul_Controller()).run("get_captcha",{
		"ok":function(resp){
			var m = new ModelXML("EgrulCaptcha_Model",{"data":resp.getModelData("EgrulCaptcha_Model")});
			if(m.getNextRow()){
				self.m_queryId = m.getFieldValue("queryId");
				self.getElement("captcha_pic").setAttr("src","data:image/jpeg;base64,"+m.getFieldValue("captchaContent"));				
				console.log("QueryId="+self.m_queryId)
			}
		},
		"all":function(){
			self.m_captcha_refreshing = false;
		}
	});
}

EgrulEdit.prototype.getValueJSON = function(){	
	return this.m_value;
}

EgrulEdit.prototype.getValue = function(){	
	return CommonHelper.serialize(this.getValueJSON());
}

EgrulEdit.prototype.setValueOrInit = function(v,isInit){
	if (typeof(v)=="string"){
		this.m_value = CommonHelper.unserialize(v);
	}
	else{
		this.m_value = v;
	}
	this.renderData(true);
}

EgrulEdit.prototype.setValue = function(v){
	this.setValueOrInit(v,false);
}

EgrulEdit.prototype.setInitValue = function(v){
	this.setValueOrInit(v,true);
}

EgrulEdit.prototype.setValid = function(){
	return true;
}

EgrulEdit.prototype.setNotValid = function(str){
}

EgrulEdit.prototype.getModified = function(){
	return this.m_modified;
}

EgrulEdit.prototype.isNull = function(){
	return (this.m_value===null);
}

EgrulEdit.prototype.searchTypeChanged = function(val){
	this.getElement("region_list").setVisible((val=="name"));
}
