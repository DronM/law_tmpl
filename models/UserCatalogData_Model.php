<?php
/**
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/models/Model_php.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 *
 */

require_once(FRAME_WORK_PATH.'basic_classes/ModelSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLInt.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLJSONB.php');
 
class UserCatalogData_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("user_catalog_data");
			
		//*** Field id ***
		$f_opts = array();
		$f_opts['primaryKey'] = TRUE;
		$f_opts['autoInc']=TRUE;
		$f_opts['id']="id";
				
		$f_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"id",$f_opts);
		$this->addField($f_id);
		//********************
		
		//*** Field user_catalog_metadata_id ***
		$f_opts = array();
		$f_opts['id']="user_catalog_metadata_id";
				
		$f_user_catalog_metadata_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"user_catalog_metadata_id",$f_opts);
		$this->addField($f_user_catalog_metadata_id);
		//********************
		
		//*** Field field_values ***
		$f_opts = array();
		$f_opts['id']="field_values";
				
		$f_field_values=new FieldSQLJSONB($this->getDbLink(),$this->getDbName(),$this->getTableName(),"field_values",$f_opts);
		$this->addField($f_field_values);
		//********************
	$this->setLimitConstant('doc_per_page_count');
	}

}
?>
