<?php
	header("Cache-Control: must-revalidate, max-age=12000");
	header("Vary: Accept-Encoding");
?>
<!DOCTYPE html>
<html>
<head>
<link rel=stylesheet href="./styles/style-comments.css"/>
<link href="http://code.jquery.com/mobile/latest/jquery.mobile.min.css" rel="stylesheet" type="text/css" />
<script src="http://code.jquery.com/jquery-1.6.1.min.js"></script>
<script src="http://code.jquery.com/mobile/latest/jquery.mobile.min.js"></script>
<script src="./mobileReddit.js"></script>
</head>
<body>
	<div data-role=page id=frontPage>
	<div data-role=header>
	<h1>Mobile Reddit</h1>
	<div data-role=navbar>
		<ul id=redditsNavBar>
			<li><a href="#" class=ui-btn-active>Frontpage</a></li>
			<li><a href="#">Programming</a></li>
			<li><a href="#">Minecraft</a></li>
			<li><a href="#">AskScience</a></li>
			<li><a href="#">TrueReddit</a></li>
		</ul>
	</div>
	</div>
	<div data-role=content>
		<ul id=stories data-role=listview data-inset=true data-theme=c data-dividertheme=b>
		</ul>
	</div>
	<div data-role=footer>
		<h4></h4>
	</div>
</div>

<div data-role=page id=imagePage>
<div data-role=header>
<h1>Mobile Reddit</h1>
<a href="#commentPage" data-icon=arrow-r class=ui-btn-right>Comments</a>
</div>
<div data-role=content>
<img id=pageImage src=""></img>
</div>
<div data-role=footer>
<h4></h4>
</div>
</div>

<div data-role=page id=videoPage>
<div data-role=header>
<h1>Mobile Reddit</h1>
</div>
<div data-role=content>
</div>
<div data-role=footer>
<h4></h4>
</div>
</div>

<div data-role=page id=documentPage>
<div data-role=header>
<h1>Mobile Reddit</h1>
<a href="#commentPage" data-icon=arrow-r class=ui-btn-right>Comments</a>
</div>
<div id=pageDocument" data-role=content>
	<div id="documentContents" class="ui-body ui-body-d">
	</div>
</div>
<div data-role=footer>
<h4>Page Footer</h4>
</div>
</div>

<div data-role=page id=commentPage>
<div data-role=header>
<h1>Mobile Reddit: Comments</h1>
</div>
<div id=comments data-role=content class="ui-grid-c">
</div>
<div data-role=footer>
<h4></h4>
</div>
</div>
</body>
</html>
