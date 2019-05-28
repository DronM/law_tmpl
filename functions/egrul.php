<?php
	require_once('common/EgrulParser/EgrulParser.php');
	
	$dir = '/home/andrey/www/htdocs/crm/output/egrul/';
	
	
	$egrul = new EgrulParser(array('tmpPath'=>$dir,'logLevel'=>EgrulParser::LOG_LEV_DEBUG,'logFile'=>$dir.'egrul.log'));
	/*
	$response = [];	
	$egrul->init($response);	
	$id = $egrul->serializeResponse($response);
	file_put_contents($dir.$id.'.jpeg',$response['captchaContent']);
	echo 'respId='.$id.'</br>';
	*/
	
	
	$id = '5c0f488d02862';
	//$res = $egrul->find($id,'166608',array('kind'=>'ul','searchValue'=>'7204031553'));//7207019191
	//$res = $egrul->find($id,'175586',array('kind'=>'fl','searchBy'=>'name','region'=>'72','searchValueFam'=>'Юрманн','searchValueName'=>'Елена','searchValueOtch'=>'Геннадьевна'));
	//var_dump($res);
	echo '</br>';
	echo '</br>';
	echo '</br>';
	//$res = $egrul->getExtendedData($res[0]->T,'fl');
	//file_put_contents($dir.'result.txt',print_r($res, true));
	//var_dump($res);
	
	//file_put_contents($dir.$id.'.rsp',$res);
	
	
	$resp =  array();
	$egrul->parsePDFData('ul',$resp,$dir.'5c0f4a3f86c05.txt');	
	//var_dump($resultStruc);
	//echo '</br></br>';
	//file_put_contents($dir.'result.txt',print_r($resp, true));
	echo $egrul->addressSocr($resp['Адрес']['value'][0],'/home/andrey/www/htdocs/crm/output/SOCRBASE.csv');
	//ОБЛАСТЬ ТЮМЕНСКАЯ,РАЙОН УПОРОВСКИЙ,СЕЛО УПОРОВО,УЛИЦА ЗАРЕЧНАЯ
	//echo $egrul->strSocr('УЛИЦА ЗАРЕЧНАЯ','/home/andrey/www/htdocs/crm/SOCRBASE.csv');
	
	/*$line = 'ИНН                                       7226003278';
	//$pares = preg_split("/[ ]{2,}/", $line);
	//print_r($pares);
	//[\.\,\-\_\'\"\@\?\!\:\$\w\s]+
	if (preg_match('/[0-9]+\s+/', $line)===1){
		echo 'MATCH!';
	}
	*/
	//exec(sprintf('convert %s %s.bmp',$response['captchaFile'],$dir.$id));
	
?>
