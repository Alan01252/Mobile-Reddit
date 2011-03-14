var globals = {
	REDDIT_URI:'http://www.reddit.com/'
	,PAGE_READER:'http://boilerpipe-web.appspot.com/extract?'
};

function aRedditStory(){
	this.id = null;
	this.redditid = null;
	this.url = null;
	this.title = null;
	this.ups = null;
	this.num_comments = null;
	this.permalink = null;
	this.selftext = null;
};

var redditFrontPageReader = {
	
	selectedRedditStory:null,
	
	_redditStories:[],
	_subReddit:"",
	
	read:function(){
		_redditFrontPageReader = this;
		$('#stories li').remove();
		$.mobile.pageLoading();
		var callBacks = [this.populateRedditStories];
		var readPage = globals.REDDIT_URI;
		if(this._subReddit.length > 0){
			readPage += "/r/"+this._subReddit+"/";
		}
		readPage +=".json";
		$.ajax({type:"post",dataType:"jsonp",url:readPage,jsonp:'jsonp',success:callBacks});
	},
	
	populateRedditStories:function(redditData){
		for(var i=0;i < redditData.data.children.length; i++){
			var rs = new aRedditStory;
			rs.id = i;
			rs.redditid = redditData.data.children[i].data.id;
			rs.url = redditData.data.children[i].data.url;
			rs.title = redditData.data.children[i].data.title;
			rs.ups = redditData.data.children[i].data.ups;
			rs.num_comments = redditData.data.children[i].data.num_comments;
			rs.permalink = redditData.data.children[i].data.permalink;
			rs.selftext = redditData.data.children[i].data.selftext;
			_redditFrontPageReader._redditStories.push(rs);
			urlParts = rs.url.split(".");
			switch(urlParts[urlParts.length-1]){
				case "png":
				case "gif":
				case "jpg":
					$('<li>',{
								html:'<a href="#imagePage">'+rs.title+'</a><p class="ui-li-count">'+rs.num_comments+'</p></li>',
								data:rs,
								click:function(){
									_redditFrontPageReader.selectedRedditStory = $(this).data();
									$("#pageImage").attr("src",_redditFrontPageReader.selectedRedditStory.url);
								}
							}
					).appendTo("#stories");
					break;
				default:
					$('<li>',{
							html:'<a href="#documentPage">'+rs.title+'</a><p class="ui-li-count">'+rs.num_comments+'</p></li>',
							data:rs,
							click:function(){
								_redditFrontPageReader.selectedRedditStory = $(this).data();
								_redditFrontPageReader.readStory();
							}
						}
					).appendTo("#stories");
					break;
			}
		}
		$.mobile.pageLoading(true);
		$("#stories").listview("refresh");
	},
	
	readStory:function(){
		$.mobile.pageLoading();
		var urlToRead = _redditFrontPageReader.selectedRedditStory.url;
		if(_redditFrontPageReader.selectedRedditStory.selftext.length > 0){
			urlToRead = urlToRead+".json";
			$.ajax({type:"post",dataType:"jsonp",url:urlToRead,jsonp:'jsonp',success:this.displaySelfPost});
		}
		else{
			var url = globals.PAGE_READER+"&url="+encodeURIComponent(_redditFrontPageReader.selectedRedditStory.url);
			
			$.ajax({type:"get",dataType:"html",url:globals.PAGE_READER,data:readPage,success:this.displayStory});
		}
	},
	
	setSubReddit:function(subRedditName){
		if(subRedditName == "Frontpage"){
			subRedditName="";
		}
		_redditFrontPageReader._subReddit = subRedditName;
	},
	
	displayStory:function(storyData){
		$("#pageDocument").html(storyData);
		$.mobile.pageLoading(true);
	},
	
	displaySelfPost:function(redditData){
		var selfPostText = redditData[0].data.children[0].data.selftext;
		$("#pageDocument").html(selfPostText);
		$.mobile.pageLoading(true);
	}
};

function aRedditStoriesComment(){
	this.name = null;
	this.parent = null;
	this.body = "";
	this.children = [];
	this.author = null;
	
	this.cssClass= "";
	this.isVisible = false;
	
	this.display = function(overrideAppendTo){
		if(this.isVisible){
			return;
		}
		if(!this.body || this.body.length == 0){
			return;
		}
		this.isVisible = true;
		var appendTo = "#aRedditStoriesComment";
		if(overrideAppendTo){
			appendTo = overrideAppendTo;
		}
		$("#aRedditStoriesComment").clone(true).attr('id',"aRedditStoriesComment"+this.name).data("aRedditStoriesComment",this).insertAfter(appendTo).show();
		$("#aRedditStoriesComment"+this.name+" .comment p").html(this.body);
		$("#aRedditStoriesComment"+this.name+" .commentFooter p").html(this.author);
		if(this.parent){
			if(this.parent.cssClass !== "reply"){
				$("#aRedditStoriesComment"+this.name+" .comment").addClass("reply");
				$("#aRedditStoriesComment"+this.name+" .commentFooter").addClass("footerReply");
				this.cssClass = "reply";
			}else{
				this.cssClass = "";
			}
		}
	};
	
	this.displayChildren = function(){
		for(var i=this.children.length-1;i >=0;i--){
			this.children[i].display("#aRedditStoriesComment"+this.name);
		}
	};
};

var redditStoryCommentReader = {
	_redditComments:[],
	previousPermalink:null,
	read:function(){
		_redditStoryCommentReader = this;
		_redditStoryCommentReader._redditComments = [];
		$(".aRedditStoriesComment").remove();
		
		$('<div id="aRedditStoriesComment" class="aRedditStoriesComment"><div class="comment"><p>&nbsp;</p></div><div class="commentFooter"><p>&nbsp;</p></div></div>')
			.appendTo('#comments')
			.click(function(){
				var aRSC = $(this).data("aRedditStoriesComment");
				aRSC.displayChildren();
			})
			.hide();
			
		$.mobile.pageLoading();
		var callBacks = [this.populateRedditComments];
		var readPage = globals.REDDIT_URI+redditFrontPageReader.selectedRedditStory.permalink;
		readPage+=".json";
		$.ajax({type:"post",dataType:"jsonp",url:readPage,data:readPage,jsonp:'jsonp',success:callBacks});
	},
	
	populateRedditComments:function(redditData){
		var aRedditStoriesComments = redditData[1].data.children;
		for(var i=0;i < aRedditStoriesComments.length; i++){
			var rsc = new aRedditStoriesComment;
			rsc.body = aRedditStoriesComments[i].data.body;
			rsc.name = aRedditStoriesComments[i].data.name;
			rsc.author = aRedditStoriesComments[i].data.author;
			_redditStoryCommentReader.populateChildren(rsc,aRedditStoriesComments[i].data.replies);
			_redditStoryCommentReader._redditComments.push(rsc);
		}
		_redditStoryCommentReader.displayComments();
	},
	
	populateChildren:function(parent,aRedditStoriesCommentJSONReplies){
		if(!aRedditStoriesCommentJSONReplies){
			return;
		}
		for(var i=0;i < aRedditStoriesCommentJSONReplies.data.children.length; i++){
			var rsc = new aRedditStoriesComment;
			rsc.parent = parent;
			rsc.body = aRedditStoriesCommentJSONReplies.data.children[i].data.body;
			rsc.name = aRedditStoriesCommentJSONReplies.data.children[i].data.name;
			rsc.author = aRedditStoriesCommentJSONReplies.data.children[i].data.author;
			_redditStoryCommentReader.populateChildren(rsc,aRedditStoriesCommentJSONReplies.data.children[i].data.replies);
			parent.children.push(rsc);
		}
	},
	
	displayComments:function(){
		for(var i= _redditStoryCommentReader._redditComments.length-1 ; i >= 0; i--){
			_redditStoryCommentReader._redditComments[i].display();
		}
		$.mobile.pageLoading(true);
	}
};


//Set up name space
if (typeof NAMESPACE == 'undefined') NAMESPACE = {};
if (typeof NAMESPACE.Pages == 'undefined') NAMESPACE.Pages = {};




// Map pageshow event to dispatcher
jQuery("div[data-role*='page']").live('pageshow', function(event, ui) {
        var thisId=$(this).attr("data-url");
        thisId = thisId.replace(/\.html$/gi,"");
        if (typeof NAMESPACE.Pages[thisId] == 'function')  {
                NAMESPACE.Pages[thisId].call(this);
        }
});

// Create one of these per PAGEID
NAMESPACE.Pages.frontPage = function() {
	var pageContext = this;
	if(redditFrontPageReader._redditStories.length == 0){
		redditFrontPageReader.read();
		$('#redditsNavBar li').click(function(e){
			redditFrontPageReader.setSubReddit($(this).text());
			redditFrontPageReader.read();
		});
	}
};

NAMESPACE.Pages.imagePage = function() {
	var pageContext = this;

};

NAMESPACE.Pages.videoPage = function() {
	var pageContext = this;
};

NAMESPACE.Pages.commentPage = function(){
	var pageContext = this;
	redditStoryCommentReader.read();
};





