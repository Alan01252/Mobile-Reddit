<?php 
require_once('../php-cache/Source/Cache.php');
use Cache\Cache;

$uri = $_POST['uri'];
$redditid = $_POST['redditid'];

switch($_POST['method'])
{
	case "json":
		$ch=curl_init();
		curl_setopt($ch,CURLOPT_URL,$uri);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$page = curl_exec($ch);
		$info = curl_getinfo($ch);
		curl_close($ch);
		echo $page;
		break;
	case "readability":
		$c = new Cache('./', array('prefix' => 'pageReader'));
		$content = $c->retrieve($redditid);
		if (!$content)
		{
			require_once '../php-readability/Readability.php';
			header("Cache-Control: must-revalidate, max-age=12000");
			header("Vary: Accept-Encoding");
			header('Content-Type: text/plain; charset=utf-8');
			$url = $uri;
			$html = file_get_contents($url);
			if(strpos($url,"imgur"))
			{
				$url .= ".png";
				$content = "<img src=".$url.">";
			}
			elseif (function_exists('tidy_parse_string')) 
			{
	       		$tidy = tidy_parse_string($html, array('indent'=>true), 'UTF8');
	        	$tidy->cleanRepair();
	        	$html = $tidy->value;
	        	$readability = new Readability($html, $url);
	        	$result = $readability->init();
	        	echo $readability->getTitle()->textContent, "\n\n";
	       		 $content = $readability->getContent()->innerHTML;
	        	// if we've got Tidy, let's clean it up for output
	       		 if (function_exists('tidy_parse_string')) 
	       		 {
	                $tidy = tidy_parse_string($content, array('indent'=>true, 'show-body-only' => true), 'UTF8');
	                $tidy->cleanRepair();
	                $content = $tidy->value;
	       		}
	       		
			}
			else
			{
				echo "dohio!";
			}
			$c->store($redditid, $content);
		}
		echo $content;
		break;
}
?>