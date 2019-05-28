/**
 * @author Andrey Mikhalevich <katrenplus@mail.ru>, 2017
 * @class
 * @classdesc Grid column Enumerator class. Created from template build/templates/js/EnumGridColumn_js.xsl. !!!DO NOT MODIFY!!!
 
 * @extends GridColumnEnum
 
 * @requires core/extend.js
 * @requires controls/GridColumnEnum.js
 
 * @param {object} options
 */

function EnumGridColumn_email_types(options){
	options = options || {};
	
	options.multyLangValues = {};
	
	options.multyLangValues["ru"] = {};

	options.multyLangValues["ru"]["new_account"] = "Новый акаунт";

	options.multyLangValues["ru"]["reset_pwd"] = "Установка пароля";

	options.multyLangValues["ru"]["user_email_conf"] = "Подтверждение пароля";

	
	options.ctrlClass = options.ctrlClass || Enum_email_types;
	options.searchOptions = options.searchOptions || {};
	options.searchOptions.searchType = options.searchOptions.searchType || "on_match";
	options.searchOptions.typeChange = (options.searchOptions.typeChange!=undefined)? options.searchOptions.typeChange:false;
	
	EnumGridColumn_email_types.superclass.constructor.call(this,options);		
}
extend(EnumGridColumn_email_types,GridColumnEnum);

