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
 
class UserDialog_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("users_view");
			
		//*** Field id ***
		$f_opts = array();
		$f_opts['primaryKey'] = TRUE;
		
		$f_opts['alias']='Код';
		$f_opts['id']="id";
						
		$f_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"id",$f_opts);
		$this->addField($f_id);
		//********************
		
		//*** Field name ***
		$f_opts = array();
		
		$f_opts['alias']='Имя';
		$f_opts['id']="name";
						
		$f_name=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"name",$f_opts);
		$this->addField($f_name);
		//********************
		
		//*** Field name_full ***
		$f_opts = array();
		$f_opts['length']=250;
		$f_opts['id']="name_full";
						
		$f_name_full=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"name_full",$f_opts);
		$this->addField($f_name_full);
		//********************
		
		//*** Field banned ***
		$f_opts = array();
		$f_opts['id']="banned";
						
		$f_banned=new FieldSQLBool($this->getDbLink(),$this->getDbName(),$this->getTableName(),"banned",$f_opts);
		$this->addField($f_banned);
		//********************
		
		//*** Field email ***
		$f_opts = array();
		
		$f_opts['alias']='Эл.почта';
		$f_opts['id']="email";
						
		$f_email=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"email",$f_opts);
		$this->addField($f_email);
		//********************
		
		//*** Field role_descr ***
		$f_opts = array();
		
		$f_opts['alias']='Роль';
		$f_opts['id']="role_descr";
						
		$f_role_descr=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"role_descr",$f_opts);
		$this->addField($f_role_descr);
		//********************
		
		//*** Field role_id ***
		$f_opts = array();
		$f_opts['id']="role_id";
						
		$f_role_id=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"role_id",$f_opts);
		$this->addField($f_role_id);
		//********************
		
		//*** Field time_zone_locale_id ***
		$f_opts = array();
		$f_opts['id']="time_zone_locale_id";
						
		$f_time_zone_locale_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"time_zone_locale_id",$f_opts);
		$this->addField($f_time_zone_locale_id);
		//********************
		
		//*** Field time_zone_locale_descr ***
		$f_opts = array();
		$f_opts['id']="time_zone_locale_descr";
						
		$f_time_zone_locale_descr=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"time_zone_locale_descr",$f_opts);
		$this->addField($f_time_zone_locale_descr);
		//********************
		
		//*** Field phone_cel ***
		$f_opts = array();
		
		$f_opts['alias']='Моб.телефон';
		$f_opts['length']=11;
		$f_opts['id']="phone_cel";
						
		$f_phone_cel=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"phone_cel",$f_opts);
		$this->addField($f_phone_cel);
		//********************
		
		//*** Field color_palette ***
		$f_opts = array();
		
		$f_opts['alias']='Цветовая схема';
		$f_opts['id']="color_palette";
						
		$f_color_palette=new FieldSQLText($this->getDbLink(),$this->getDbName(),$this->getTableName(),"color_palette",$f_opts);
		$this->addField($f_color_palette);
		//********************
		
		//*** Field reminders_to_email ***
		$f_opts = array();
		$f_opts['id']="reminders_to_email";
						
		$f_reminders_to_email=new FieldSQLBool($this->getDbLink(),$this->getDbName(),$this->getTableName(),"reminders_to_email",$f_opts);
		$this->addField($f_reminders_to_email);
		//********************
	$this->setLimitConstant('doc_per_page_count');
	}

}
?>
