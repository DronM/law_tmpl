<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:import href="Controller_php.xsl"/>

<!-- -->
<xsl:variable name="CONTROLLER_ID" select="'Egrul'"/>
<!-- -->

<xsl:output method="text" indent="yes"
			doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" 
			doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
			
<xsl:template match="/">
	<xsl:apply-templates select="metadata/controllers/controller[@id=$CONTROLLER_ID]"/>
</xsl:template>

<xsl:template match="controller"><![CDATA[<?php]]>

<xsl:call-template name="add_requirements"/>

require_once(FRAME_WORK_PATH.'basic_classes/FieldSQLString.php');
require_once('common/EgrulParser/EgrulParser.php');
require_once('common/downloader.php');

class <xsl:value-of select="@id"/>_Controller extends <xsl:value-of select="@parentId"/>{
	public function __construct($dbLinkMaster=NULL,$dbLink=NULL){
		parent::__construct($dbLinkMaster,$dbLink);<xsl:apply-templates/>
	}	
	<xsl:call-template name="extra_methods"/>
}
<![CDATA[?>]]>
</xsl:template>

<xsl:template name="extra_methods">

	/**
	 */
	public function get_captcha($pm){
		$path = EGRUL_PATH;
		$egrul = new EgrulParser(array('tmpPath'=>$path,'logFile'=>$path.'egrul.log'));
		$response = [];	
		$egrul->init($response);	
		$id = $egrul->serializeResponse($response);
		
		$model = new Model(array('id'=>'EgrulCaptcha_Model'));		
		$row = array();
		array_push($row,new Field('queryId',DT_STRING,array('value'=>$id)));
		array_push($row,new Field('captchaContent',DT_STRING,array('value'=>base64_encode($response['captchaContent']))));
		array_push($row,new Field('captchaToken',DT_STRING,array('value'=>$response['captchaToken'])));
		array_push($row,new Field('captchaURL',DT_STRING,array('value'=>htmlspecialchars($response['captchaURL']))));
		
		$model->insert($row);					
		$this->addModel($model);	
		
	}
	
	private function throw_crit_error($erMessage){
		if(DEBUG){
			throw new Exception($erMessage);
		}
		else{
			error_log($erMessage);
			throw new Exception('Ошибка получения данных!');
		}
	}

	/**
	 * {string} seacrh_by=innogrn|name
	 * {string} seach_value
	 * {string} kind
	 * {string} query_id
	 * {string} captcha
	 * {string} region
	 */
	/* 	
	public function find($pm){
		
		function get_val(&amp;$resp,$section,$field){
			return (isset($resp[$section])&amp;&amp;count($resp[$section]['value'])&amp;&amp;isset($resp[$section]['value'][0][$field]))? $resp[$section]['value'][0][$field]['value']:NULL;
		}
	
		function param_letter_cap($param){
			$res = isset($param)? mb_strtolower($param,'UTF-8'):'';
			$n = mb_strlen($res,'UTF-8');
			if($n){
				$res = mb_strtoupper(mb_substr($res,0,1,'UTF-8'),'UTF-8').mb_substr($res,1,$n-1,'UTF-8');	
			}
			return $res;
		}
				
		$kind = $this->getExtVal($pm,"kind");
		$search_value = $this->getExtVal($pm,"search_value");
		
		$fl_f = '';
		$fl_n = '';
		$fl_o = '';
		
		if($kind=='fl' &amp;&amp; $this->getExtVal($pm,"search_by")=='name'){
			$search_value_parts = explode(' ',$search_value);
		
			$fl_f = (count($search_value_parts)>=1)? $search_value_parts[0]:'';
			$fl_n = (count($search_value_parts)>=2)? $search_value_parts[1]:'';
			$fl_o = (count($search_value_parts)>=3)? $search_value_parts[3]:'';
			
			$search_val_db = "'".$search_value."'";
			$search_value = '';
		}
		else{
			$search_val_db = $this->getExtDbVal($pm,"search_value");
		}
		
		$seacrh_by = $this->getExtVal($pm,"search_by");
		$cond = '';
		if ($seacrh_by=='innogrn'&amp;&amp; strlen($search_value)&lt;=12){
			$cond = sprintf('inn=%s',$search_val_db);
		}
		else if($seacrh_by=='innogrn'){
			$cond = sprintf('ogrn=%s',$search_val_db);
		}
		else{
			$cond = sprintf("lower(name) LIKE '%%'||lower(%s)||'%%'",$search_val_db);
		}
	
		$ar = $this->getDbLink()->query_first(sprintf(
			"SELECT
				data
			FROM egrul_search_data
			WHERE %s",
		$cond
		));
		$from_cache = (is_array($ar) &amp;&amp; count($ar));
		
		if ($from_cache){
			$resp_str = $ar['data'];
		}
		else{			
			$path = EGRUL_PATH;
			$egrul = new EgrulParser(array('tmpPath'=>$path,'logFile'=>$path.'egrul.log'));
			$resp_short = $egrul->find(
				$this->getExtVal($pm,"query_id"),
				$this->getExtVal($pm,"captcha"),
				array(
					'kind'=>$kind,
					'searchValue'=>$search_value,
					'searchBy'=>$seacrh_by,
					'region'=>$this->getExtVal($pm,"region"),
					'searchValueFam'=>$fl_f,
					'searchValueName'=>$fl_n,
					'searchValueOtch'=>$fl_o
				)
			);
			$resp = $egrul->getExtendedData($resp_short[0]->T,$kind);
			if($kind=='ul'){
				//$resp['Адрес']['value'][0]['Представление'] = array("descr"=>'Представление адреса ФНС','value'=>$egrul->addressSocr($resp['Адрес']['value'][0]));
				
				$v = get_val($resp,'Руководитель','Фамилия');
				if($v){
					$resp['Руководитель']['value'][0]['Фамилия']['value'] = param_letter_cap($v);
				}
				$v = get_val($resp,'Руководитель','Имя');
				if($v){
					$resp['Руководитель']['value'][0]['Имя']['value'] = param_letter_cap($v);
				}
				$v = get_val($resp,'Руководитель','Отчество');
				if($v){
					$resp['Руководитель']['value'][0]['Отчество']['value'] = param_letter_cap($v);
				}
				$v = get_val($resp,'Руководитель','Должность');
				if($v){
					$resp['Руководитель']['value'][0]['Должность']['value'] = param_letter_cap($v);
				}
				
				$inn = get_val($resp,'НалоговыйОрган','ИНН');
				$ogrn = get_val($resp,'Регистрация','ОГРН');
				$name = get_val($resp,'Наименование','СокращенноеНаименование');
				
			}
			else{
				$inn = get_val($resp,'СведенияОбУчете','ИНН');
				$ogrn = get_val($resp,'Регистрация','ОГРНИП');
				
				$fl_f = get_val($resp,'Наименование','Фамилия');
				if($fl_f){
					$resp['Наименование']['value'][0]['Фамилия']['value'] = param_letter_cap($fl_f);
				}
				$fl_n = get_val($resp,'Наименование','Имя');
				if($fl_n){
					$resp['Наименование']['value'][0]['Имя']['value'] = param_letter_cap($fl_n);
				}
				$fl_o = get_val($resp,'Наименование','Отчество');
				if($fl_o){
					$resp['Наименование']['value'][0]['Отчество']['value'] = param_letter_cap($fl_o);
				}
				$name = ($fl_f? ' '.$fl_f:'').($fl_n? ' '.$fl_n:''). ($fl_o? ' '.$fl_o:'');
			}
			$resp_str = json_encode($resp);
			
			//to cache
			$inn_db = NULL;
			FieldSQLString::formatForDb($this->getDbLink(),$inn,$inn_db);
			$ogrn_db = NULL;
			FieldSQLString::formatForDb($this->getDbLink(),$ogrn,$ogrn_db);
			$name_db = NULL;
			FieldSQLString::formatForDb($this->getDbLink(),$name,$name_db);
			$data_db = NULL;
			FieldSQLString::formatForDb($this->getDbLink(),$resp_str,$data_db);
			
			if($inn_db=='null'){
				throw_crit_error('Пустой ИНН');	
			}
			else if($ogrn_db=='null'){
				throw_crit_error('Пустой ОГРН');	
			}
			else if($name_db=='null'){
				throw_crit_error('Пустое наименование');	
			}
			
			try{
				$q = sprintf(
					"INSERT INTO egrul_search_data
					(inn,ogrn,name,user_id,data)
					VALUES
					(%s,%s,%s,%d,%s)",
				$inn_db,
				$ogrn_db,			
				$name_db,
				$_SESSION['user_id'],
				$data_db
				);
				$this->getDbLinkMaster()->query($q);
			}
			catch(Exception $e){
				throw_crit_error('Ошибка в запросе:'.$q);	
			}
			
		}
		
		//response in JSON
		ob_clean();
		header('Content-Length: '.strlen($resp_str));
		header('Content-Type: application/json');
		
		echo $resp_str;
		
		return TRUE;
	}
	*/
	public function get_cache_list($pm){
		$par_db = $this->getExtDbVal($pm,'val');
		$this->addNewModel(sprintf(
			"SELECT
				inn,ogrn,name,create_dt
			FROM egrul_search_data
			WHERE (inn LIKE (%s||'%%')) OR (ogrn LIKE (%s||'%%')) OR (name LIKE ('%%'||lower(%s)||'%%'))
			LIMIT 10",
			$par_db,$par_db,$par_db
		),'EgrulCacheList_Model'		
		);
	}
	
	public function get_cache_obj($pm){
		$this->addNewModel(sprintf(
			"SELECT
				data,create_dt
			FROM egrul_search_data
			WHERE inn=%s",
			$this->getExtDbVal($pm,'inn')
		),'EgrulCacheObject_Model'		
		);	
	}
	
	public function find($pm){
	}
	
</xsl:template>

</xsl:stylesheet>