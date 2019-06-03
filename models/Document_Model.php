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
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLBool.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLDateTimeTZ.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLJSON.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLJSONB.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLArray.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLBytea.php');
 
class Document_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("documents");
			
		//*** Field id ***
		$f_opts = array();
		$f_opts['primaryKey'] = TRUE;
		$f_opts['autoInc']=TRUE;
		$f_opts['id']="id";
						
		$f_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"id",$f_opts);
		$this->addField($f_id);
		//********************
		
		//*** Field date_time ***
		$f_opts = array();
		$f_opts['id']="date_time";
		$f_opts['retAfterInsert']=TRUE;
						
		$f_date_time=new FieldSQLDateTimeTZ($this->getDbLink(),$this->getDbName(),$this->getTableName(),"date_time",$f_opts);
		$this->addField($f_date_time);
		//********************
		
		//*** Field employee_id ***
		$f_opts = array();
		$f_opts['id']="employee_id";
						
		$f_employee_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"employee_id",$f_opts);
		$this->addField($f_employee_id);
		//********************
		
		//*** Field comment_text ***
		$f_opts = array();
		
		$f_opts['alias']='Комментарий';
		$f_opts['id']="comment_text";
						
		$f_comment_text=new FieldSQLText($this->getDbLink(),$this->getDbName(),$this->getTableName(),"comment_text",$f_opts);
		$this->addField($f_comment_text);
		//********************
		
		//*** Field doc_template_id ***
		$f_opts = array();
		$f_opts['id']="doc_template_id";
						
		$f_doc_template_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"doc_template_id",$f_opts);
		$this->addField($f_doc_template_id);
		//********************
		
		//*** Field field_values ***
		$f_opts = array();
		$f_opts['id']="field_values";
						
		$f_field_values=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"field_values",$f_opts);
		$this->addField($f_field_values);
		//********************
		
		//*** Field doc_number ***
		$f_opts = array();
		
		$f_opts['alias']='Номер';
		$f_opts['length']=20;
		$f_opts['id']="doc_number";
		$f_opts['retAfterInsert']=TRUE;
						
		$f_doc_number=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"doc_number",$f_opts);
		$this->addField($f_doc_number);
		//********************
		
		//*** Field document_data ***
		$f_opts = array();
		$f_opts['id']="document_data";
						
		$f_document_data=new FieldSQLBytea($this->getDbLink(),$this->getDbName(),$this->getTableName(),"document_data",$f_opts);
		$this->addField($f_document_data);
		//********************
		
		//*** Field permissions ***
		$f_opts = array();
		$f_opts['id']="permissions";
						
		$f_permissions=new FieldSQLJSONB($this->getDbLink(),$this->getDbName(),$this->getTableName(),"permissions",$f_opts);
		$this->addField($f_permissions);
		//********************
		
		//*** Field permission_ar ***
		$f_opts = array();
		$f_opts['id']="permission_ar";
						
		$f_permission_ar=new FieldSQLArray($this->getDbLink(),$this->getDbName(),$this->getTableName(),"permission_ar",$f_opts);
		$this->addField($f_permission_ar);
		//********************
		
		//*** Field for_all_employees ***
		$f_opts = array();
		$f_opts['defaultValue']='FALSE';
		$f_opts['id']="for_all_employees";
						
		$f_for_all_employees=new FieldSQLBool($this->getDbLink(),$this->getDbName(),$this->getTableName(),"for_all_employees",$f_opts);
		$this->addField($f_for_all_employees);
		//********************
		
		//*** Field document_gen_date ***
		$f_opts = array();
		$f_opts['id']="document_gen_date";
						
		$f_document_gen_date=new FieldSQLDateTimeTZ($this->getDbLink(),$this->getDbName(),$this->getTableName(),"document_gen_date",$f_opts);
		$this->addField($f_document_gen_date);
		//********************
		
		//*** Field document_gen_employee_id ***
		$f_opts = array();
		$f_opts['id']="document_gen_employee_id";
						
		$f_document_gen_employee_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"document_gen_employee_id",$f_opts);
		$this->addField($f_document_gen_employee_id);
		//********************
	$this->setLimitConstant('doc_per_page_count');
	}

}
?>
