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
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLEnum.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLPassword.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLBool.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelOrderSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLDateTimeTZ.php');
 
class User_Model extends ModelSQL{
	
	public function __construct($dbLink){
		parent::__construct($dbLink);
		
		$this->setDbName("public");
		
		$this->setTableName("users");
			
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
		$f_opts['length']=50;
		$f_opts['id']="name";
				
		$f_name=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"name",$f_opts);
		$this->addField($f_name);
		//********************
		
		//*** Field role_id ***
		$f_opts = array();
		$f_opts['id']="role_id";
				
		$f_role_id=new FieldSQLEnum($this->getDbLink(),$this->getDbName(),$this->getTableName(),"role_id",$f_opts);
		$this->addField($f_role_id);
		//********************
		
		//*** Field email ***
		$f_opts = array();
		$f_opts['length']=50;
		$f_opts['id']="email";
				
		$f_email=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"email",$f_opts);
		$this->addField($f_email);
		//********************
		
		//*** Field pwd ***
		$f_opts = array();
		$f_opts['length']=32;
		$f_opts['id']="pwd";
				
		$f_pwd=new FieldSQLPassword($this->getDbLink(),$this->getDbName(),$this->getTableName(),"pwd",$f_opts);
		$this->addField($f_pwd);
		//********************
		
		//*** Field create_dt ***
		$f_opts = array();
		
		$f_opts['alias']='Дата создания';
		$f_opts['id']="create_dt";
				
		$f_create_dt=new FieldSQLDateTimeTZ($this->getDbLink(),$this->getDbName(),$this->getTableName(),"create_dt",$f_opts);
		$this->addField($f_create_dt);
		//********************
		
		//*** Field email_confirmed ***
		$f_opts = array();
		
		$f_opts['alias']='Адрес электр.почты подтвержден';
		$f_opts['defaultValue']='FALSE';
		$f_opts['id']="email_confirmed";
				
		$f_email_confirmed=new FieldSQLBool($this->getDbLink(),$this->getDbName(),$this->getTableName(),"email_confirmed",$f_opts);
		$this->addField($f_email_confirmed);
		//********************
		
		//*** Field locale_id ***
		$f_opts = array();
		$f_opts['id']="locale_id";
				
		$f_locale_id=new FieldSQLEnum($this->getDbLink(),$this->getDbName(),$this->getTableName(),"locale_id",$f_opts);
		$this->addField($f_locale_id);
		//********************
		
		//*** Field color_palette ***
		$f_opts = array();
		
		$f_opts['alias']='Цветовая схема';
		$f_opts['id']="color_palette";
				
		$f_color_palette=new FieldSQLText($this->getDbLink(),$this->getDbName(),$this->getTableName(),"color_palette",$f_opts);
		$this->addField($f_color_palette);
		//********************
		
		//*** Field phone_cel ***
		$f_opts = array();
		$f_opts['length']=10;
		$f_opts['id']="phone_cel";
				
		$f_phone_cel=new FieldSQLString($this->getDbLink(),$this->getDbName(),$this->getTableName(),"phone_cel",$f_opts);
		$this->addField($f_phone_cel);
		//********************
		
		//*** Field time_zone_locale_id ***
		$f_opts = array();
		$f_opts['id']="time_zone_locale_id";
				
		$f_time_zone_locale_id=new FieldSQLInt($this->getDbLink(),$this->getDbName(),$this->getTableName(),"time_zone_locale_id",$f_opts);
		$this->addField($f_time_zone_locale_id);
		//********************
	
		$order = new ModelOrderSQL();		
		$this->setDefaultModelOrder($order);		
		$direct = 'ASC';
		$order->addField($f_name,$direct);
$this->setLimitConstant('doc_per_page_count');
	}

}
?>
