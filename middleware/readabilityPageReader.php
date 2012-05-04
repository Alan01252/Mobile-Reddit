<?php
use Cache\Cache;
require_once '../libs/php-cache/Source/Cache.php';

/**
 * Wrapper for readabilty. Uses cache to speed up request returns.
 * @author alan
 *
 */
class readabilityPageReader extends pageReader
{
	private $_cache;
	
	public function __construct($uri, $redditid)
	{
		parent::__construct($uri, $redditid);
		$this->setHeaders();
		$this->setCache();
	}
	/**
	 * 
	 * Set HTML headers, increases cache
	 */
	private function setHeaders()
	{
		header("Cache-Control: must-revalidate, max-age=12000");
		header("Vary: Accept-Encoding");
		header('Content-Type: text/plain; charset=utf-8');
	}
	/**
	 * 
	 * Register the cache object
	 */
	private function setCache()
	{
		$this->_cache = new Cache('./', array('prefix' => 'pageReader'));
	}
	
	/**
	 * 
	 * Check if we already have this page in cache.
	 * @return if in cache return.
	 */
	private function inCache()
	{
		$content = $this->_cache->retrieve($this->redditid); //faster if we have it in cache already
		return $content;
	}
	/**
	 * Read the html page and parse in readability.
	 * @see pageReader::read()
	 */
	public function read()
	{
		$readability = null;
		
		$content = $this->inCache();
		if (!$content)
		{
			if(strpos($this->uri,"imgur")) //assume image.
			{
				$url = $this->uri.".png";
				$content = "<img src=".$url.">";
			}
			elseif (function_exists('tidy_parse_string'))  //parse html
			{
				$html = file_get_contents($this->uri);
	       		
				$tidy = tidy_parse_string($html, array('indent'=>true), 'UTF8');
	        	$tidy->cleanRepair();
	        	
	        	$html = $tidy->value;
	        	
	        	$readability = new Readability($html, $url);
	        	$result = $readability->init();
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
				echo "Could not parse content type";
			}
			$this->_cache->store($this->redditid, $content);
		}
		if($readability != null)
		{
			echo $readability->getTitle()->textContent, "\n\n";
		}
		echo $content;
	}
	
}