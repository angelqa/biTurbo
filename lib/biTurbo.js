"use strict";

var biTurboProps = {
	debug : true ,
	clicked : false ,
	minDelay : 0.15 ,
	instantDelay : 0.1
};

if(typeof biTurbo === 'undefined'){
	var biTurbo = {};
}

biTurbo.proto = {
	debug : false,
	loop : 0 ,
	height : 0 ,
	width : 0 ,
	insertionPoint : '' ,
	currentFrameIndex : 0 ,
	timeLine : [] ,
	imagesToLoad : [] ,
	elementsCreated : [] ,
	limitToWaitPreload : 25 ,
	addImagesToPreloadQueue : true
};

//////////// CSS CLASSES ////////////

biTurbo.proto.initStyle = function (){
	var style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	this.a_print("\n                               biTurbo.js \n \n                                  by \n \n                         Ángel Quijada Álvarez \n \n   A lightweight JS animation library for fast banner ads development! \n ");
	this.createTween("default_instant",biTurboProps.instantDelay,5); 
};

biTurbo.proto.writeClass = function (name , rules){
	var style = document.createElement('style');
	style.type = 'text/css';
	name = this.defaultParameter(name,"");
	rules = this.defaultParameter(rules,"");
	document.getElementsByTagName('head')[0].appendChild(style);
	this.a_print("new CSS class : " + name + " : " + rules);
	style.sheet.insertRule(name + '{' + rules + '}' ,0);
};

biTurbo.proto.createClass = function (name,style){
	var temp_rules = "";
	var temp_name = "";
	var tempArguments = {
		temp_class : null ,
		temp_CSS : null
	};
	if(arguments.length<1){
		this.a_print("Error: createClass: no parameters");
		return;
	}
	tempArguments.temp_class = arguments[0];
	tempArguments.temp_CSS = arguments[1];
	if(this.isParameterDefined(tempArguments.temp_CSS)){
		temp_rules += tempArguments.temp_CSS + ' ; ';
	}

	temp_name = "." + tempArguments.temp_class;
	this.writeClass(temp_name , temp_rules); // create id style
};

biTurbo.proto.applyClass = function (element,tempClassName){
	tempClassName = this.defaultParameter(tempClassName,"");
	element = this.getDomElement(element);	
	element.classList.add(tempClassName);
	
};

biTurbo.proto.applyClassToAll = function (tempClassName){
	var i;
	var element;
	var elementCount = this.elementsCreated.length;
	tempClassName = this.defaultParameter(tempClassName,"");

	for(i = 0 ; i < elementCount ; i++){
		element=this.getDomElement(this.elementsCreated[i]);
		this.applyClass(element , tempClassName)
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
		if(biTurboProps.clicked === false){
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
		this.a_print("animateClass error: no keyframes array");
		return;
	}
	temp_keyFrameCount = keyFramesArray.length;
	this.a_print("animateClass keyframes for " + element.id + ": "+temp_keyFrameCount);

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
		temp_delay=Math.round(temp_delay * 100) / 100
		temp_lastDelay = temp_delay;
	
		if(this.isParameterDefined(keyFramesArray[i][2])===true){
			temp_tween = keyFramesArray[i][2];
		}else{
			temp_tween = "default_instant";
		}
			context.a_print("animateClass keyframe["+ i +"]: " + temp_className +" , "+ temp_delay + " , " + temp_tween);
			context.tweenClass(element , temp_className , temp_delay , temp_tween);
	}
};

biTurbo.proto.multipleClearClass = function (elementsArray){
	var i = 0;
	var temp_elementsCount = elementsArray.length;

	for(i = 0 ; i < temp_elementsCount ; i++){
		this.clearClass(elementsArray[i]);
	}
}

biTurbo.proto.clearClass = function (element){
	var temp_name;
	element = this.getDomElement(element);	
	temp_name = element.id;
	element.className = "";

	this.applyClass(element,temp_name);
};

biTurbo.proto.clearClassToAll = function (){
	var i;
	var element;
	var elementCount = this.elementsCreated.length;

	for(i = 0 ; i < elementCount ; i++){
		element = this.getDomElement(this.elementsCreated[i]);
		this.clearClass(element);
	}
};


// CSS accelerators & matrix transformation

biTurbo.proto.acc_CSS = function (alpha,x,y,w,h){ 
	var temp_rules = "";
	if(this.isParameterDefined(alpha)){
		temp_rules += 'opacity: '+ alpha + ' ; ';
	}
	if(this.isParameterDefined(x)){
		temp_rules += 'left: '+ x + 'px ; ';
	}
	if(this.isParameterDefined(y)){
		temp_rules += 'top: '+ y + 'px ; ';
	}
	if(this.isParameterDefined(w)){
		temp_rules += 'width: '+ w + 'px ; ';
	}
	if(this.isParameterDefined(h)){
		temp_rules += 'height: '+ h + 'px ; ';
	}
	return(temp_rules);
};

biTurbo.proto.tMatrix = function (rotation,scaleX,scaleY,x,y){ // scale and rotation
	var temp_rules = "";
	var temp_scaleX = 0;
	var temp_scaleY = 0;
	var temp_angle = 0;
	
	if(this.isParameterDefined(x) === false){
		x = 0;
	}
	if(this.isParameterDefined(y) === false){
		y = 0;
	}

	if(this.isParameterDefined(scaleX) || this.isParameterDefined(rotation)){
		if (scaleX === undefined || scaleX === null) {
			temp_scaleX = 1;
		}else{
			temp_scaleX = scaleX;
		}
		if(this.isParameterDefined(scaleY)){
			temp_scaleY = scaleY;
		}else{
			temp_scaleY = scaleX;
		}

		if (rotation === undefined || rotation === null) {
			rotation = 0;
		}

		temp_angle=rotation * (Math.PI/180);
		temp_rules += 'transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; ';
		temp_rules += '-ms-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; ';
		temp_rules += '-webkit-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; ';
		temp_rules += '-moz-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; ';
	}
	return(temp_rules);
};

//////////// ANIMATION ////////////

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


//////////// HTML ////////////

biTurbo.proto.createDivElement = function (name , fileNameString , style, excludeFromElements){
	var temp_rules = 'display:block ; position:absolute ; ';
	var temp_img_name;	
	var temp_name;
	var tempInsertionPoint;
	var temp_divEnding;
	
	name = this.defaultParameter(name,"");
	style = this.defaultParameter(style,"");
	excludeFromElements = this.defaultParameter(excludeFromElements,false);
	temp_img_name = "img_preload_" + name;
	temp_name = "." + name;

	if(this.insertionPoint === null){
		this.a_print(" Error: You must define insertionPoint in HTML ");
		return;
	}
	tempInsertionPoint = document.getElementById(this.insertionPoint);
	
	if(fileNameString === ""){ //solid color
		temp_rules += ' overflow: hidden; ';
		temp_divEnding = '</div>';
	}else{ //image
		temp_rules += ' background: url('+ fileNameString + ') ; ';
		temp_divEnding = '<img id="' + temp_img_name + '" src="' + fileNameString + '" style="visibility: hidden ; display : block;" /></div>'; // hack to set the div dimensions to fit the image, probably to be replaced in a future by a more polite solution if an image preloader is added
		if(this.addImagesToPreloadQueue === true){
			this.imagesToLoad.push(temp_img_name);
		}
	}
	temp_rules += style;
	this.writeClass(temp_name, temp_rules);
	tempInsertionPoint.innerHTML += '<div id="' + name + '" class="' + name + '">' + temp_divEnding;
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
	
	this.createDivElement(temp_nameContainerDiv,"",1,0,0,"transparent");
	this.insertionPoint = temp_nameContainerDiv;

	tempInsertionPoint=document.getElementById(this.insertionPoint);
	
	this.writeClass(temp_name, textStyle); 
	tempInsertionPoint.innerHTML += '<p id="' + name + '" class="' +  name + '">' + textContent + temp_divEnding;
	this.insertionPoint = back_insertionPoint;
	this.elementsCreated.push(name);
};

biTurbo.proto.createBorder = function (color,borderWidth){
	var tempStyle = "border-style: solid; border-color: "+color+" ; border-width: "+borderWidth+"px";
	var tempWidth = this.width-(borderWidth*2);
	var tempHeight = this.height-(borderWidth*2);
	this.createDivElement("border_frame" , "" , (("opacity:1 ; left:0px ; top:0px ; background-color:transparent ; width:" + tempWidth + "px ; height:" + tempHeight + "px ; "+tempStyle) ) , true);
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
			if(biTurboProps.clicked === false){
				context.a_print(context.currentFrameIndex+": "+context.timeLine[context.currentFrameIndex]);
				context.gotoFrame(context.timeLine[context.currentFrameIndex]);
				context.currentFrameIndex++;
			}
		}
	}, delay * 1000);
};

biTurbo.proto.gotoFrame = function (functionName){
	window[functionName]();
};


//////////// BUTTONS AND CLICKTAG ////////////

biTurbo.proto.setBTN = function (element , userClickFunctionName , causeStop , endFrame){
	var temp_estimated_endFrame = this.timeLine.length-1;
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
		biTurboProps.clicked=true;
		window[clickedFrame](); // goto End Frame function
	}
	this.a_print('-- \n biTurboProps.clicked=true ; animation goes to frame "' + clickedFrame + '" and invokes function: ' + userClickFunctionName + '()');
	window[userClickFunctionName](); // user implemented clickTag function
};

////////////PRELOADER///////////

biTurbo.proto.startWhenLoadedEnough = function (){
	var context = this;
	this.checkLoaded(context)
	addEventListener("loadedEnough",function(Event){
		context.nextFrameInTimeLine();	
	});
}

biTurbo.proto.checkLoaded = function (context){
	if(typeof(Event) === "function") {
		var readyEvent = new Event("loadedEnough");
	}else{ //IE fix
    	var readyEvent = document.createEvent('Event');
    	readyEvent.initEvent("loadedEnough", true, true);
	}
	if(this.limitToWaitPreload > 0){
		setTimeout(function(){
			var i = 0;
			var temp_loaded = 0;
			var element;
			var imagesToLoadCount = context.imagesToLoad.length;
			for(i=0 ; i<imagesToLoadCount ; i++){
				element=context.getDomElement(context.imagesToLoad[i]);
				if(element.complete === true){
					temp_loaded++;
				}
			}
			context.a_print("-- \n imagesLoaded " + temp_loaded + '/' + imagesToLoadCount);
			if(temp_loaded === imagesToLoadCount){
				context.a_print("-- \n preload complete");
				dispatchEvent(readyEvent)
			}else{
				context.limitToWaitPreload--;
				context.a_print("-- \n preload in progress: " + context.limitToWaitPreload );
				context.checkLoaded(context);
			}
		},200);
	}else{
	context.a_print("-- \n preloader timeOut");
	dispatchEvent(readyEvent)
	}
};

//////////// HELPERS ////////////

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

biTurbo.proto.a_print = function (contentLog){
	if(biTurboProps.debug === true && this.isParameterDefined(contentLog) === true){
		console.log(contentLog);
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
