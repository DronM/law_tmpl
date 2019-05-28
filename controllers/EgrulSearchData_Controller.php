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



require_once('common/ClientSearch.php');

class EgrulSearchData_Controller extends ControllerSQL{

	const SOCRBASE_FILE = '/usr/share/php/common/socrbase.srz';

	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);
			
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
		
		$this->setListModelId('EgrulSearchData_Model');
		
			
		/* get_object */
		$pm = new PublicMethod('get_object');
		$pm->addParam(new FieldExtString('mode'));
		
		$pm->addParam(new FieldExtString('inn'
		));
		
		
		$this->addPublicMethod($pm);
		$this->setObjectModelId('EgrulSearchData_Model');		

			
		/* complete  */
		$pm = new PublicMethod('complete');
		$pm->addParam(new FieldExtString('pattern'));
		$pm->addParam(new FieldExtInt('count'));
		$pm->addParam(new FieldExtInt('ic'));
		$pm->addParam(new FieldExtInt('mid'));
		$pm->addParam(new FieldExtString('inn'));		
		$this->addPublicMethod($pm);					
		$this->setCompleteModelId('EgrulSearchData_Model');

			
		$pm = new PublicMethod('search');
		
				
	$opts=array();
	
		$opts['length']=250;
		$opts['required']=TRUE;				
		$pm->addParam(new FieldExtString('query',$opts));
	
			
		$this->addPublicMethod($pm);

		
	}	
	

	public function applySocrBase($str,$socrBase){
		return (isset($socrBase[$str])? $socrBase[$str] : NULL);
	}

	public function strSocr($str,$socrBase){
		$res = '';
                $p = mb_strpos($str,' ',NULL,'UTF-8');
                if($p!==FALSE){
                        $str_to_socr = mb_substr($str,0,$p,'UTF-8');
                        if (mb_substr(mb_strtoupper($str_to_socr,'UTF-8'),0,7,'UTF-8')=='АВТОНОМ'){
                        	//2 words
                        	$p = mb_strpos($str,' ',$p+1,'UTF-8');
                        	if($p!==FALSE){
                        		$str_to_socr = mb_substr($str,0,$p,'UTF-8');
                        	}
                        }
                        $str_socr = $this->applySocrBase(mb_strtoupper($str_to_socr,'UTF-8'),$socrBase);
                        $res = (!is_null($str_socr)? mb_substr($str,$p+1,NULL,'UTF-8').' '.$str_socr : $str);
                }
                else{
                        $res = $str;
                }

		return $res;
	}
	/*
	private function search_local_data($searchStrForDb){
		$q_search = sprintf("lower(name) LIKE '%%'||%s||'%%'",$search);
		if(!preg_match('/[a-zA-Zа-яА-Я]/', $search)){
			$q_search.= sprintf(" OR inn=%s||'%%' OR ogrn=%s||'%%'",$search,$search);
		}
		
		return $this->getDbLink->query("SELECT data FROM egrul_search_data WHERE ".$q_search);
		
	}
	*/
	
	public function complete($pm){
		$search = $this->getExtDbVal($pm,'inn');
		
		$q_search = sprintf("lower(name) LIKE '%%'||%s||'%%'",$search);
		if(!preg_match('/[a-zA-Zа-яА-Я]/', $search)){
			$q_search.= sprintf(" OR inn LIKE %s||'%%' OR ogrn LIKE %s||'%%'",$search,$search);
		}
		
		$this->addNewModel(
			"SELECT * FROM egrul_search_data WHERE ".$q_search,
			'EgrulSearchData_Model'
		);
	}

	public function search($pm){
		
		$resp = ClientSearch::search($this->getExtVal($pm,"query"));
		//throw new Exception($resp);
		//parsing
		$json = json_decode($resp);
		
		//Required filds
		$data_for_db = [];
		
		$data_for_db['inn'] = '';
		if (isset($json->suggestions[0]->data->inn)){
			$data_for_db['inn'] = $json->suggestions[0]->data->inn;
		}
		if(!strlen($data_for_db['inn'])){
			throw new Exception('В структуре не найден ИНН!');
		}
		
		$data_for_db['ogrn'] = '';
		if (isset($json->suggestions[0]->data->ogrn)){
			$data_for_db['ogrn'] = $json->suggestions[0]->data->ogrn;
		}
		if(!strlen($data_for_db['ogrn'])){
			throw new Exception('В структуре не найден ОГРН!');
		}
		
		$data_for_db['name'] = '';
		if (isset($json->suggestions[0]->value)){
			$data_for_db['name'] = $json->suggestions[0]->value;
		}		
		if(!strlen($data_for_db['name'])){
			throw new Exception('В структуре не найдено наименование!');
		}
		
		
		if (isset($json->suggestions[0]->data->management)){
			$data_for_db['manager_name'] = $json->suggestions[0]->data->management->name;
			$data_for_db['manager_post'] = $json->suggestions[0]->data->management->post;
		}			
		
		if (isset($json->suggestions[0]->data->kpp)){
			$data_for_db['kpp'] = $json->suggestions[0]->data->kpp;
		}
		if (isset($json->suggestions[0]->data->okpo)){
			$data_for_db['post'] = $json->suggestions[0]->data->okpo;
		}
		if (isset($json->suggestions[0]->data->okved)){
			$data_for_db['post'] = $json->suggestions[0]->data->okved;
		}
		if (isset($json->suggestions[0]->data->state) && isset($json->suggestions[0]->data->state->registration_date)){
			$data_for_db['registration_date'] = $json->suggestions[0]->data->state->registration_date;
		}

		if (isset($json->suggestions[0]->data->name)){
			$data_for_db['name_ext'] = array();
			if (isset($json->suggestions[0]->data->name->full_with_opf)){
				$data_for_db['name_ext']['full_with_opf'] = $json->suggestions[0]->data->name->full_with_opf;
			}
			if (isset($json->suggestions[0]->data->name->short_with_opf)){
				$data_for_db['name_ext']['short_with_opf'] = $json->suggestions[0]->data->name->short_with_opf;
			}
			if (isset($json->suggestions[0]->data->name->latin)){
				$data_for_db['name_ext']['latin'] = $json->suggestions[0]->data->name->latin;
			}
			if (isset($json->suggestions[0]->data->name->full)){
				$data_for_db['name_ext']['full'] = $json->suggestions[0]->data->name->full;
			}
			if (isset($json->suggestions[0]->data->name->short)){
				$data_for_db['name_ext']['short'] = $json->suggestions[0]->data->name->short;
			}
			
		}
		if (isset($json->suggestions[0]->data->opf)){
			$data_for_db['opf'] = array();
			if (isset($json->suggestions[0]->data->opf->code)){
				$data_for_db['opf']['code'] = $json->suggestions[0]->data->opf->code;
			}
			if (isset($json->suggestions[0]->data->opf->full)){
				$data_for_db['opf']['full'] = $json->suggestions[0]->data->opf->full;
			}
			if (isset($json->suggestions[0]->data->opf->short)){
				$data_for_db['short']['full'] = $json->suggestions[0]->data->opf->short;
			}
			
		}
		
		if (isset($json->suggestions[0]->data->address)
		&& isset($json->suggestions[0]->data->address->data)
		//&& isset($json->suggestions[0]->data->address->data->source)
		&& file_exists($socr_ar_file = self::SOCRBASE_FILE)
		){
			$socrBase = unserialize(file_get_contents($socr_ar_file));
			$addr = '643,'.
			(is_null($json->suggestions[0]->data->address->data->postal_code)? '':$json->suggestions[0]->data->address->data->postal_code).','.
			(is_null($json->suggestions[0]->data->address->data->region)? '':$this->strSocr($json->suggestions[0]->data->address->data->region_type_full.' '.$json->suggestions[0]->data->address->data->region,$socrBase)).','.
			(is_null($json->suggestions[0]->data->address->data->area)? '':$this->strSocr($json->suggestions[0]->data->address->data->area_type_full.' '.$json->suggestions[0]->data->address->data->area,$socrBase)).','.
			(is_null($json->suggestions[0]->data->address->data->city)? '':$this->strSocr($json->suggestions[0]->data->address->data->city_type_full.' '.$json->suggestions[0]->data->address->data->city,$socrBase)).','.
			(is_null($json->suggestions[0]->data->address->data->settlement)? '':$this->strSocr($json->suggestions[0]->data->address->data->settlement_type_full.' '.$json->suggestions[0]->data->address->data->settlement,$socrBase)).','.

			(is_null($json->suggestions[0]->data->address->data->street)? '':$this->strSocr($json->suggestions[0]->data->address->data->street_type_full.' '.$json->suggestions[0]->data->address->data->street,$socrBase)).','.

			(is_null($json->suggestions[0]->data->address->data->house)? '':($json->suggestions[0]->data->address->data->house_type_full.' '.$json->suggestions[0]->data->address->data->house)).','.

			(is_null($json->suggestions[0]->data->address->data->block)? '':($json->suggestions[0]->data->address->data->block_type_full.' '.$json->suggestions[0]->data->address->data->block)).','.

			(is_null($json->suggestions[0]->data->address->data->flat)? '':($json->suggestions[0]->data->address->data->flat_type_full.' '.$json->suggestions[0]->data->address->data->flat))

							        ;
							        
			$data_for_db['address_legal'] = $addr;
		
		}
		else if (
		isset($json->suggestions[0]->data->address)
		&& isset($json->suggestions[0]->data->address->value)){
			$data_for_db['address_legal'] = $json->suggestions[0]->data->address->value;
		}
		
		//!!! INSERT !!!
		$data_val = json_encode($data_for_db, JSON_UNESCAPED_UNICODE);
		$this->getDbLinkMaster()->query(
			sprintf(
				"SELECT egrul_search_data_upsert('%s','%s','%s','%s',%d)",
				$data_for_db['inn'],$data_for_db['ogrn'],$data_for_db['name'],
				$data_val,
				$_SESSION['user_id']
			)
		);
		
		$model = new Model(array('id'=>'EgrulSearchData_Model'));
		$row = array(
			new Field('inn',DT_STRING,array('value'=>$data_for_db['inn']))
			,new Field('ogrn',DT_STRING,array('value'=>$data_for_db['ogrn']))
			,new Field('name',DT_STRING,array('value'=>$data_for_db['name']))
			,new Field('data',DT_STRING,array('value'=>$data_val))
		);
		$model->insert($row);					
		$this->addModel($model);
	}


}
?>