<?php
require_once(FRAME_WORK_PATH.'basic_classes/ControllerSQL.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtInt.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtString.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtEnum.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtText.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtDate.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtPassword.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtBool.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtDateTimeTZ.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtJSON.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtJSONB.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtArray.php');
require_once(FRAME_WORK_PATH.'basic_classes/FieldExtBytea.php');

/**
 * THIS FILE IS GENERATED FROM TEMPLATE build/templates/controllers/Controller_php.xsl
 * ALL DIRECT MODIFICATIONS WILL BE LOST WITH THE NEXT BUILD PROCESS!!!
 */


require_once(USER_CONTROLLERS_PATH.'Employee_Controller.php');
require_once(USER_CONTROLLERS_PATH.'Document_Controller.php');

class DocTemplate_Controller extends ControllerSQL{

	const ER_CANT_CHANGE_EMPL = 'Запрещено менять автора!';
	const ER_CANT_DELETE = 'Запрещено удалять чужой шаблон!';
	const ER_NO_DOC = 'Шаблон не найден!';

	const FILE_EXT_TEMPLATE = '.tmpl';

	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);
			

		/* insert */
		$pm = new PublicMethod('insert');
		$param = new FieldExtString('name'
				,array('required'=>TRUE,
				'alias'=>'Наименование'
			));
		$pm->addParam($param);
		$param = new FieldExtText('comment_text'
				,array(
				'alias'=>'Комментарий'
			));
		$pm->addParam($param);
		$param = new FieldExtInt('employee_id'
				,array());
		$pm->addParam($param);
		$param = new FieldExtJSONB('permissions'
				,array());
		$pm->addParam($param);
		$param = new FieldExtArray('permission_ar'
				,array());
		$pm->addParam($param);
		$param = new FieldExtJSON('fields'
				,array());
		$pm->addParam($param);
		$param = new FieldExtString('document_prefix'
				,array('required'=>TRUE));
		$pm->addParam($param);
		$param = new FieldExtBool('for_all_employees'
				,array());
		$pm->addParam($param);
		$param = new FieldExtJSONB('template_file'
				,array());
		$pm->addParam($param);
		$param = new FieldExtText('template_data'
				,array());
		$pm->addParam($param);
		$param = new FieldExtText('user_functions'
				,array());
		$pm->addParam($param);
		
		$pm->addParam(new FieldExtInt('ret_id'));
		
			$f_params = array();
			$param = new FieldExtText('template_file_data'
			,$f_params);
		$pm->addParam($param);		
		
		
		$this->addPublicMethod($pm);
		$this->setInsertModelId('DocTemplate_Model');

			
		/* update */		
		$pm = new PublicMethod('update');
		
		$pm->addParam(new FieldExtInt('old_id',array('required'=>TRUE)));
		
		$pm->addParam(new FieldExtInt('obj_mode'));
		$param = new FieldExtInt('id'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtString('name'
				,array(
			
				'alias'=>'Наименование'
			));
			$pm->addParam($param);
		$param = new FieldExtText('comment_text'
				,array(
			
				'alias'=>'Комментарий'
			));
			$pm->addParam($param);
		$param = new FieldExtInt('employee_id'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtJSONB('permissions'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtArray('permission_ar'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtJSON('fields'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtString('document_prefix'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtBool('for_all_employees'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtJSONB('template_file'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtText('template_data'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtText('user_functions'
				,array(
			));
			$pm->addParam($param);
		
			$param = new FieldExtInt('id',array(
			));
			$pm->addParam($param);
		
			$f_params = array();
			$param = new FieldExtText('template_file_data'
			,$f_params);
		$pm->addParam($param);		
		
		
			$this->addPublicMethod($pm);
			$this->setUpdateModelId('DocTemplate_Model');

			
		/* delete */
		$pm = new PublicMethod('delete');
		
		$pm->addParam(new FieldExtInt('id'
		));		
		
		$pm->addParam(new FieldExtInt('count'));
		$pm->addParam(new FieldExtInt('from'));				
		$this->addPublicMethod($pm);					
		$this->setDeleteModelId('DocTemplate_Model');

			
		/* get_list */
		$pm = new PublicMethod('get_list');
		
		$pm->addParam(new FieldExtInt('count'));
		$pm->addParam(new FieldExtInt('from'));
		$pm->addParam(new FieldExtString('cond_fields'));
		$pm->addParam(new FieldExtString('cond_sgns'));
		$pm->addParam(new FieldExtString('cond_vals'));
		$pm->addParam(new FieldExtString('cond_ic'));
		$pm->addParam(new FieldExtString('ord_fields'));
		$pm->addParam(new FieldExtString('ord_directs'));
		$pm->addParam(new FieldExtString('field_sep'));

		$this->addPublicMethod($pm);
		
		$this->setListModelId('DocTemplateList_Model');
		
			
		/* get_object */
		$pm = new PublicMethod('get_object');
		$pm->addParam(new FieldExtString('mode'));
		
		$pm->addParam(new FieldExtInt('id'
		));
		
		
		$this->addPublicMethod($pm);
		$this->setObjectModelId('DocTemplateDialog_Model');		

			
		/* complete  */
		$pm = new PublicMethod('complete');
		$pm->addParam(new FieldExtString('pattern'));
		$pm->addParam(new FieldExtInt('count'));
		$pm->addParam(new FieldExtInt('ic'));
		$pm->addParam(new FieldExtInt('mid'));
		$pm->addParam(new FieldExtString('name'));		
		$this->addPublicMethod($pm);					
		$this->setCompleteModelId('DocTemplateList_Model');

			
		$pm = new PublicMethod('delete_template');
		
				
	$opts=array();
	
		$opts['required']=TRUE;				
		$pm->addParam(new FieldExtInt('doc_id',$opts));
	
				
	$opts=array();
	
		$opts['length']=36;
		$opts['required']=TRUE;				
		$pm->addParam(new FieldExtString('file_id',$opts));
	
			
		$this->addPublicMethod($pm);

			
		$pm = new PublicMethod('get_template');
		
				
	$opts=array();
	
		$opts['required']=TRUE;				
		$pm->addParam(new FieldExtInt('doc_id',$opts));
	
				
	$opts=array();
	
		$opts['length']=36;
		$opts['required']=TRUE;				
		$pm->addParam(new FieldExtString('file_id',$opts));
	
			
		$this->addPublicMethod($pm);

		
	}	
	

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
		if ($_SESSION['role_id']!='admin' || ($_SESSION['role_id']=='admin' && !$pm->getParamValue('employee_id')) ){
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
			if($file_id && file_exists($file_path = self::template_path($file_id))){
				unlink($file_path);
			}
			throw $e;
		}
		
	}

	private function delete_file_on_field($templateFile){
		$template_file = json_decode($templateFile);
		if(is_array($template_file)
		&& count($template_file)
		&& isset($template_file[0]->id)
		&& file_exists($file_path = self::template_path($template_file[0]->id))
		){
			unlink($file_path);
		}	
	}

	public function update($pm){
		if ($_SESSION['role_id']!='admin' && $pm->getParamValue('employee_id')){
			throw new Exception(self::ER_CANT_CHANGE_EMPL);
		}
		try{
			$file_id = $this->save_template_file($pm);
			//удалить старый шаблон из кэша, если есть новый файл!!!
			if(isset($file_id) && strlen($file_id)){
				$old_tmpl = $this->getDbLinkMaster()->query_first(
					sprintf(
						"SELECT template_file FROM doc_templates WHERE id=%d",
						$this->getExtDbVal($pm,'old_id')
					)
				);				
				if(is_array($old_tmpl) && count($old_tmpl)){
					$this->delete_file_on_field($old_tmpl['template_file']);
				}
			}
			parent::update($pm);
			
		}
		catch(Exception $e){
			if($file_id && file_exists($file_path = self::template_path($file_id))){
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
		if ($_SESSION['role_id']!='admin' && $ar['employee_id']!=$ref->keys->id ){
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
	public static function check_template_permissions($dbLink,&$filePath,&$fileEx,&$ar,&$templateFile,$needData,$fileId,$docId){
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

	public function get_object($pm){
		parent::get_object($pm);
	}


}
?>