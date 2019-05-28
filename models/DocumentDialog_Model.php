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
 
class DocumentDialog_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("documents_dialog");
			
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
				
		$f_date_time=new FieldSQLDateTimeTZ($this->getDbLink(),$this->getDbName(),$this->getTableName(),"date_time",$f_opts);
		$this->addField($f_date_time);
		//********************
		
		//*** Field doc_number ***
		$f_opts = array();
		
		$f_opts['alias']='Номер';
		$f_opts['length']=15;
		$f_opts['id']="doc_number";
				
		$f_doc_number=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"doc_number",$f_opts);
		$this->addField($f_doc_number);
		//********************
		
		//*** Field employees_ref ***
		$f_opts = array();
		$f_opts['id']="employees_ref";
				
		$f_employees_ref=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"employees_ref",$f_opts);
		$this->addField($f_employees_ref);
		//********************
		
		//*** Field comment_text ***
		$f_opts = array();
		$f_opts['id']="comment_text";
				
		$f_comment_text=new FieldSQLText($this->getDbLink(),$this->getDbName(),$this->getTableName(),"comment_text",$f_opts);
		$this->addField($f_comment_text);
		//********************
		
		//*** Field doc_templates_ref ***
		$f_opts = array();
		$f_opts['id']="doc_templates_ref";
				
		$f_doc_templates_ref=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"doc_templates_ref",$f_opts);
		$this->addField($f_doc_templates_ref);
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
		
		//*** Field permissions ***
		$f_opts = array();
		$f_opts['id']="permissions";
				
		$f_permissions=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"permissions",$f_opts);
		$this->addField($f_permissions);
		//********************
		
		//*** Field permission_ar ***
		$f_opts = array();
		$f_opts['id']="permission_ar";
				
		$f_permission_ar=new FieldSQLText($this->getDbLink(),$this->getDbName(),$this->getTableName(),"permission_ar",$f_opts);
		$this->addField($f_permission_ar);
		//********************
		
		//*** Field for_all_employees ***
		$f_opts = array();
		$f_opts['id']="for_all_employees";
				
		$f_for_all_employees=new FieldSQLBool($this->getDbLink(),$this->getDbName(),$this->getTableName(),"for_all_employees",$f_opts);
		$this->addField($f_for_all_employees);
		//********************
		
		//*** Field tmpl_permissions ***
		$f_opts = array();
		$f_opts['id']="tmpl_permissions";
				
		$f_tmpl_permissions=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"tmpl_permissions",$f_opts);
		$this->addField($f_tmpl_permissions);
		//********************
		
		//*** Field tmpl_for_all_employees ***
		$f_opts = array();
		$f_opts['id']="tmpl_for_all_employees";
				
		$f_tmpl_for_all_employees=new FieldSQLBool($this->getDbLink(),$this->getDbName(),$this->getTableName(),"tmpl_for_all_employees",$f_opts);
		$this->addField($f_tmpl_for_all_employees);
		//********************
		
		//*** Field document_data_exists ***
		$f_opts = array();
		$f_opts['id']="document_data_exists";
				
		$f_document_data_exists=new FieldSQLBool($this->getDbLink(),$this->getDbName(),$this->getTableName(),"document_data_exists",$f_opts);
		$this->addField($f_document_data_exists);
		//********************
		
		//*** Field document_gen_date ***
		$f_opts = array();
		$f_opts['id']="document_gen_date";
				
		$f_document_gen_date=new FieldSQLDateTimeTZ($this->getDbLink(),$this->getDbName(),$this->getTableName(),"document_gen_date",$f_opts);
		$this->addField($f_document_gen_date);
		//********************
		
		//*** Field document_gen_employees_ref ***
		$f_opts = array();
		$f_opts['id']="document_gen_employees_ref";
				
		$f_document_gen_employees_ref=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"document_gen_employees_ref",$f_opts);
		$this->addField($f_document_gen_employees_ref);
		//********************
	$this->setLimitConstant('doc_per_page_count');
	}

}
?>
