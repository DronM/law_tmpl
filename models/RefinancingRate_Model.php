<?php
/**
 *
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/models/Model_php.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 *
 */

require_once(FRAME_WORK_PATH.'basic_classes/ModelSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLFloat.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLDate.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelOrderSQL.php');
 
class RefinancingRate_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("refinancing_rates");
			
		//*** Field set_date ***
		$f_opts = array();
		$f_opts['primaryKey'] = TRUE;
		$f_opts['id']="set_date";
						
		$f_set_date=new FieldSQLDate($this->getDbLink(),$this->getDbName(),$this->getTableName(),"set_date",$f_opts);
		$this->addField($f_set_date);
		//********************
		
		//*** Field rate ***
		$f_opts = array();
		$f_opts['length']=5;
		$f_opts['id']="rate";
						
		$f_rate=new FieldSQLFloat($this->getDbLink(),$this->getDbName(),$this->getTableName(),"rate",$f_opts);
		$this->addField($f_rate);
		//********************
	
		$order = new ModelOrderSQL();		
		$this->setDefaultModelOrder($order);		
		$direct = 'DESC';
		$order->addField($f_set_date,$direct);
$this->setLimitConstant('doc_per_page_count');
	}

}
?>
