<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:import href="Controller_php.xsl"/>

<!-- -->
<xsl:variable name="CONTROLLER_ID" select="'DocTemplate'"/>
<!-- -->

<xsl:output method="text" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
			
<xsl:template match="/">
	<xsl:apply-templates select="metadata/controllers/controller[@id=$CONTROLLER_ID]"/>
</xsl:template>

<xsl:template match="controller"><![CDATA[<?php]]>

<xsl:call-template name="add_requirements"/>
require_once(USER_CONTROLLERS_PATH.'Employee_Controller.php');
require_once(USER_CONTROLLERS_PATH.'Document_Controller.php');

class <xsl:value-of select="@id"/>_Controller extends <xsl:value-of select="@parentId"/>{

	const ER_CANT_CHANGE_EMPL = 'Запрещено менять автора!';
	const ER_CANT_DELETE = 'Запрещено удалять чужой шаблон!';
	const ER_NO_DOC = 'Шаблон не найден!';

	const FILE_EXT_TEMPLATE = '.tmpl';

	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);<xsl:apply-templates/>
	}	
	<xsl:call-template name="extra_methods"/>
}
<![CDATA[?>]]>
</xsl:template>

<xsl:template name="extra_methods">

	public static function template_path($fileId){
		return OUTPUT_PATH.$fileId.self::FILE_EXT_TEMPLATE;
	}

	private function save_template_file($pm){
		if (isset($_FILES['template_file_data'])){
			$file_id = md5(uniqid());
			$file_path = self::template_path($file_id);
			if (!move_uploaded_file($_FILES['template_file_data']['tmp_name'][0],$file_path)){
				throw new Exception('Ошибка загрузки шаблона!');
			}
			
			$template_file = sprintf(
				'[{
					"name":"%s",
					"id":"%s",
					"size":"%s"
				}]',
				$_FILES['template_file_data']['name'][0],
				$file_id,
				$_FILES['template_file_data']['size'][0]
			);
			
			$pm->setParamValue('template_file',$template_file);
			$pm->setParamValue('template_data',pg_escape_bytea(file_get_contents($file_path)));
			
			//template checking
			$out_file = OUTPUT_PATH.uniqid().'.td';
			$data = array();
			try{
				Document_Controller::render($file_path,$data,$out_file,TRUE);
			}
			finally{
				if(file_exists($out_file)){
					unlink($out_file);
				}
			}			
			
			return $file_id;
		}
	}
	
	public function insert($pm){
		if ($_SESSION['role_id']!='admin' || ($_SESSION['role_id']=='admin' &amp;&amp; !$pm->getParamValue('employee_id')) ){
			$ref = json_decode($_SESSION['employees_ref']);
			if ($ref){
				$pm->setParamValue('employee_id',$ref->keys->id);
			}
		}
		$file_id = $this->save_template_file($pm);
		try{
			$file_id = $this->save_template_file($pm);
			parent::insert($pm);
		}
		catch(Exception $e){
			if($file_id &amp;&amp; file_exists($file_path = self::template_path($file_id))){
				unlink($file_path);
			}
			throw $e;
		}
		
	}

	private function delete_file_on_field($templateFile){
		$template_file = json_decode($templateFile);
		if(is_array($template_file)
		&amp;&amp; count($template_file)
		&amp;&amp; isset($template_file[0]->id)
		&amp;&amp; file_exists($file_path = self::template_path($template_file[0]->id))
		){
			unlink($file_path);
		}	
	}

	public function update($pm){
		if ($_SESSION['role_id']!='admin' &amp;&amp; $pm->getParamValue('employee_id')){
			throw new Exception(self::ER_CANT_CHANGE_EMPL);
		}
		try{
			$file_id = $this->save_template_file($pm);
			//удалить старый шаблон из кэша, если есть новый файл!!!
			if(isset($file_id) &amp;&amp; strlen($file_id)){
				$old_tmpl = $this->getDbLinkMaster()->query_first(
					sprintf(
						"SELECT template_file FROM doc_templates WHERE id=%d",
						$this->getExtDbVal($pm,'old_id')
					)
				);				
				if(is_array($old_tmpl) &amp;&amp; count($old_tmpl)){
					$this->delete_file_on_field($old_tmpl['template_file']);
				}
			}
			parent::update($pm);
			
		}
		catch(Exception $e){
			if($file_id &amp;&amp; file_exists($file_path = self::template_path($file_id))){
				unlink($file_path);
			}
			throw $e;
		}
	}

	public function delete($pm){
		$ar = $this->getDbLink()->query_first(sprintf(
			"SELECT
				employee_id,
				template_file
			FROM doc_templates
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
		
		$this->delete_file_on_field($ar['template_file']);
		
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
			
			$where = new ModelWhereSQL();
			
			Employee_Controller::set_employee_id($this->getDbLink());
			
			$where->addExpression('permission_ar',
				sprintf(for_all_employees OR
				"employee_id=%d OR 'employees%s' =ANY (permission_ar) OR 'departments%s' =ANY (permission_ar)
				",
				$_SESSION['employee_id'],
				$_SESSION['employee_id'],
				$_SESSION['department_id']
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
	
	/**
	 * for delete_template,get_template
	 */
	public static function check_template_permissions($dbLink,&amp;$filePath,&amp;$fileEx,&amp;$ar,&amp;$templateFile,$needData,$fileId,$docId){
		Employee_Controller::set_employee_id($dbLink);
		
		$filePath = self::template_path($fileId);
		$fileEx = file_exists($filePath);
		
		$ar = $dbLink->query_first(sprintf(
			"SELECT
				for_all_employees,
				(employee_id=%d OR 'employees%d' =ANY (permission_ar) OR 'departments%s' =ANY (permission_ar)) AS permitted,
				template_file
				%s
			FROM doc_templates
			WHERE id=%d",
		$_SESSION['employee_id'],
		$_SESSION['employee_id'],
		$_SESSION['department_id'],
		((!$needData||$fileEx)? '':',template_data'),
		$docId
		));
		
		if (!count($ar) || $ar['permitted']!='t'){
			throw new Exception(self::ER_NO_DOC);
		}
	
		$templateFile = json_decode($ar['template_file']);
		if(!$templateFile || !count($templateFile) || !isset($templateFile[0]->id) || $templateFile[0]->id!=$fileId){
			throw new Exception(self::ER_NO_DOC);
		}
	}
	
	public function delete_template($pm){
		$file_path = '';
		$file_ex = FALSE;
		$ar = array();
		$template_file = NULL;
		self::check_template_permissions($this->getDbLink(),$file_path,$file_ex,$ar,$template_file,FALSE,$this->getExtVal($pm,'file_id'),$this->getExtVal($pm,'doc_id'));
		
		if($file_ex){		
			unlink($file_path);
		}
		
		$this->getDbLinkMaster()->query(sprintf(
		'UPDATE doc_templates
		SET
			template_file = NULL,
			template_data = NULL
		WHERE id=%d',
		$this->getExtDbVal($pm,'doc_id')
		));
	
	}	

	public function get_template($pm){
		
		$file_path = '';
		$file_ex = FALSE;
		$ar = array();
		$template_file = NULL;
		self::check_template_permissions($this->getDbLink(),$file_path,$file_ex,$ar,$template_file,TRUE,$this->getExtVal($pm,'file_id'),$this->getExtVal($pm,'doc_id'));
		
		if(!$file_ex){
			file_put_contents($file_path,pg_unescape_bytea($ar['template_data']));
		}
		
		$mime = getMimeTypeOnExt($template_file[0]->name);
		ob_clean();
		downloadFile($file_path, $mime,'attachment;',$template_file[0]->name);
		return TRUE;
		
	}	

</xsl:template>

</xsl:stylesheet>
