<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:import href="Controller_php.xsl"/>

<!-- -->
<xsl:variable name="CONTROLLER_ID" select="'Document'"/>
<!-- -->

<xsl:output method="text" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
			
<xsl:template match="/">
	<xsl:apply-templates select="metadata/controllers/controller[@id=$CONTROLLER_ID]"/>
</xsl:template>

<xsl:template match="controller"><![CDATA[<?php]]>
<xsl:call-template name="add_requirements"/>

require_once('common/downloader.php');

require_once(USER_CONTROLLERS_PATH.'Employee_Controller.php');
require_once(USER_CONTROLLERS_PATH.'DocTemplate_Controller.php');
require_once(FRAME_WORK_PATH.'basic_classes/ModelVars.php');

//ShortName() user function
require_once('common/short_name.php');

use mustache\Mustache\Engine;
include ABSOLUTE_PATH.'vendor/autoload.php';


class <xsl:value-of select="@id"/>_Controller extends <xsl:value-of select="@parentId"/>{

	const ER_CANT_CHANGE_EMPL = 'Запрещено менять автора документа!';
	const ER_CANT_DELETE = 'Запрещено удалять чужой документ!';
	const ER_NO_DOC = 'Документ не найден!';
	const ER_NOT_ALLOWED = 'Запрещено открывать документ!';
	const ER_NO_FILE = 'Файл шаблона отсутствует!';

	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);<xsl:apply-templates/>
	}	
	<xsl:call-template name="extra_methods"/>
}
<![CDATA[?>]]>
</xsl:template>

<xsl:template name="extra_methods">

	private static function get_data_file_name($id){
		return OUTPUT_PATH.'doc_'.$id;
	}
	
	private static function delete_data_file($id){
		if(file_exists($fl = self::get_data_file_name($id))){
			unlink($fl);
		}
	}
	
	public function insert($pm){
		if ($_SESSION['role_id']!='admin' || ($_SESSION['role_id']=='admin' &amp;&amp; !$pm->getParamValue('employee_id')) ){
			$ref = json_decode($_SESSION['employees_ref']);
			if ($ref){
				$pm->setParamValue('employee_id',$ref->keys->id);
			}
		}
		$pm->setParamValue('document_data','NULL');
		$ids = parent::insert($pm);
		
		self::delete_data_file($ids['id']);
		
		return $ids;
	}

	public function update($pm){
		
		if ($_SESSION['role_id']!='admin' &amp;&amp; $pm->getParamValue('employee_id')){
			throw new Exception(self::ER_CANT_CHANGE_EMPL);
		}
		$pm->setParamValue('document_data','NULL');		
		parent::update($pm);
		
		self::delete_data_file($pm->getParamValue('old_id'));
	}

	public function delete($pm){
		$ar = $this->getDbLink()->query_first(sprintf(
			"SELECT
				employee_id
			FROM documents
			WHERE id=%d",
		$this->getExtDbVal($pm,'id')
		));
		
		if (!count($ar)){
			throw new Exception(self::ER_NO_DOC);
		}
		
		$ref = json_decode($_SESSION['employees_ref']);
		if ($_SESSION['role_id']!='admin' &amp;&amp; $ar['employee_id']!=$ref->keys->id ){
			throw new Exception(self::ER_CANT_DELETE);
		}
		
		self::delete_data_file($this->getExtDbVal($pm,'id'));
		
		parent::delete($pm);
	}

	public function get_list($pm){
		if ($_SESSION['role_id']=='admin'){
			parent::get_list($pm);
		}
		else{
			//permissions
			$list_model = $this->getListModelId();
			$model = new $list_model($this->getDbLink());
			
			$where = $this->conditionFromParams($pm,$model);
			if (!$where){
				$where = new ModelWhereSQL();
			}
			Employee_Controller::set_employee_id($this->getDbLink());
			$where->addExpression('permission_ar',
				sprintf(
				"(for_all_employees
				employee_id=%d OR 'employees%s' =ANY (permission_ar) OR 'departments%d' =ANY (permission_ar)
				)",
				$_SESSION['global_employee_id'],
				$_SESSION['global_employee_id'],
				$_SESSION['global_department_id']
				)
			);
			
			$from = null; $count = null;
			$limit = $this->limitFromParams($pm,$from,$count);
			$calc_total = ($count>0);
			if ($from){
				$model->setListFrom($from);
			}
			if ($count){
				$model->setRowsPerPage($count);
			}		
			$order = $this->orderFromParams($pm,$model);
			$fields = $this->fieldsFromParams($pm);		
			$model->select(FALSE,$where,$order,
				$limit,$fields,NULL,NULL,
				$calc_total,TRUE
			);
			$this->addModel($model);
		}
	}

	public function get_object($pm){
		
		$model_name = $this->getObjectModelId();
		$object_model = new $model_name($this->getDbLink());
		$this->modelGetObject($object_model,$pm,FALSE);	
		
		$tmpl_id = 0;
		$dlg_m = $this->getModelById("DocumentDialog_Model");
		$dlg_m->setRowBOF();
		if($dlg_m->getNextRow()){
		
			//template data
			$tmpl_id = $dlg_m->getFieldById("doc_template_id")->getValue();
			if ($tmpl_id){
				$this->addNewModel(sprintf("SELECT * FROM doc_templates_dialog WHERE id=%d",$tmpl_id),'DocTemplateDialog_Model');
			}
			
			//permissions
			if ($dlg_m->getFieldById("for_all_employees")->getValue()=="f"){
			
				//not for all
				$permitted = FALSE;
			
				$employees_ref = json_decode($dlg_m->getFieldById("employees_ref")->getValue());
				if($employees_ref&amp;&amp;isset($employees_ref->keys)){
					$permitted = ($employees_ref->keys->id==$_SESSION['global_employee_id']);
				}
				if(!$permitted){
					Employee_Controller::set_employee_id($this->getDbLink());
					$empl_filter = 'employees'.$_SESSION['global_employee_id'];
					$dep_filter = 'departments'.$_SESSION['department_id'];
				
					$s = $dlg_m->getFieldById("permission_ar")->getValue();
					$permission_ar = explode(',',substr($s,1,strlen($s)-2));
					foreach($permission_ar as $v){
						if($v==$empl_filter || $v==$dep_filter){
							$permitted = TRUE;
							break;
						}
					}
				}
				if(!$permitted){
					throw new Exception(self::ER_NOT_ALLOWED);
				}
			}
		}		
	}
	
	private static function handle_tables(&amp;$data,&amp;$content){
		function HandleXmlError($errno, $errstr, $errfile, $errline){
			return TRUE;
		}

		function find_node(&amp;$xml,&amp;$cont,$paramName){
			$xpath = new DOMXPath($xml);
			$node_l = $xpath->query("//*[text()='".$paramName."']");

			if(isset($node_l) &amp;&amp; $node_l->length>0){
				$node = $node_l->item(0);
				while($node->parentNode!==$cont){
					$node = $node->parentNode;
				}
				return $node;
			}	
		}
					
		$xml = NULL;
		$repl_tags = [];
		foreach($data as $par=>$val){
			if(!is_array($val))continue;
			
			//parsing content
			if(is_null($xml)){
				set_error_handler('HandleXmlError');
				$xml = new DOMDocument('1.0', 'utf-8');
				$xml->loadXML($content);
				restore_error_handler();

				$root = $xml->firstChild;
				$cont = NULL;
				for($i=0;$i&lt;$root->childNodes->length;$i++){
					if($root->childNodes->item($i)->nodeName=='office:body'){
						for($k=0;$k&lt;$root->childNodes->item($i)->childNodes->length;$k++){			
							if($root->childNodes->item($i)->childNodes->item($k)->nodeName=='office:text'){
								$cont = $root->childNodes->item($i)->childNodes->item($k);
								break;
							}
						}
						break;
					}
				}
				if(is_null($cont)){
					throw new Exception("Ошибка разбора содержимого XML: тэг 'office:text' не найдне!");
				}			
			}
			
			$n_s = find_node($xml,$cont,'{{#'.$par.'}}');
			if(!isset($n_s)){
				continue;//no parameter!
			}
			$n_e = find_node($xml,$cont,'{{/'.$par.'}}');
			if(!isset($n_e)){
				throw new Exception("Ошибка разбора содержимого XML: не найдено окончание параметра '".$par."'!");
			}
			$table_s = $n_s->nextSibling; 
			while($table_s->nodeName!='table:table'){
				$table_s = $table_s->nextSibling;
			}
			if($table_s->nodeName!='table:table'){
				throw new Exception("Ошибка разбора содержимого XML: не найдена таблица после параметра '".$par."'!");
			}

			$table_t = $n_s->previousSibling; 
			while($table_t->nodeName!='table:table'){
				$table_t = $table_t->previousSibling;
			}
			if($table_t->nodeName!='table:table'){
				throw new Exception("Ошибка разбора содержимого XML: не найдена таблица перед параметром '".$par."'!");
			}
		
			array_push($repl_tags,$par);

			//target table modification
			$table_t->appendChild($xml->createElement( "patReplaceTag", '{{#'.$par.'}}' ));//start tag

			$table_name = $table_t->getAttribute('table:style-name');
			for($i=0;$i&lt;$table_s->childNodes->length;$i++){
				if($table_s->childNodes->item($i)->nodeName=='table:table-row'){			
					$row = $table_s->childNodes->item($i);
					
					// leave styles as is
					/*
					for($k=0;$k&lt;$row->childNodes->length;$k++){
						if($row->childNodes->item($k)->nodeName=='table:table-cell'){
							$row->childNodes->item($k)->removeAttribute('table:style-name');
						}
					}
					*/
					$table_t->appendChild($row);
				}
			}
			$table_t->appendChild($xml->createElement( "patReplaceTag", '{{/'.$par.'}}' ));//end tag

			$table_s->parentNode->removeChild($table_s);
			$n_s->parentNode->removeChild($n_s);
			$n_e->parentNode->removeChild($n_e);
		}
		
		//no xml encode string!
		//$content = preg_replace('/^.+\n/', '', $xml->saveXML());//first line
		
		if(!is_null($xml)){
			$content = $xml->saveXML();//first line
			foreach($repl_tags as $t){
				$content = str_replace('&lt;patReplaceTag>{{#'.$t.'}}&lt;/patReplaceTag>','{{#'.$t.'}}',$content);
				$content = str_replace('&lt;patReplaceTag>{{/'.$t.'}}&lt;/patReplaceTag>','{{/'.$t.'}}',$content);
			}			
		}
	}
	
	/**
	 * Обработка OpenOffice шаблона через ZipArchive
	 * @param {string} tmpFile template file 
	 * @param {array} data asociative array of filed=value
	 * @param {string} outFile output file
	 * @param {bool} checkOnly no file generation,just validity check
	 */
	public static function render($tmpFile,&amp;$data,$outFile,$checkOnly){
		$CONTENT_NAME = 'content.xml';
		
		//Создание копии для исходного файла
		copy($tmpFile,$outFile);
		try{
			//Открываем архиватором
			$zip = new ZipArchive();
			$res = $zip->open($outFile);
			if ($res===TRUE) {
					
				$unzipped = OUTPUT_PATH.uniqid().'_'.$CONTENT_NAME;
				$tmp_data = $zip->getFromName($CONTENT_NAME);
				if($tmp_data===FALSE) {
					throw new Exception('Content not found in archive!');
				}
				
				//Checking
				/*
				$matches = NULL;
				preg_match_all('/{{([\d\D]*&lt;[\d\D]+?)}}/s',$tmp_data,$matches);
				if(count($matches)&amp;&amp;count($matches[0])){
					throw new Exception('Тэги между параметрами: '.$matches[0][0]);
				}				
				*/
				
				//!!! user functions !!!
				
				//ShortName()
				preg_match_all('/{{ShortName\((.*)\)}}/',$tmp_data,$matches);
				if(is_array($matches) &amp;&amp; count($matches)>=2){
					foreach($matches[1] as $v){
						$sch = 'ShortName('.$v.')';
						$k = md5($sch);
						if(!isset($data[$k])){
							$obj_ar = explode('.',$v);
							$obj = &amp;$data;
							foreach($obj_ar as $vr){
								$obj = &amp;$obj[$vr];
							}
							$data[$k] = get_short_name($obj);
							$tmp_data = str_replace($sch,$k,$tmp_data);
						}
					}
				}
				
				//tables
				self::handle_tables($data,$tmp_data);
				
				if(DEBUG){
					file_put_contents(OUTPUT_PATH.'last_data.xml',var_export($data,TRUE));
					file_put_contents(OUTPUT_PATH.'last_content_before.xml',$tmp_data);
				}			
				
				if(!$checkOnly){
					$zip->deleteName($CONTENT_NAME);
				
					$mustache = new Mustache_Engine;				
					$tmp_data = $mustache->render($tmp_data,$data);
								
					file_put_contents($unzipped, $tmp_data);
				
					try{
						$zip->addFile($unzipped, $CONTENT_NAME);        
						$zip->close();	
					}
					finally{
						unlink($unzipped);
					}			
				}
				
				if(DEBUG){				
					file_put_contents(OUTPUT_PATH.'last_content_after.xml',$tmp_data);
				}
				
			}
			else{
				throw new Exception('Error opening file as archive, code:'.$res);
			}
		}
		catch(Exception $e){
			unlink($outFile);
			throw $e;
		}
		
	}
	
	public function process($pm){
		
		Employee_Controller::set_employee_id($this->getDbLink());
		
		$data_fl_ex = file_exists($data_fl = self::get_data_file_name($this->getExtDbVal($pm,'doc_id')));
		
		$ar = $this->getDbLink()->query_first(sprintf(
			"SELECT
				d.doc_number,
				CASE
					WHEN d.for_all_employees THEN TRUE
					ELSE d.employee_id=%d OR 'employees'||%d =ANY(d.permission_ar) OR 'departments'||%d =ANY(d.permission_ar)
				END AS permitted,
				CASE
					WHEN dt.for_all_employees THEN TRUE
					ELSE dt.employee_id=%d OR 'employees'||%d =ANY(dt.permission_ar) OR 'departments'||%d =ANY(dt.permission_ar)
				END AS templ_permitted,				
				dt.template_file,
				dt.id AS template_id
				%s
			FROM documents AS d
			LEFT JOIN doc_templates AS dt ON dt.id=d.doc_template_id
			WHERE d.id=%d",
			
		$_SESSION['global_employee_id'],
		$_SESSION['global_employee_id'],
		$_SESSION['department_id'],		
		$_SESSION['global_employee_id'],
		$_SESSION['global_employee_id'],		
		$_SESSION['department_id'],
		(($data_fl_ex)? '':',d.document_data'),			
		$this->getExtDbVal($pm,'doc_id')
		));
	
		if (!count($ar)){
			throw new Exception(self::ER_NO_DOC);
		}
		if ($ar['permitted']!='t'||$ar['templ_permitted']!='t'){
			throw new Exception(self::ER_NOT_ALLOWED);
		}
		
		$templateFile = json_decode($ar['template_file']);
				
		if(!$data_fl_ex &amp;&amp; !isset($ar['document_data'])){
					
			if(!$templateFile || !count($templateFile) || !isset($templateFile[0]->id)){
				throw new Exception(self::ER_NO_FILE);
			}
		
			$tmp_file = DocTemplate_Controller::template_path($templateFile[0]->id);
			if(!file_exists($tmp_file)){
				$ar_t = $this->getDbLink()->query_first(sprintf(
				'SELECT
					template_data
				FROM doc_templates
				WHERE id=%d',
				$ar['template_id']
				));	
				file_put_contents($tmp_file,pg_unescape_bytea($ar_t['template_data']));
			}
		
			//parameters
			$data = json_decode($this->getExtVal($pm,'field_values'),TRUE);
			/**
			 * Надо подготовить данные: если в составе есть RefType (это структура и есть ключ dataType), то
			 *	- Перебрать все данные рекурсивно
			 * 	- Вытащить соответствия полей (data_type_field_aliases с ключом data_type) 
			 *	- Сделать запрос к данным по ключу(keys{name:value}) и вытащить все возможные поля, т.к. в шаблоне
			 *		может быть любое поле из типа
			 *	- Все это как-то кэшить, на случай если dataType и ключ повторяется
			 */
			$types_cache = [];
			foreach($data as $k=>$v){
				if ( is_array($v) &amp;&amp; isset($v['dataType']) ){
					//generate hash on dataType+keys
					$keys = '';
					foreach($v['keys'] as $k_id=>$k_v){
						$key_db = NULL;
						FieldSQLString::formatForDb($this->getDbLink(),$k_id,$key_db);
						$val_db = NULL;
						FieldSQLString::formatForDb($this->getDbLink(),$k_v,$val_db);
				
						$keys.= ($keys=='')? '':' AND ';
						$keys.= sprintf('%s=%s',$key_db,$val_db);
					}
					$h = md5($v['dataType'].$keys);
					if(!isset($types_cache[$h])){
						$data_type_db = NULL;
						FieldSQLString::formatForDb($this->getDbLink(),$v['dataType'],$data_type_db);
					
						$dt_aliases_id = $this->getDbLink()->query(sprintf(
						"SELECT field,alias FROM data_type_field_aliases WHERE data_type=%s",
						$data_type_db
						));
					
						if(is_array($dt_aliases_id) &amp;&amp; count($dt_aliases_id)){	
							$fields = '';
							$aliases_ar = [];
							while($dt_alias = $this->getDbLink()->fetch_array($dt_aliases_id)){
								$f_db = NULL;
								FieldSQLString::formatForDb($this->getDbLink(),$dt_alias['field'],$f_db);						
								$a_db = NULL;
								FieldSQLString::formatForDb($this->getDbLink(),$dt_alias['alias'],$a_db);						
							
								$fields.= ($fields=='')? '':',';
								$fields.= sprintf('%s AS "%s"',
									$f_db,
									mb_substr($a_db,1,mb_strlen($a_db)-2)
									);
								
								array_push($aliases_ar,$dt_alias['alias']);
							}
						
							//данные
							$dt_data_id = $this->getDbLink()->query(sprintf(
								"SELECT %s FROM %s WHERE %s",
								$fields,
								$data_type_db,
								$keys
							));
							while($dt_data = $this->getDbLink()->fetch_array($dt_data_id)){
								if(!isset($types_cache[$h])){
									$types_cache[$h] = array();
								}
								foreach($aliases_ar as $alias){
									$types_cache[$h][$alias] = $dt_data[$alias];
								
								}
							}
						
							//$types_cache[$h] = TRUE;
						}
					}
				}
			}
					
			self::render($tmp_file,$data,$data_fl,FALSE);
			
			if(!file_exists($data_fl)){
				throw new Exception(self::ER_NO_DOC);
			}
			
			$ar_res = $this->getDbLinkMaster()->query_first(
				sprintf(
					"UPDATE documents
					SET
						document_data='%s',
						document_gen_date=now(),
						document_gen_employee_id=%d
						
					WHERE id=%d
					RETURNING
						document_gen_date,
						(employees_ref(
							(SELECT employees FROM employees WHERE employees.id=%d)
							)
						) AS document_gen_employees_ref",
					pg_escape_bytea(file_get_contents($data_fl)),
					$_SESSION['global_employee_id'],
					$this->getExtDbVal($pm,'doc_id'),
					$_SESSION['global_employee_id']
				)
			);
			$this->addModel(new ModelVars(
				array('name'=>'Vars',
					'id'=>'DocumentDialog_Model',
					'values'=>array(
						new Field('document_gen_employees_ref',DT_STRING,
							array('value'=>$ar_res['document_gen_employees_ref'])),
						new Field('document_gen_date',DT_STRING,
							array('value'=>$ar_res['document_gen_date']))
					)
				)
			));		
			
		}
		else if(!$data_fl_ex){
			//database document exists			
			file_put_contents($data_fl,pg_unescape_bytea($ar['document_data']));
		}
		
		
		
	}
	
	public function get_document($pm){
		Employee_Controller::set_employee_id($this->getDbLink());
		
		if(!file_exists($data_fl = self::get_data_file_name($this->getExtDbVal($pm,'doc_id')))){
			throw new Exception('Document not generated@101');	
		}
		
		$ar = $this->getDbLink()->query_first(sprintf(
			"SELECT
				CASE
					WHEN d.for_all_employees THEN TRUE
					ELSE d.employee_id=%d OR 'employees'||%d =ANY(d.permission_ar) OR 'departments'||%d =ANY(d.permission_ar)
				END AS permitted,
				CASE
					WHEN dt.for_all_employees THEN TRUE
					ELSE dt.employee_id=%d OR 'employees'||%d =ANY(dt.permission_ar) OR 'departments'||%d =ANY(dt.permission_ar)
				END AS templ_permitted,				
				dt.template_file,
				dt.id AS template_id
			FROM documents AS d
			LEFT JOIN doc_templates AS dt ON dt.id=d.doc_template_id
			WHERE d.id=%d",
			
		$_SESSION['global_employee_id'],
		$_SESSION['global_employee_id'],
		$_SESSION['department_id'],		
		$_SESSION['global_employee_id'],
		$_SESSION['global_employee_id'],
		$_SESSION['department_id'],				
		$this->getExtDbVal($pm,'doc_id')
		));
	
		if (!count($ar)){
			throw new Exception(self::ER_NO_DOC);
		}
		if ($ar['permitted']!='t'||$ar['templ_permitted']!='t'){
			throw new Exception(self::ER_NOT_ALLOWED);
		}
		
		$templateFile = json_decode($ar['template_file']);
	
		$mime = getMimeTypeOnExt($templateFile[0]->name);
		ob_clean();
		downloadFile($data_fl, $mime,'attachment;',$templateFile[0]->name);
						
		return TRUE;
	
	}
	
	public function delete_document($pm){
		Employee_Controller::set_employee_id($this->getDbLink());
		
		self::delete_data_file($this->getExtDbVal($pm,'doc_id'));
		
		$this->getDbLinkMaster()->query(
			sprintf(
				"UPDATE documents
				SET
					document_data=NULL,
					document_gen_date=now(),
					document_gen_employee_id=%d
				WHERE id=%d",
				$_SESSION['global_employee_id'],
				$this->getExtDbVal($pm,'doc_id')
			)
		);
	}

</xsl:template>

</xsl:stylesheet>
