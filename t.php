<?php
use mustache\Mustache\Engine;
include 'vendor/autoload.php';
/*
$mustache = new Mustache_Engine;
$tmp_data = file_get_contents("/home/andrey/www/htdocs/law_tmpl/output/cur_tmpl.xml");
$data = '{"Отправитель":"7777777","СуммаОсновногоДолга":10000,"ВидШтрафныхСанкций":"Проценты","ПроцентыСт395":{"ДатаНачалаПросрочки":"14/03/2019","ДатаРасчета":"14/03/2019","СуммаДолга":5000,"ИзменениеСуммыДолга":[{"ДатаИзменения":"14/03/2019","СуммаИзменения":"1000"},{"ДатаИзменения":"16/03/2019","СуммаИзменения":"5555"}]}}';
$data_j = json_decode($data,TRUE);
echo $mustache->render($tmp_data,$data_j);
*/


function removeTags($str) {  
	$str = preg_replace("#<(.*)/(.*)>#iUs", "", $str);
	return $str;
}

$string = '<text:p text:style-name="P3">
							<text:span text:style-name="T15">ИНН </text:span>
							<text:span text:style-name="T18">{{</text:span>
							<strong>П</strong>олучатель.ИНН}}</text:span>
							<text:span text:style-name="T19">,</text:span>
						</text:p>';
//'/[\d\D]*{{[\d\D]+->[\d\D]+}}[\d\D]*/'
/*
preg_match_all('/{{([\d\D]*<[\d\D]+?)}}/s',$string,$matches);
if(count($matches)&&count($matches[0])){
	//throw new Exception('Тэги между параметрами: '.implode(' ',$matches[0]));
	foreach($matches[0] as $m){
		echo $m.' => '.removeTags($m).'</br>';
	}
}
*/
//var_dump($matches);
//foreach($out[0] as $m){	
//	$string = str_replace($m,str_replace('->','.',$m),$string);
//	
//}
//echo $string;
//"/^[a-zA-Zа-яА-Я]+$/"

//$tmp_xml = @simplexml_load_string(file_get_contents('content_table.xml'));
/*if(!$tmp_xml){
	throw new Exception('Error parsing XML content!');
}*/

function HandleXmlError($errno, $errstr, $errfile, $errline){
	return TRUE;
}

function find_node(&$xml,&$cont,$paramName){
	$xpath = new DOMXPath($xml);
	$node_l = $xpath->query("//*[text()='".$paramName."']");

	if(isset($node_l) && $node_l->length>0){
		$node = $node_l->item(0);
		while($node->parentNode!==$cont){
			$node = $node->parentNode;
		}
		return $node;
	}	
}

set_error_handler('HandleXmlError');
$xml = new DOMDocument('1.0', 'utf-8');
$xml->loadXML('<?xml version="1.0" encoding="utf-8"?>'.file_get_contents('content_table.xml'));
restore_error_handler();

$root = $xml->firstChild;
$cont = NULL;
for($i=0;$i<$root->childNodes->length;$i++){
	if($root->childNodes->item($i)->nodeName=='office:body'){
		for($k=0;$k<$root->childNodes->item($i)->childNodes->length;$k++){			
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

$par = 'РасчетПени';
$n_s = find_node($xml,$cont,'{{#'.$par.'}}');
$n_e = find_node($xml,$cont,'{{/'.$par.'}}');
if(!isset($n_e)){
	throw new Exception("Ошибка разбора содержимого XML: не найдено окончание параметра '".$par."'!");
}
$table_s = $n_s->nextSibling; 
while($table_s->nodeName!='table:table'){//||$table_s!==$n_e
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

$repl_tags = [];
array_push($repl_tags,$par);

//target table modification
$table_t->appendChild($xml->createElement( "patReplaceTag", '{{#'.$par.'}}' ));//start

$table_name = $table_t->getAttribute('table:style-name');
for($i=0;$i<$table_s->childNodes->length;$i++){
	if($table_s->childNodes->item($i)->nodeName=='table:table-row'){			
		$row = $table_s->childNodes->item($i);
		for($k=0;$k<$row->childNodes->length;$k++){
			if($row->childNodes->item($k)->nodeName=='table:table-cell'){
				$row->childNodes->item($k)->removeAttribute('table:style-name');
			}
		}
		$table_t->appendChild($row);
	}
}
$table_t->appendChild($xml->createElement( "patReplaceTag", '{{/'.$par.'}}' ));//end

$table_s->parentNode->removeChild($table_s);
$n_s->parentNode->removeChild($n_s);
$n_e->parentNode->removeChild($n_e);

$res = preg_replace('/^.+\n/', '', $xml->saveXML());//first line
foreach($repl_tags as $t){
	$res = str_replace('<patReplaceTag>{{#'.$t.'}}</patReplaceTag>','{{#'.$t.'}}',$res);
	$res = str_replace('<patReplaceTag>{{/'.$t.'}}</patReplaceTag>','{{/'.$t.'}}',$res);
}
file_put_contents('content_table_mod.xml',$res);
?>
