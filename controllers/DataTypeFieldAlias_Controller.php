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


class DataTypeFieldAlias_Controller extends ControllerSQL{
	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);
			

		/* insert */
		$pm = new PublicMethod('insert');
		
				$param = new FieldExtEnum('data_type',',','users,employees,departments,banks'
				,array());
		$pm->addParam($param);
		$param = new FieldExtString('field'
				,array());
		$pm->addParam($param);
		$param = new FieldExtString('alias'
				,array());
		$pm->addParam($param);
		
		
		$this->addPublicMethod($pm);
		$this->setInsertModelId('DataTypeFieldAlias_Model');

			
		/* update */		
		$pm = new PublicMethod('update');
		
		$pm->addParam(new FieldExtEnum('old_data_type',',','users,employees,departments,banks',array('required'=>TRUE)));
		
		$pm->addParam(new FieldExtString('old_field',array('required'=>TRUE)));
		
		$pm->addParam(new FieldExtInt('obj_mode'));
		
				$param = new FieldExtEnum('data_type',',','users,employees,departments,banks'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtString('field'
				,array(
			));
			$pm->addParam($param);
		$param = new FieldExtString('alias'
				,array(
			));
			$pm->addParam($param);
		
			$param = new FieldExtEnum('data_type',',','users,employees,departments,banks',array(
			));
			$pm->addParam($param);
		
			$param = new FieldExtString('field',array(
			));
			$pm->addParam($param);
		
		
			$this->addPublicMethod($pm);
			$this->setUpdateModelId('DataTypeFieldAlias_Model');

			
		/* delete */
		$pm = new PublicMethod('delete');
		
		$pm->addParam(new FieldExtEnum('data_type'
		,',','users,employees,departments,banks'));		
		
		$pm->addParam(new FieldExtString('field'
		));		
		
		$pm->addParam(new FieldExtInt('count'));
		$pm->addParam(new FieldExtInt('from'));				
		$this->addPublicMethod($pm);					
		$this->setDeleteModelId('DataTypeFieldAlias_Model');

			
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
		
		$this->setListModelId('DataTypeFieldAlias_Model');
		
			
		/* get_object */
		$pm = new PublicMethod('get_object');
		$pm->addParam(new FieldExtString('mode'));
		
		$pm->addParam(new FieldExtEnum('data_type'
		,',','users,employees,departments,banks'));
		
		$pm->addParam(new FieldExtString('field'
		));
		
		
		$this->addPublicMethod($pm);
		$this->setObjectModelId('DataTypeFieldAlias_Model');		

		
	}	
	
}
?>