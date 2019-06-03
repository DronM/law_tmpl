<?php
require_once(FRAME_WORK_PATH.'basic_classes/ViewHTMLXSLT.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelStyleSheet.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelJavaScript.php');

require_once(FRAME_WORK_PATH.'basic_classes/ModelTemplate.php');
require_once(USER_CONTROLLERS_PATH.'Constant_Controller.php');
require_once(USER_CONTROLLERS_PATH.'MainMenuConstructor_Controller.php');


			
				
			
			
				
			
		
class ViewBase extends ViewHTMLXSLT {	

	private $dbLink;

	protected static function getMenuClass(){
		//USER_MODELS_PATH
		$menu_class = NULL;
		$fl = NULL;
		if (file_exists($fl = OUTPUT_PATH.'MainMenu_Model_'.$_SESSION['user_id'].'.php')){
			$menu_class = 'MainMenu_Model_'.$_SESSION['user_id'];
		}
		else if (file_exists($fl = OUTPUT_PATH.'MainMenu_Model_'.$_SESSION['role_id'].'_'.$_SESSION['user_id'].'.php')){
			$menu_class = 'MainMenu_Model_'.$_SESSION['role_id'].'_'.$_SESSION['user_id'];
		}
		else if (file_exists($fl = OUTPUT_PATH.'MainMenu_Model_'.$_SESSION['role_id'].'.php')){
			$menu_class = 'MainMenu_Model_'.$_SESSION['role_id'];
		}
		if (!is_null($menu_class) && !is_null($fl)){
			require_once($fl);
		}
		return $menu_class;
	}

	protected function addMenu(&$models){
		if (isset($_SESSION['role_id'])){
			//USER_MODELS_PATH
			$menu_class = self::getMenuClass();
			if (is_null($menu_class)){
				//no menu exists yet
				$this->initDbLink();
				$contr = new MainMenuConstructor_Controller($this->dbLink);
				$contr->genMenuForUser($_SESSION['user_id'], $_SESSION['role_id']);
				$menu_class = self::getMenuClass();
				if (is_null($menu_class)){
					throw new Exception('No menu found!');
				}				
			}
			$models['mainMenu'] = new $menu_class();
		}	
	}
	
	protected function initDbLink(){
		if (!$this->dbLink){
			$this->dbLink = new DB_Sql();
			$this->dbLink->persistent=true;
			$this->dbLink->appname = APP_NAME;
			$this->dbLink->technicalemail = TECH_EMAIL;
			$this->dbLink->reporterror = DEBUG;
			$this->dbLink->database= DB_NAME;
			try{			
				$this->dbLink->connect(DB_SERVER,DB_USER,DB_PASSWORD,(defined('DB_PORT'))? DB_PORT:NULL);
			}
			catch (Exception $e){
				//do nothing
			}
		}	
	}
	
	protected function addConstants(&$models){
		if (isset($_SESSION['role_id'])){
			$this->initDbLink();
		
			if ($this->dbLink){
				$contr = new Constant_Controller($this->dbLink);
				$list = array('doc_per_page_count','grid_refresh_interval','reminder_refresh_interval');
				$models['ConstantValueList_Model'] = $contr->getConstantValueModel($list);						
			}
		}	
	}

	public function __construct($name){
		parent::__construct($name);
		
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'assets/css/icons/icomoon/styles.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'assets/css/bootstrap.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'assets/css/core.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'assets/css/components.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'assets/css/colors.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'assets/css/icons/fontawesome/styles.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'custom-css/easyTree.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.standalone.min.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'custom-css/style.css'));
		$this->addCssModel(new ModelStyleSheet(USER_JS_PATH.'custom-css/print.css'));
			
		
		if (!DEBUG){			
			$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'assets/js/core/libraries/jquery.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'assets/js/core/libraries/bootstrap.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'assets/js/plugins/loaders/blockui.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'assets/js/core/app.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.ru.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/mustache/mustache.min.js'));$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/jshash-2.2/md5-min.js'));
			$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'lib.js'));
			$script_id = VERSION;
		}
		else{		
			
		
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'assets/js/core/libraries/jquery.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'assets/js/core/libraries/bootstrap.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'assets/js/plugins/loaders/blockui.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'assets/js/core/app.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/easyTree.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/bootstrap-datepicker/bootstrap-datepicker.ru.min.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'jquery.maskedinput.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/mustache/mustache.min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/jshash-2.2/md5-min.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/resumablejs/resumable.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/DragnDrop/DragMaster.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/DragnDrop/DragObject.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/DragnDrop/DropTarget.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/extend.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/App.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/AppWin.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/CommonHelper.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/DOMHelper.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/DateHelper.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/EventHelper.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FatalException.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/DbException.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/VersException.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ConstantManager.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ServConnector.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Response.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ResponseXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ResponseJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/PublicMethod.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/PublicMethodServer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ControllerObj.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ControllerObjServer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ControllerObjClient.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelObjectXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelServRespXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelObjectJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelServRespJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelXMLTree.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelJSONTree.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Validator.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorString.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorBool.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorInterval.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorFloat.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorEnum.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorArray.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorEmail.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ValidatorXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/Field.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldString.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldEnum.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldBool.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldDateTimeTZ.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldBigInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldSmallInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldFloat.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldPassword.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldText.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldInterval.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldJSONB.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldArray.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldXML.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/FieldBytea.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/ModelFilter.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/RefType.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'core/rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/DataBinding.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Command.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/CommandBinding.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Control.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/Control.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ControlContainer.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ControlContainer.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewAjx.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewAjxList.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Calculator.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/Calculator.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Button.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCtrl.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonEditCtrl.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonEditCtrl.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCalc.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonCalc.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCalendar.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonCalendar.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonClear.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonClear.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/ButtonCmd.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonExpToExcel.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonExpToExcel.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonExpToPDF.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonExpToPDF.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonOpen.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonOpen.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonInsert.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonInsert.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonPrint.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonPrint.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonPrintList.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonPrintList.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonSelectRef.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonSelectRef.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonSelectDataType.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonSelectDataType.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonMakeSelection.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonMakeSelection.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonToggle.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Label.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Edit.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/Edit.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRefMultyType.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditRefMultyType.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditString.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditText.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditNum.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditInt.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditFloat.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditMoney.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPhone.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditEmail.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPercent.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditInterval.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPassword.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditCheckBox.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditContainer.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditContainer.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRadioGroup.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRadio.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditSelect.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditSelectRef.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'ext/cadesplugin/EditCertificateSelect.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditSelectRef.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditSelectOption.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditSelectOptionRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRadioGroupRef.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditRadioGroupRef.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/PrintObj.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditModalDialog.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditModalDialog.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ControlForm.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/HiddenKey.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditJSON.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EditFile.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditFile.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditCompound.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditCompound.rs_ru.js'));
	}

		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ControlDate.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumn.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnBool.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnPhone.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnEmail.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnFloat.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnByte.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnEnum.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridColumnRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCell.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellHead.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellPhone.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCellPhone.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellFoot.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridHead.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridRow.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridFoot.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridBody.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Grid.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/Grid.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/VariantStorage.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCommands.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmd.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdContainer.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdContainer.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdContainerAjx.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdContainerObj.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdInsert.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdInsert.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdEdit.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdEdit.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdCopy.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdCopy.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdDelete.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdDelete.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdColManager.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdColManager.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdPrint.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdPrint.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdRefresh.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdRefresh.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdPrintObj.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdSearch.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdSearch.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdExport.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdExport.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdAllCommands.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdAllCommands.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdDOCUnprocess.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdDOCUnprocess.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdDOCShowActs.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdDOCShowActs.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdRowUp.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdRowUp.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdRowDown.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdRowDown.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdFilter.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdFilter.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdFilterView.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdFilterView.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdFilterSave.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdFilterSave.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCmdFilterOpen.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCmdFilterOpen.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridColManager.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridColManager.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridColParam.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridColParam.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridColVisibility.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridColVisibility.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridColOrder.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridColOrder.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/VariantStorageSaveView.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/VariantStorageSaveView.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/VariantStorageOpenView.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/VariantStorageOpenView.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridAjx.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridJSON.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/TreeAjx.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridAjxDOCT.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridAjxMaster.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCommandsAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCommandsAjx.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCommandsDOC.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridCommandsDOC.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridPagination.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridPagination.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridFilterInfo.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridFilter.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/GridFilter.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPeriodDate.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/EditPeriodDate.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/EditPeriodDateTime.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonOK.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonOK.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonSave.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonSave.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ButtonCancel.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ButtonCancel.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewObjectAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewObjectAjx.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewGridEditInlineAjx.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewGridEditInlineAjx.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewDOC.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewDOC.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowPrint.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowPrint.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowQuestion.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowQuestion.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowSearch.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowSearch.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowForm.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowForm.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowFormObject.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowFormObject.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowFormModalBS.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowFormModalBS.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowMessage.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowTempMessage.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellHeadDOCProcessed.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellHeadDOCDate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/GridCellHeadDOCNumber.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/actb.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/actb.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/RepCommands.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/RepCommands.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewReport.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ViewReport.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/PopUpMenu.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/PopOver.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/PeriodSelect.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/PeriodSelect.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/WindowAbout.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/WindowAbout.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/MainMenuTree.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/MainMenuTree.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ConstantGrid.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/rs/ConstantGrid.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/Captcha.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ViewTemplate.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controls/ToolTip.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/ViewList_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/MainMenuConstructor_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/User_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/UserList_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/Bank_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/BankList_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/MailForSending_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/DepartmentDialog_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/EmployeeDialog_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/EmployeeList_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/DepartmentList_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/PostList_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/EmailTemplate_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/ShortMessage_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/UserCatalogMetadataDialog_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/UserCatalogDataDialog_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/DocTemplateDialog_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/DocumentDialog_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/EmployeeDialog_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/DocTemplateList_Form.js'));
		
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'forms/UserDialog_Form.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/Login_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/PasswordRecovery_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/Registration_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/MainMenuConstructorList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/MainMenuConstructor_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ViewList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserProfile_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/About_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/Bank_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/BankList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ConstantList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserDialog_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/TimeZoneLocale_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/MailForSendingList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/MailForSending_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/EmailTemplateList_View.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs/EmailTemplateList_View.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/EmailTemplate_View.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs/EmailTemplate_View.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ViewBankAcc.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/HolidayList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/DepartmentList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs/DepartmentList_View.rs_ru.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/DepartmentDialog_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs/DepartmentDialog_View.rs_ru.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/EmployeeList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs/EmployeeList_View.rs_ru.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/EmployeeDialog_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs/EmployeeDialog_View.rs_ru.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/PostList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ReminderList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/Reminder_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ProjectManager_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserCatalogMetadataDialog_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserCatalogMetadataList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserCatalogDataDialog_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/UserCatalogDataList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/DocTemplateList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/DocTemplateDialog_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/ContactList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/DocumentList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/DocumentDialog_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/DataTypeFieldAliasList_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'tmpl/App.templates.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/App.enums.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/App.predefinedItems.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/ErrorControl.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/AppLawTmpl.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/ButtonOrgSearch.js'));
		
	if (
	(isset($_SESSION['locale_id']) && $_SESSION['locale_id']=='ru')
	||
	(!isset($_SESSION['locale_id']) && DEF_LOCALE=='ru')
	){
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/rs/ButtonOrgSearch.rs_ru.js'));
	}

		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/ViewSectionSelect.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/ViewEditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserEdit.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserEditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserNameEdit.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserPwdEdit.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/rs/UserPwdEdit.rs_ru.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/Pagination.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/BankEditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EditBankAcc.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EditOGRN.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EditINN.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EditKPP.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/DepartmentSelect.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/DepartmentEditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EmployeeEditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EmployeeListGrid.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EditContactList.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EditContact.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/ShortMessage.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EditColorPalette.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserCatalogMetadataSelect.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/PermissionEditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/AccessPermissionGrid.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/DocAttrEventGrid.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/PostEditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/DocTemplateEditRef.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/DocTemplateFieldContainer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/CollectionFieldContainer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/FieldGroupContainer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/DocumentFieldValueContainer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/DocTemplateFieldEdit.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/CollectionFieldEdit.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/CollectionGrid.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/FieldGroupEdit.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/FieldGroup.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/DocumentFieldContainer.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EgrulSearchData_View.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/EgrulSearchDataEdit.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserCatalogFieldGrid.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'custom_controls/UserCatalogDataEdit.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs_ru.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'views/rs_common_ru.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Constant_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Enum_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/MainMenuConstructor_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/MainMenuContent_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/View_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/VariantStorage_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/About_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/TimeZoneLocale_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/User_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserProfile_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ConstantList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/View_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ViewList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ViewSectionList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MainMenuConstructor_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MainMenuConstructorList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MainMenuContent_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/VariantStorage_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/VariantStorageList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/About_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/Enum_locales.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/Enum_role_types.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/Enum_data_types.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Post_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Contact_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Department_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Employee_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Post_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Employee_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/EmployeeDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/EmployeeList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Department_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DepartmentDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DepartmentList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Contact_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/ShortMessageRecipientState_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/ShortMessage_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ShortMessageRecipientState_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ShortMessageRecipientCurrentState_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ShortMessage_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ShortMessageList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ShortMessageChat_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/RecipientPicture_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/ShortMessageRecipientList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Captcha_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/User_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/EmployeeLocalList_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Bank_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Bank_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/BankList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/EnumGridColumn_locales.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/EnumGridColumn_role_types.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/EnumGridColumn_data_types.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/UserCatalogMetadata_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserCatalogMetadata_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserCatalogMetadataList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserCatalogData_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/UserCatalogData_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserCatalogDataList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserCatalogField_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DocTemplate_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DocTemplateList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DocTemplateDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/DocTemplate_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/AccessPermission_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/AccessPermission_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/MailForSending_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/TimeZoneLocale_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Holiday_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/ProjectManager_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MailForSending_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MailForSendingList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MailForSendingAttachment_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Holiday_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/Enum_email_types.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'enum_controls/EnumGridColumn_email_types.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/DocTemplateField_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DocTemplateField_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/Document_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/Document_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DocumentList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DocumentDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/EgrulSearchData_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/EgrulSearchData_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/UserCatalogField_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/UserCatalogMetadataDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/EmployeeLocalList_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/DocAttrEvent_Controller.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DocAttrEvent_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/MainMenuConstructorDialog_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'models/DataTypeFieldAlias_Model.js'));
		$this->addJsModel(new ModelJavaScript(USER_JS_PATH.'controllers/DataTypeFieldAlias_Controller.js'));
	
			if (isset($_SESSION['scriptId'])){
				$script_id = $_SESSION['scriptId'];
			}
			else{
				$script_id = VERSION;
			}			
		}
		
		$this->getVarModel()->addField(new Field('role_id',DT_STRING));
		$this->getVarModel()->addField(new Field('user_name',DT_STRING));
		if (isset($_SESSION['role_id']) && $_SESSION['role_id']!='client'){
			$this->getVarModel()->addField(new Field('employees_ref',DT_STRING));
			$this->getVarModel()->addField(new Field('departments_ref',DT_STRING));
			$this->getVarModel()->addField(new Field('recipient_states_ref',DT_STRING));
		}
		if (isset($_SESSION['role_id'])){
			//$this->getVarModel()->addField(new Field('user_name_full',DT_STRING));
			//user attrs
			$this->getVarModel()->addField(new Field('color_palette',DT_STRING));
			
			if (defined('CUSTOM_APP_UPLOAD_SERVER')){
				$this->getVarModel()->addField(new Field('custom_app_upload_server',DT_STRING));
			}
		}
		
		
		$this->getVarModel()->insert();
		$this->setVarValue('scriptId',$script_id);
		
		//'http://'.$_SERVER['HTTP_HOST'].'/'.APP_NAME.'/'		
		$currentPath = $_SERVER['PHP_SELF'];
		$pathInfo = pathinfo($currentPath);
		$hostName = $_SERVER['HTTP_HOST'];
		$protocol = isset($_SERVER['HTTPS'])? 'https://':'http://';
		$dir = $protocol.$hostName.$pathInfo['dirname'];
		if (substr($dir,strlen($dir)-1,1)!='/'){
			$dir.='/';
		}
		$this->setVarValue('basePath', $dir);
		
		$this->setVarValue('version',trim(VERSION));
		$this->setVarValue('debug',DEBUG);
		if (isset($_SESSION['locale_id'])){
			$this->setVarValue('locale_id',$_SESSION['locale_id']);
		}
		else if (!isset($_SESSION['locale_id']) && defined('DEF_LOCALE')){
			$this->setVarValue('locale_id', DEF_LOCALE);
		}		
		
		if (isset($_SESSION['role_id'])){
			
			//user
			$this->setVarValue('color_palette',$_SESSION['color_palette']);
		
			$this->setVarValue('role_id',$_SESSION['role_id']);
			$this->setVarValue('user_name',$_SESSION['user_name']);
			//$this->setVarValue('user_name_full',$_SESSION['user_name_full']);
			$this->setVarValue('locale_id',$_SESSION['locale_id']);
			$this->setVarValue('curDate',round(microtime(true) * 1000));
			//$this->setVarValue('token',$_SESSION['token']);
			//$this->setVarValue('tokenr',$_SESSION['tokenr']);
			
			$this->setVarValue('employees_ref',$_SESSION['employees_ref']);
			$this->setVarValue('departments_ref',$_SESSION['departments_ref']);
			$this->setVarValue('recipient_states_ref',$_SESSION['recipient_states_ref']);
		}
		
		//Global Filters
						
	}
		
	
	public function write(ArrayObject &$models,$errorCode=NULL){
		$this->addMenu($models);
		
		
		$this->addConstants($models);
		
		//titles form Config
		$models->append(new ModelVars(
			array('name'=>'Page_Model',
				'sysModel'=>TRUE,
				'id'=>'Page_Model',
				'values'=>array(
					new Field('PAGE_TITLE',DT_STRING,array('value'=>PAGE_TITLE)),
					new Field('PAGE_HEAD_TITLE_GUEST',DT_STRING,array('value'=>PAGE_HEAD_TITLE_GUEST)),
					new Field('PAGE_HEAD_TITLE_USER',DT_STRING,array('value'=>PAGE_HEAD_TITLE_USER)),
					new Field('DEFAULT_COLOR_PALETTE',DT_STRING,array('value'=>DEFAULT_COLOR_PALETTE))					
				)
			)
		));
		
		parent::write($models,$errorCode);
	}	
}	
?>