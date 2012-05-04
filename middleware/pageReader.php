<?php 
/**
 * @author Alan Hollis
 */
require_once '../libs/php-readability/Readability.php';

require_once 'readabilityPageReader.php';
require_once 'jsonPageReader.php';

$pageReader = null;
$uri = $_POST['uri'];
$redditid = $_POST['redditid'];

switch($_POST['method'])
{
	case "json":
		$pageReader = new jsonPageReader($uri, $redditid);
		break;
	case "readability":
		$pageReader = new readabilityPageReader($uri, $redditid);
		break;
}

$pageReader->read();

/**
 * Wrapper for reading web pages.
 * @author alan
 */
abstract class pageReader
{
	public $uri;
	public $redditid;

	public function __construct($uri,$redditid)
	{
		$this->uri = $uri;
		$this->redditid = $redditid;
	}
	/**
	 * 
	 * Reads the uri
	 * @return output determined on content of uri
	 */
	abstract function read();
}
?>