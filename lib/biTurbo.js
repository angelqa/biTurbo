"use strict";
var biTurboProps = {
	debug : true ,
	clicked : false
};
if(typeof biTurbo === 'undefined'){
	var biTurbo = {};
}
biTurbo.prototype = {
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

biTurbo.prototype.initStyle = function (context){
	var style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	this.a_print("                              biTurbo.js \n \n                                  by \n \n                         Ángel Quijada Álvarez \n \n   A lightweight JS animation library for fast banner ads development! \n ");
};

biTurbo.prototype.writeClass = function (name , rules){
	var style = document.createElement('style');
	style.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(style);
	this.a_print("new CSS class : " + name + " : " + rules);
	style.sheet.insertRule(name + '{' + rules + '}' ,0);
};

biTurbo.prototype.applyClass = function (element,name){
	element = this.getDomElement(element);	
	element.classList.add(name);
};

biTurbo.prototype.applyClassToAll = function (name){
	var i;
	var element;
	var elementCount = this.elementsCreated.length;
	for(i = 0 ; i < elementCount ; i++){
		element=this.getDomElement(this.elementsCreated[i]);
		element.classList.add(name);
	}
};

biTurbo.prototype.clearClassToAll = function (){
	var i;
	var element;
	var elementCount = this.elementsCreated.length;
	for(i = 0 ; i < elementCount ; i++){
		element = this.getDomElement(this.elementsCreated[i]);
		this.clearClass(element);
	}
};

biTurbo.prototype.tweenClass = function (element , keyframe , tween , delay){
	var temp_tween;
	var temp_name;
	var context=this;
	delay = this.defaultParameter(delay,0);
	element = this.getDomElement(element);	
	temp_name = element.id;
	temp_tween = "tween_" + tween;
	setTimeout(function(){
		context.clearClass(element);
		context.applyClass(context.element,temp_name);
		context.applyClass(context.element,keyframe);
		context.applyClass(context.element,temp_tween);
	}, delay * 1000 );
};

biTurbo.prototype.clearClass = function (element){
	var temp_name;
	element = this.getDomElement(element);	
	temp_name = element.id;
	element.className = "";
	this.applyClass(element,temp_name);
};

biTurbo.prototype.createClass = function (name,style){
	var temp_rules = "";
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

	var temp_name = "." + tempArguments.temp_class;
	this.writeClass(temp_name , temp_rules); // create id style
};

// CSS accelerators & matrix transformation

biTurbo.prototype.acc_CSS = function (alpha,x,y,w,h){ 
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

biTurbo.prototype.tMatrix = function (rotation,scaleX,scaleY,x,y){ // scale and rotation
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

biTurbo.prototype.createTween = function (name , duration , easing){
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


biTurbo.prototype.tweenClass = function (element , keyframe , tween , delay){
	var temp_name;
	var temp_tween = "tween_"+tween;
	var context = this;

	delay = this.defaultParameter(delay,0);
	element = this.getDomElement(element);	
	temp_name = element.id;
	setTimeout(function(){
		element.className = "";		
		context.applyClass(element,temp_name);
		context.applyClass(element,keyframe);
		context.applyClass(element,temp_tween);
	}, delay * 1000 );
};

//////////// HTML ////////////

biTurbo.prototype.createDivElement = function (name , fileNameString , style, excludeFromElements){
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

biTurbo.prototype.createTextElement = function (name , textContent, textStyle){
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

biTurbo.prototype.createBorder = function (color,borderWidth){
	var tempStyle = "border-style: solid; border-color: "+color+" ; border-width: "+borderWidth+"px";
	var tempWidth = this.width-(borderWidth*2);
	var tempHeight = this.height-(borderWidth*2);
	this.createDivElement("border_frame" , "" , (("opacity:1 ; left:0px ; top:0px ; background-color:transparent ; width:" + tempWidth + "px ; height:" + tempHeight + "px ; "+tempStyle) ) , true);
};

//////////// TIME LINE ////////////

biTurbo.prototype.setTimeLine = function (){
	this.timeLine = arguments;
	this.currentFrameIndex = 0;
};

biTurbo.prototype.nextFrameInTimeLine = function (delay){
	var context = this;
	delay = this.defaultParameter(delay,0.1);
	setTimeout(function(){
		if(context.currentFrameIndex < context.timeLine.length && biTurboProps.clicked === false){
			context.a_print(context.currentFrameIndex+": "+context.timeLine[context.currentFrameIndex]);
			context.gotoFrame(context.timeLine[context.currentFrameIndex]);
			context.currentFrameIndex++;
		}
	}, delay * 1000);
};

biTurbo.prototype.gotoFrame = function (functionName){
	if(biTurboProps.clicked === false){ // no more frame animations after the user has clicked on the banner
		window[functionName]();
	}
};


//////////// BUTTONS AND CLICKTAG ////////////

biTurbo.prototype.setBTN = function (element,userClickTagFunctionName,endFrame){
	element = this.getDomElement(element);
	var temp_estimated_endFrame = this.timeLine.length-1;
	endFrame = this.defaultParameter(endFrame , this.timeLine[temp_estimated_endFrame]);
	var context = this;
	element.addEventListener("click", function(){ 
		context.clickTag(userClickTagFunctionName , endFrame);
	});
	this.writeClass(".a_cursor" , "cursor: pointer;");
	this.applyClass(element , "a_cursor");
};

biTurbo.prototype.clickTag = function (userClickTagFunctionName,endFrame){
	biTurboProps.clicked=true;
	this.a_print('-- \n biTurboProps.clicked=true ; animation goes to frame "' + endFrame + '" and invokes function: ' + userClickTagFunctionName + '()');
	window[endFrame](); // goto End Frame function
	window[userClickTagFunctionName](); // user implemented clickTag function
};

////////////PRELOADER///////////

biTurbo.prototype.startWhenLoadedEnough = function (){
	var context = this;
	this.checkLoaded(context)
	addEventListener("loadedEnough",function(Event){
		context.nextFrameInTimeLine();	
	});
}

biTurbo.prototype.checkLoaded = function (context){
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

biTurbo.prototype.defaultParameter = function (parameter,value){//ie fix due to the lack of support for default parameters values in 
	if (parameter === undefined || parameter === null) {
		return(value);
	}else{
		return(parameter);
	}
};

biTurbo.prototype.isParameterDefined = function (parameter){
	if (parameter === undefined || parameter === null) {
		return(false);
	}else{
		return(true);
	}
};

biTurbo.prototype.a_print = function (contentLog){
	if(biTurboProps.debug === true && this.isParameterDefined(contentLog) === true){
		console.log(contentLog);
	}
};

biTurbo.prototype.getDomElement = function (element){
	if(typeof element.valueOf() === "string"){
		element = document.getElementById(element);
	}
	return(element);
};

biTurbo.create = function () { 
	return Object.create(this.prototype);
};
