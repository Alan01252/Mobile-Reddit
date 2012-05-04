<?php
/**
 * Read json content
 * @author alan
 */

class jsonPageReader extends pageReader
{
	/**
	 * If it's json read the json and output it.
	 * @see pageReader::read()
	 */
	public function read()
	{
		$ch=curl_init();
		curl_setopt($ch,CURLOPT_URL,$uri);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		$page = curl_exec($ch);
		$info = curl_getinfo($ch);
		curl_close($ch);
		echo $page;
	}
}