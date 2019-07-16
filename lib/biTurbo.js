"use strict";
// INIT //
var biTurboProps = {
	debug : true ,
	pauseAll : false ,
	minDelay : 0.15 ,
	instantDelay : 0.1 ,
	checkLoadedInterval : 500 
};

if(typeof biTurbo === 'undefined'){
	var biTurbo = {};
}

biTurbo.proto = {
	debug : false,
	pauseThis : false,
	loop : 0 ,
	height : 0 ,
	width : 0 ,
	insertionPoint : "" ,
	currentFrameIndex : 0 ,
	elementsCreated : [] ,
	limitToWaitPreload : 5 ,
	banner_id : "" ,
	eventBannerLoadedId : "" ,
	readyEvent : null ,
	readyToPlay : false ,
	alreadyStarted : false ,
	addImagesToPreloadQueue : true ,
	preloadCheckerInterval : null
};


biTurbo.proto.init = function (banner_id){
	var style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	this.log("\n                               biTurbo.js \n \n                                  by \n \n                         Ángel Quijada Álvarez \n \n   A lightweight JS animation library for fast banner ads development! \n ");
	this.createTween("default_instant",biTurboProps.instantDelay,5); 
	banner_id = this.defaultParameter(banner_id,"defaultBanner");
	this.banner_id=banner_id;
	this.eventBannerLoadedId = "loadedEnough_"+this.banner_id;
	if(typeof(Event) === "function") {
		this.readyEvent = new Event(this.eventBannerLoadedId);
	}else{ //IE fix
    	this.readyEvent = document.createEvent('Event');
    	this.readyEvent.initEvent(this.eventBannerLoadedId, true, true);
	}
	this.imagesToLoad = [];
	this.timeLine = [];
	this.cssLogTxt = "";
	this.htmlLogTxt = "";
};

// CSS CLASSES //

biTurbo.proto.writeClass = function (name , rules){
	var style = document.createElement('style');
	style.type = 'text/css';
	name = this.defaultParameter(name,"");
	rules = this.defaultParameter(rules,"");
	document.getElementsByTagName('head')[0].appendChild(style);
	this.log("new CSS class : " + name + " : " + rules);
	style.sheet.insertRule(name + '{' + rules + '}' ,0);
	this.printCSS(""+name + '{' + rules + '}');
};

biTurbo.proto.createClass = function (name,style){
	var temp_rules = "";
	var temp_name = "";
	var tempArguments = {
		temp_class : null ,
		temp_CSS : null
	};
	if(arguments.length<1){
		this.log("Error: createClass: no parameters");
		return;
	}
	tempArguments.temp_class = arguments[0];
	tempArguments.temp_CSS = arguments[1];
	if(this.isParameterDefined(tempArguments.temp_CSS)){
		temp_rules += tempArguments.temp_CSS;
	}
	temp_name = "." + tempArguments.temp_class;
	this.writeClass(temp_name , temp_rules);
};

biTurbo.proto.applyClass = function (element,tempClassName){
	var temp_classNameString = "";
	element = this.defaultParameter(element,null);
	if(element !== null){
		tempClassName = this.defaultParameter(tempClassName,"");
		element = this.getDomElement(element);	
		//element.classList.add(tempClassName);
		temp_classNameString = element.className;
		element.className = temp_classNameString + " " + tempClassName;

	}else{
		var i;
		var elementCount = this.elementsCreated.length;
		tempClassName = this.defaultParameter(tempClassName,"");

		for(i = 0 ; i < elementCount ; i++){
			element=this.getDomElement(this.elementsCreated[i]);
			this.applyClass(element , tempClassName);
		}	
	}
};

biTurbo.proto.tweenClass = function (element , tempClassName , delay , tween  ){
	var temp_name;
	var temp_tween = "";
	var context = this;

	delay = this.defaultParameter(delay,biTurboProps.instantDelay);
	delay += biTurboProps.minDelay;
	tween = this.defaultParameter(tween,"default_instant");
	temp_tween = "tween_"+tween;
	element = this.getDomElement(element);	
	temp_name = element.id;

	setTimeout(function(){
		if(biTurboProps.pauseAll === false && context.pauseThis === false){
			element.className = "";		
			context.applyClass(element,temp_name);
			context.applyClass(element,tempClassName);
			context.applyClass(element,temp_tween);
		}
	}, delay * 1000 );
};

biTurbo.proto.animateClass = function (element , keyFramesArray ){
	var i = 0;
	var temp_keyFrameCount = 0;
	var temp_className = "";
	var temp_delay = 0;
	var temp_lastDelay = 0;
	var temp_tween = "";
	var context = this;


	element = this.getDomElement(element);	
	if(keyFramesArray === undefined || keyFramesArray.length < 1 ){
		this.log("animateClass error: no keyframes array");
		return;
	}
	temp_keyFrameCount = keyFramesArray.length;
	this.log("animateClass keyframes for " + element.id + ": "+temp_keyFrameCount);

	for(i = 0 ; i < temp_keyFrameCount ; i++){
		temp_className = keyFramesArray[i][0];

		if(this.isParameterDefined(keyFramesArray[i][1])===true){
			temp_delay = keyFramesArray[i][1];
			temp_delay -= biTurboProps.minDelay;
		}else{
			temp_delay = temp_lastDelay;
		}
		temp_delay += biTurboProps.minDelay;
		if(temp_delay === temp_lastDelay){
			temp_delay += biTurboProps.minDelay;
		}
		temp_delay = Math.round(temp_delay * 100) / 100;
		temp_lastDelay = temp_delay;
	
		if(this.isParameterDefined(keyFramesArray[i][2])===true){
			temp_tween = keyFramesArray[i][2];
		}else{
			temp_tween = "default_instant";
		}
			context.log("animateClass keyframe["+ i +"]: " + temp_className +" , "+ temp_delay + " , " + temp_tween);
			context.tweenClass(element , temp_className , temp_delay , temp_tween);
	}
};

biTurbo.proto.clearClass = function (element){
	var temp_name;
	var i = 0;
	var elementCount;
	switch(typeof element){
		case "string":
			this.log("ClearClass from "+element);
			element = this.getDomElement(element);	
			temp_name = element.id;
			element.className = "";
			this.applyClass(element,temp_name);
		break;

		case "object":
			elementCount = element.length;
			for(i = 0 ; i < elementCount ; i++){
				this.clearClass(element[i]);
			}
		break;
		default:
			this.log("clearClass arguments error");
		break;
	}
};

// CSS helper //

biTurbo.proto.CSS = function (parameters){ // expected parameters: a (opacity) , x (horizontal coordinate) , y (vertical coordinate) , w (width) , h (height), r (rotation) , s (scale), sx (horizontal scale), sy  (vertical scale)
	var temp_rules = "";
	var temp_scaleX = 1;
	var temp_scaleY = 1;
	var temp_angle = 0;
	var bool_tMat = false;
	var a = arguments[0].a;
	var l = arguments[0].l;
	var t = arguments[0].t;
	var x = arguments[0].x;
	var y = arguments[0].y;
	var w = arguments[0].w;
	var h = arguments[0].h;
	var r = arguments[0].r;
	var s = arguments[0].s;
	var sx = arguments[0].sx;
	var sy = arguments[0].sy;

	if(this.isParameterDefined(a) === true){
		temp_rules += 'opacity: '+ a + ' ; ';
	}
	if(this.isParameterDefined(w) === true){
		temp_rules += 'width: '+ w + 'px ; ';
	}
	if(this.isParameterDefined(h) === true){
		temp_rules += 'height: '+ h + 'px ; ';
	}
	if(this.isParameterDefined(l) === true){
		temp_rules += 'left: '+ l + 'px ; ';
	}
	if(this.isParameterDefined(t) === true){
		temp_rules += 'top: '+ t + 'px ; ';
	}
	if(this.isParameterDefined(x) === true){
		bool_tMat = true;
	}else{
		x = 0;
	}
	if(this.isParameterDefined(y) === true){
		bool_tMat = true;
	}else{
		y = 0;
	}
	if(this.isParameterDefined(r) === true){
		bool_tMat = true;
		temp_angle=r * (Math.PI/180);
	}
	if(this.isParameterDefined(s) === true){
		bool_tMat = true;
		temp_scaleX = s;
		temp_scaleY = s;
	}
	if(this.isParameterDefined(sx) === true){
		bool_tMat = true;
		temp_scaleX = sx;
	}
	if(this.isParameterDefined(sy) === true){
		bool_tMat = true;
		temp_scaleY = sy;
	}
	if(bool_tMat==true){
		temp_rules += 'transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; ';
		temp_rules += '-ms-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; ';
		temp_rules += '-webkit-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; ';
		temp_rules += '-moz-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; ';
	}
	return(temp_rules);
};

// HTML //

biTurbo.proto.createBorder = function (color,borderWidth){
	var tempStyle = "border-style: solid; border-color: "+color+" ; border-width: "+borderWidth+"px";
	var tempWidth = this.width-(borderWidth*2);
	var tempHeight = this.height-(borderWidth*2);
	this.createDivElement("border_frame" , "" , (("opacity:1 ; left:0px ; top:0px ; background-color:transparent ; width:" + tempWidth + "px ; height:" + tempHeight + "px ; "+tempStyle) ) , true);
};

biTurbo.proto.createDivElement = function (name , fileNameString , style, excludeFromElements){
	var temp_rules = 'display:block ; position:absolute ; ';
	var temp_img_name;	
	var temp_name;
	var tempInsertionPoint;
	var temp_divEnding;
	var tempHtml = '';
	
	name = this.defaultParameter(name,"");
	style = this.defaultParameter(style,"");
	excludeFromElements = this.defaultParameter(excludeFromElements,false);
	temp_img_name = "img_preload_" + name;
	temp_name = "." + name;

	if(this.insertionPoint === null){
		this.log(" Error: missing this instance insertionPoint valur. Should be a string pointing to a div id element present in the HTML");
		return;
	}
	tempInsertionPoint = document.getElementById(this.insertionPoint);
	
	if(fileNameString === ""){ //solid color
		temp_rules += ' overflow: hidden; ';
		temp_divEnding = '</div>';
	}else{ //image
		temp_rules += ' background: url('+ fileNameString + ') ; ';
		temp_divEnding = '<img id="' + temp_img_name + '" src="' + fileNameString + '" style="visibility: hidden ; display : block;" /></div>';
		if(this.addImagesToPreloadQueue === true){
			this.addImagesToLoad(this , temp_img_name , fileNameString);
		}
	}
	temp_rules += style;
	this.writeClass(temp_name, temp_rules);
	tempHtml = '<div id="' + name + '" class="' + name + '">' + temp_divEnding;
	tempInsertionPoint.innerHTML += tempHtml;
	this.printHTML(tempHtml);
	if(excludeFromElements === false){
		this.elementsCreated.push(name);
	}
};

biTurbo.proto.createTextElement = function (name , textContent, textStyle){
	var temp_nameContainerDiv = name+"_container";
	var back_insertionPoint = this.insertionPoint;
	var tempInsertionPoint;
	var temp_divEnding = '</p>';
	var temp_name = "."+name;
	var tempHtml = '';
	
	this.createDivElement(temp_nameContainerDiv,"","",true);
	this.insertionPoint = temp_nameContainerDiv;
	tempInsertionPoint=document.getElementById(this.insertionPoint);
	
	this.writeClass(temp_name, textStyle); 
	tempHtml = '<p id="' + name + '" class="' +  name + '">' + textContent + temp_divEnding;
	tempInsertionPoint.innerHTML += tempHtml;
	this.printHTML(tempHtml);

	this.insertionPoint = back_insertionPoint;
	this.elementsCreated.push(name);
};

biTurbo.proto.createSpriteSheet = function (ssObject){
	var tempRow = 0;
	var tempCol = -1;
	var tempPositionX = 0;
	var tempPositionY = 0;
	var tempFrame = 0;
	var temp_nameContentDiv = ssObject.htmlElementName +"_content";
	var temp_containerStyle = "width : "+ ssObject.frameWidth + "px; height : " + ssObject.frameHeight + "px;  overflow:hidden";
	var back_insertionPoint = this.insertionPoint;
	ssObject.framesArray = [];

	this.createDivElement(ssObject.htmlElementName,"", temp_containerStyle,false);
	this.insertionPoint = ssObject.htmlElementName;
	this.createDivElement(temp_nameContentDiv,ssObject.source," display : block; ",true);
	this.insertionPoint = back_insertionPoint;
	
	for (tempFrame = 0 ; tempFrame < ssObject.totalFrames ; tempFrame++){
		tempCol++;
		if(tempCol>ssObject.frameColumns-1){
			tempRow ++;
			tempCol -= ssObject.frameColumns;
		}
		tempPositionX=-tempCol*ssObject.frameWidth;
		tempPositionY=-tempRow*ssObject.frameHeight;
		ssObject.framesArray.push([tempPositionX , tempPositionY]);
		if(ssObject.verbose === true){
			this.log("Spritesheet building frame table: "+ tempFrame + "  x: " + ssObject.framesArray[tempFrame][0]+ " y: "+ ssObject.framesArray[tempFrame][1] );
		}
	}
};

biTurbo.proto.nextFrameSpriteSheet = function (context,ssObject,functionName){
	var temp_transformMatrixStyle = "";
	var temp_nameContentDiv = ssObject.htmlElementName+"_content";
	var direction=ssObject.direction;



	if(direction>0){
		if(ssObject.currentFrame<ssObject.framesArray.length-direction){
			ssObject.currentFrame+=direction;
		}else{
			ssObject.currentFrame = 1;
		}
	}else{
		if(ssObject.currentFrame+direction>1){
			ssObject.currentFrame+=direction;
		}else{
			ssObject.currentFrame = ssObject.framesArray.length;
		}
	}
	ssObject.framesToPlay--;
	if(ssObject.framesToPlay>1){
		ssObject.positionX = ssObject.framesArray[Math.round(ssObject.currentFrame)-1][0];
		ssObject.positionY = ssObject.framesArray[Math.round(ssObject.currentFrame)-1][1];
		temp_transformMatrixStyle=context.CSS({x:ssObject.positionX , y:ssObject.positionY , r:ssObject.framesToPlay});
		document.getElementById(temp_nameContentDiv).style.transform= "translate(" + ssObject.positionX + "px," + ssObject.positionY +"px)";
	}else{
		context.stopSpriteSheet(context,ssObject,functionName);
	}
};

biTurbo.proto.playSpriteSheet = function (ssObject,delay,initFrame,framesToPlay, direction, functionName){
	var context = this;
	direction = this.defaultParameter(direction,1);
	delay = this.defaultParameter(delay , 0);
	ssObject.currentFrame=initFrame;
	ssObject.framesToPlay=framesToPlay;
	ssObject.direction=direction;
	setTimeout(function(){
		ssObject.temporalInterval=setInterval (context.nextFrameSpriteSheet , ssObject.frameDuration , context , ssObject , functionName);
	},delay*1000);
};

biTurbo.proto.stopSpriteSheet = function (context,ssObject,functionName){
	clearInterval(ssObject.temporalInterval);
	if(functionName !== undefined){
		context.log("should be executed function "+functionName);
		window[functionName]();
	}
};

//////////// TIME LINE ////////////

biTurbo.proto.setTimeLine = function (){
	this.timeLine = arguments;
	this.currentFrameIndex = 0;
};

biTurbo.proto.nextFrameInTimeLine = function (delay){
	var context = this;
	delay = this.defaultParameter(delay,0.1);
	setTimeout(function(){
		if(context.currentFrameIndex < context.timeLine.length){
			if(biTurboProps.pauseAll === false && context.pauseThis === false){
				context.log(context.currentFrameIndex+": "+context.timeLine[context.currentFrameIndex]);
				context.gotoFrame(context.timeLine[context.currentFrameIndex]);
				context.currentFrameIndex++;
			}
		}
	}, delay * 1000);
};

biTurbo.proto.gotoFrame = function (functionName){
	window[functionName]();
};

//////////// TWEEN ////////////

biTurbo.proto.createTween = function (name , duration , easing){
	var temp_name;
	var temp_rules;
	var temp_easing;
	easing = this.defaultParameter(easing,0);
	switch(easing){
		default:
		case 0: // linear
			temp_easing = "linear";
		break;
		case 1: // ease in
			temp_easing = "ease-in";
		break;
		case 2: //ease out
			temp_easing = "ease-out";
		break;
		case 3: // ease in out
			temp_easing = "ease-in-out";
		break;
		case 4: // bounce
			temp_easing = "cubic-bezier(0.175, 0.885, 0.32, 1.275)";
		break;
		case 5: // sstep
			temp_easing = "step-end";
		break;
	}
	temp_rules = "transition: all " + duration + "s " + temp_easing + " ; ";
	temp_rules += "-webkit-transition: all " + duration + "s " + temp_easing + " ; ";
	temp_rules += "-moz-transition: all " + duration + "s " + temp_easing + " ; ";
	temp_rules += "-o-transition: all " + duration + "s " + temp_easing + " ; ";
	temp_rules += "-ms-transition: all " + duration + "s " + temp_easing + " ; ";
	temp_name = ".tween_" + name;
	this.writeClass(temp_name, temp_rules);
};

//////////// BUTTONS AND CLICKTAG ////////////

biTurbo.proto.setBTN = function (element , userClickFunctionName , causeStop , endFrame){
	var context = this;
	element = this.getDomElement(element);
	causeStop = this.defaultParameter(causeStop , false);
	endFrame = this.defaultParameter(endFrame , "");
	element.addEventListener("click", function(){ 
		context.userClickedFunction(userClickFunctionName , causeStop , endFrame);
	});
	this.createClass("a_cursor", "cursor: pointer;");
	this.applyClass(element , "a_cursor");
};

biTurbo.proto.userClickedFunction = function (userClickFunctionName , causeStop , clickedFrame){
	if(causeStop === true){
		biTurboProps.pauseAll=true;
		this.pauseThis=true;
		window[clickedFrame](); // goto End Frame function
	}
	this.log('-- \n biTurboProps.pauseAll , this.pauseThis=true ; animation goes to frame "' + clickedFrame + '" and invokes function: ' + userClickFunctionName + '()');
	window[userClickFunctionName](); // user implemented clickTag function
};

////////////PRELOADER///////////

biTurbo.proto.preload = function (autoPlay,callBackFunction){
	autoPlay = this.defaultParameter(autoPlay , true);
	callBackFunction = this.defaultParameter(callBackFunction , "undefined");
	var context = this;
	addEventListener(context.eventBannerLoadedId,function(Event){
		clearInterval(context.preloadCheckerInterval);
		if(autoPlay === true){
			if(context.alreadyStarted === false){
				context.play(false,context);
			}
		}else{
			context.log("loaded, executing callback function :"+callBackFunction)
			if(callBackFunction !== "undefined"){
				window[callBackFunction]();
			}
		}
	});

	context.preloadCheckerInterval=setInterval(function(){
		context.checkLoaded(context);
	},biTurboProps.checkLoadedInterval);

	setTimeout(function(){ // timeout play
		if(context.alreadyStarted === false){
			context.log("preloader timeOut : "+context.eventBannerLoadedId);
			context.readyToPlay = true;
			this.dispatchEvent(context.readyEvent);
		}
	},this.limitToWaitPreload*1000);
};

biTurbo.proto.play = function (force , context){
	context = this.defaultParameter(context , this);
	context.log(context.banner_id + " : is ready to play : " + context.readyToPlay + "  forced play : "+force);
	if(context.readyToPlay === true || force === true){
		context.alreadyStarted = true;
		context.nextFrameInTimeLine();
	}
};

biTurbo.proto.addImagesToLoad = function(context , temp_img_name , fileNameString){
	var i = 0;
	var imagesToLoadCount = context.imagesToLoad.length;
	var alreadyOnTheList = false;
	for(i=0 ; i<imagesToLoadCount ; i++){
		if(context.imagesToLoad[i][1] === fileNameString){
			alreadyOnTheList=true;
		}
	}
	if(alreadyOnTheList === false){
		context.imagesToLoad.push([temp_img_name , fileNameString]);
	}
};

biTurbo.proto.checkLoaded = function (context){
	var i = 0;
	var temp_loaded = 0;
	var element;
	var imagesToLoadCount = context.imagesToLoad.length;
	for(i=0 ; i<imagesToLoadCount ; i++){
		element=context.getDomElement(context.imagesToLoad[i][0]);
		if(element.complete === true){
			temp_loaded++;
		}
	}
	context.log("imagesLoaded " + temp_loaded + '/' + imagesToLoadCount);
	if(temp_loaded === imagesToLoadCount && context.addImagesToPreloadQueue === false && context.readyToPlay === false) {
		context.readyToPlay = true;
		context.log("preload complete : "+context.eventBannerLoadedId);
		dispatchEvent(context.readyEvent);
	}
};

// tools //

biTurbo.proto.defaultParameter = function (parameter,value){//ie fix due to the lack of support for default parameters values in 
	if (parameter === undefined || parameter === null) {
		return(value);
	}else{
		return(parameter);
	}
};

biTurbo.proto.isParameterDefined = function (parameter){
	if (parameter === undefined || parameter === null) {
		return(false);
	}else{
		return(true);
	}
};

biTurbo.proto.log = function (contentLog){
	if(biTurboProps.debug === true && this.isParameterDefined(contentLog) === true && this.debug === true){
		console.log(this.banner_id+" : "+contentLog);
	}
};
biTurbo.proto.longLog = function (content){
	biTurboProps.debug = false;
	console.clear();
	var cssLines=[];
	var i = 0;
	cssLines=content.split("_biTurboLB_");
	for(i=0 ; i<cssLines.length ; i++){
		console.log(cssLines[i]);
	}
};

biTurbo.proto.printCSS = function (content){
	if(content !== undefined){
		this.cssLogTxt += "_biTurboLB_" +content;	
	}else{
		this.longLog(this.cssLogTxt);
	}
};

biTurbo.proto.printHTML = function (content){
	if(content !== undefined){
		this.htmlLogTxt += "_biTurboLB_" + content;	
	}else{
		this.longLog(this.htmlLogTxt);
	}
};


biTurbo.proto.getDomElement = function (element){
	if(typeof element.valueOf() === "string"){
		element = document.getElementById(element);
	}
	return(element);
};

biTurbo.create = function () { 
	return Object.create(this.proto);
};
