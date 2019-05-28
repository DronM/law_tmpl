<?php
/**
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/models/Model_php.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 *
 */

require_once(FRAME_WORK_PATH.'basic_classes/ModelSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLInt.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLString.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLText.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLDateTimeTZ.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLJSON.php');
 
class EgrulSearchData_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("egrul_search_data");
			
		//*** Field inn ***
		$f_opts = array();
		$f_opts['primaryKey'] = TRUE;
		$f_opts['length']=12;
		$f_opts['id']="inn";
				
		$f_inn=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"inn",$f_opts);
		$this->addField($f_inn);
		//********************
		
		//*** Field ogrn ***
		$f_opts = array();
		$f_opts['length']=15;
		$f_opts['id']="ogrn";
				
		$f_ogrn=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"ogrn",$f_opts);
		$this->addField($f_ogrn);
		//********************
		
		//*** Field name ***
		$f_opts = array();
		$f_opts['id']="name";
				
		$f_name=new FieldSQLText($this->getDbLink(),$this->getDbName(),$this->getTableName(),"name",$f_opts);
		$this->addField($f_name);
		//********************
		
		//*** Field data ***
		$f_opts = array();
		$f_opts['id']="data";
				
		$f_data=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"data",$f_opts);
		$this->addField($f_data);
		//********************
		
		//*** Field user_id ***
		$f_opts = array();
		$f_opts['id']="user_id";
				
		$f_user_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"user_id",$f_opts);
		$this->addField($f_user_id);
		//********************
		
		//*** Field create_dt ***
		$f_opts = array();
		$f_opts['defaultValue']='current_timestamp';
		$f_opts['id']="create_dt";
				
		$f_create_dt=new FieldSQLDateTimeTZ($this->getDbLink(),$this->getDbName(),$this->getTableName(),"create_dt",$f_opts);
		$this->addField($f_create_dt);
		//********************
		
		//*** Field update_dt ***
		$f_opts = array();
		$f_opts['id']="update_dt";
				
		$f_update_dt=new FieldSQLDateTimeTZ($this->getDbLink(),$this->getDbName(),$this->getTableName(),"update_dt",$f_opts);
		$this->addField($f_update_dt);
		//********************
		
		//*** Field update_count ***
		$f_opts = array();
		$f_opts['defaultValue']='0';
		$f_opts['id']="update_count";
				
		$f_update_count=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"update_count",$f_opts);
		$this->addField($f_update_count);
		//********************
	$this->setLimitConstant('doc_per_page_count');
	}

}
?>
