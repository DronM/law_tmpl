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
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLJSON.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLJSONB.php');
 
class DocTemplateDialog_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("doc_templates_dialog");
			
		//*** Field id ***
		$f_opts = array();
		$f_opts['primaryKey'] = TRUE;
		$f_opts['autoInc']=TRUE;
		$f_opts['id']="id";
						
		$f_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"id",$f_opts);
		$this->addField($f_id);
		//********************
		
		//*** Field name ***
		$f_opts = array();
		
		$f_opts['alias']='Наименование';
		$f_opts['length']=100;
		$f_opts['id']="name";
						
		$f_name=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"name",$f_opts);
		$this->addField($f_name);
		//********************
		
		//*** Field comment_text ***
		$f_opts = array();
		
		$f_opts['alias']='Комментарий';
		$f_opts['id']="comment_text";
						
		$f_comment_text=new FieldSQLText($this->getDbLink(),$this->getDbName(),$this->getTableName(),"comment_text",$f_opts);
		$this->addField($f_comment_text);
		//********************
		
		//*** Field employees_ref ***
		$f_opts = array();
		$f_opts['id']="employees_ref";
		$f_opts['noValueOnCopy'] = TRUE;
						
		$f_employees_ref=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"employees_ref",$f_opts);
		$this->addField($f_employees_ref);
		//********************
		
		//*** Field permissions ***
		$f_opts = array();
		$f_opts['id']="permissions";
						
		$f_permissions=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"permissions",$f_opts);
		$this->addField($f_permissions);
		//********************
		
		//*** Field fields ***
		$f_opts = array();
		$f_opts['id']="fields";
						
		$f_fields=new FieldSQLJSON($this->getDbLink(),$this->getDbName(),$this->getTableName(),"fields",$f_opts);
		$this->addField($f_fields);
		//********************
		
		//*** Field for_all_employees ***
		$f_opts = array();
		$f_opts['defaultValue']='FALSE';
		$f_opts['id']="for_all_employees";
						
		$f_for_all_employees=new FieldSQLBool($this->getDbLink(),$this->getDbName(),$this->getTableName(),"for_all_employees",$f_opts);
		$this->addField($f_for_all_employees);
		//********************
		
		//*** Field document_prefix ***
		$f_opts = array();
		$f_opts['length']=10;
		$f_opts['id']="document_prefix";
		$f_opts['noValueOnCopy'] = TRUE;
						
		$f_document_prefix=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"document_prefix",$f_opts);
		$this->addField($f_document_prefix);
		//********************
		
		//*** Field template_file ***
		$f_opts = array();
		$f_opts['id']="template_file";
		$f_opts['noValueOnCopy'] = TRUE;
						
		$f_template_file=new FieldSQLJSONB($this->getDbLink(),$this->getDbName(),$this->getTableName(),"template_file",$f_opts);
		$this->addField($f_template_file);
		//********************
		
		//*** Field user_functions ***
		$f_opts = array();
		$f_opts['id']="user_functions";
						
		$f_user_functions=new FieldSQLText($this->getDbLink(),$this->getDbName(),$this->getTableName(),"user_functions",$f_opts);
		$this->addField($f_user_functions);
		//********************
	$this->setLimitConstant('doc_per_page_count');
	}

}
?>
