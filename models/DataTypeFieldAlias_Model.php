<?php
/**
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/models/Model_php.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 *
 */

require_once(FRAME_WORK_PATH.'basic_classes/ModelSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLString.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLEnum.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelOrderSQL.php');
 
class DataTypeFieldAlias_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("data_type_field_aliases");
			
		//*** Field data_type ***
		$f_opts = array();
		$f_opts['primaryKey'] = TRUE;
		$f_opts['id']="data_type";
				
		$f_data_type=new FieldSQLEnum($this->getDbLink(),$this->getDbName(),$this->getTableName(),"data_type",$f_opts);
		$this->addField($f_data_type);
		//********************
		
		//*** Field field ***
		$f_opts = array();
		$f_opts['primaryKey'] = TRUE;
		$f_opts['length']=100;
		$f_opts['id']="field";
				
		$f_field=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"field",$f_opts);
		$this->addField($f_field);
		//********************
		
		//*** Field alias ***
		$f_opts = array();
		$f_opts['length']=100;
		$f_opts['id']="alias";
				
		$f_alias=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"alias",$f_opts);
		$this->addField($f_alias);
		//********************
	
		$order = new ModelOrderSQL();		
		$this->setDefaultModelOrder($order);		
		$direct = 'ASC';
		$order->addField($f_data_type,$direct);
$direct = 'ASC';
		$order->addField($f_alias,$direct);
$this->setLimitConstant('doc_per_page_count');
	}

}
?>
