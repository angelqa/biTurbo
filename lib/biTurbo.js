//////////// VARIABLES ////////////
var a_debug,a_loop,a_height,a_width,a_clicked,a_insertionPoint; // should be defined on the main banner
a_debug=false;
a_clicked=false;
var a_currentFrameIndex=0;
var a_timeLine=[];
var a_imagesToLoad=[]
var a_elementsCreated=[]
var a_limitToWaitPreload=4;

//////////// CSS CLASSES ////////////
function a_initStyle(){
	var style = document.createElement('style');
	style.type = 'text/css';
	style.appendChild(document.createTextNode(""));
	a_print("                              biTurbo.js \n \n                                  by \n \n                         Ángel Quijada Álvarez \n \n   A lightweight JS animation library for fast banner ads development! \n ")
}

function a_writeClass(name , rules){
	var style = document.createElement('style');
	style.type = 'text/css';
	document.getElementsByTagName('head')[0].appendChild(style);
	a_print("new CSS class : "+name+ " : "+rules)
	style.sheet.insertRule(name+'{'+rules+'}',0);
}

function a_applyClass(element,name){
	element=a_getDomElement(element);	
	element.classList.add(name);
}

function a_applyClassToAll(name){
	var i=0;
	var element;
	for(i=0 ; i<a_elementsCreated.length ; i++){
		element=a_getDomElement(a_elementsCreated[i])
		element.classList.add(name);
	}
}
function a_clearClassToAll(){
	var i=0;
	var element;
	for(i=0 ; i<a_elementsCreated.length ; i++){
		element=a_getDomElement(a_elementsCreated[i])
		a_clearClass(element);
	}
}



function a_tweenClass(element , keyframe , tween , delay){
	delay=a_defaultParameter(delay,0);
	element=a_getDomElement(element);	
	var temp_name=element.id
	var temp_tween="tween_"+tween;
	setTimeout(function(){
		//element.className = "";		
		a_clearClass(element)
		a_applyClass(element,temp_name)
		a_applyClass(element,keyframe)
		a_applyClass(element,temp_tween)
	},delay*1000);
}


function a_clearClass(element){
	element=a_getDomElement(element);	
	var temp_name=element.id
	element.className = "";
	a_applyClass(element,temp_name)
}

function a_createClass(name,style){
	var temp_console=""
	var i=0;
	var a=0;
	var temp_rules="";
	var tempArguments = {}
		tempArguments.class=null
		tempArguments.CSS=null
	if(arguments.length<1){
		a_print("Error: a_createClass: no parameters")
		return;
	}
	tempArguments.class=arguments[0];
	tempArguments.CSS=arguments[1]
	if(a_isParameterDefined(tempArguments.CSS)){
		temp_rules+=tempArguments.CSS + ' ; '
	}

	var temp_name="."+tempArguments.class;
	a_writeClass(temp_name, temp_rules); // create id style
}

// CSS accelerators & matrix transformation

function a_CSS(alpha,x,y,w,h){ 
	var temp_rules="";

	if(a_isParameterDefined(alpha)){
		temp_rules+='opacity: '+ alpha + ' ; '
	}
	if(a_isParameterDefined(x)){
		temp_rules+='left: '+ x + 'px ;'
	}
	if(a_isParameterDefined(y)){
		temp_rules+='top: '+ y + 'px ;'
	}
	if(a_isParameterDefined(w)){
		temp_rules+='width: '+ w + 'px ;'	
	}
	if(a_isParameterDefined(h)){
		temp_rules+='height: '+ h + 'px ;'	
	}
	return(temp_rules)
}

function a_tMatrix(rotation,scaleX,scaleY,x,y){ // scale and rotation
	var temp_rules="";
	var temp_scaleX=0;
	var temp_scaleY=0;

	if(a_isParameterDefined(x)==false){
		x=0
	}
	if(a_isParameterDefined(y)==false){
		y=0
	}

	if(a_isParameterDefined(scaleX) || a_isParameterDefined(rotation)){
		if (scaleX === undefined || scaleX === null) {
			temp_scaleX=1
		}else{
			temp_scaleX=scaleX
		}
		if(a_isParameterDefined(scaleY)){
			temp_scaleY=scaleY
		}else{
			temp_scaleY=scaleX
		}

		if (rotation === undefined || rotation === null) {
			rotation=0;
		}
		var temp_angle=rotation * (Math.PI/180)*5;

		temp_rules+='transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; '
		temp_rules+='-ms-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; '
		temp_rules+='-webkit-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; '
		temp_rules+='-moz-transform: matrix(' + (Math.cos(temp_angle)*temp_scaleX) + ' , ' + (Math.sin(temp_angle)*temp_scaleY) + ' , ' + (-Math.sin(temp_angle)*temp_scaleX) + ' , ' + (Math.cos(temp_angle)*temp_scaleY) + ' , '+x+' , '+y+' ) ; '
	}
	return(temp_rules)
}

//////////// ANIMATION ////////////

function a_createTween(name , duration , easing){
	easing=a_defaultParameter(easing,1);
	var temp_easing="";
	switch(easing){
		case 0: // linear
		default:
			temp_easing="linear"

		break;
		case 1: // ease in
			temp_easing="ease-in"

		break;
		case 2: //ease out
			temp_easing="ease-out"
		break;
		case 3: // ease in out
			temp_easing="ease-in-out"

		break;
		case 4: // bounce
			temp_easing="cubic-bezier(0.175, 0.885, 0.32, 1.275)"
		break;
		case 5: // sstep
			temp_easing="step-end"
		break;
	}
	var temp_rules="transition: all "+duration+"s "+temp_easing+" ; "
	temp_rules+="-webkit-transition: all "+duration+"s "+temp_easing+" ; "
	temp_rules+="-moz-transition: all "+duration+"s "+temp_easing+" ; "
	temp_rules+="-o-transition: all "+duration+"s "+temp_easing+" ; "
	temp_rules+="-ms-transition: all "+duration+"s "+temp_easing+" ; "
	var temp_name=".tween_"+name
	a_writeClass(temp_name, temp_rules);
}


function a_tweenClass(element , keyframe , tween , delay){
	delay=a_defaultParameter(delay,0);
	element=a_getDomElement(element);	
	var temp_name=element.id
	var temp_tween="tween_"+tween;
	setTimeout(function(){
		element.className = "";		
		a_applyClass(element,temp_name)
		a_applyClass(element,keyframe)
		a_applyClass(element,temp_tween)
	},delay*1000);
}


//////////// HTML ////////////

function a_createDivElement(name , fileNameString , style, excludeFromElements){
	name=a_defaultParameter(name,"");
	style=a_defaultParameter(style,"");
	excludeFromElements=a_defaultParameter(excludeFromElements,false);

	var temp_rules='display:block ; position:absolute ; '
	var temp_img_name="img_preload_"+name;
	if(a_insertionPoint==null){
		a_print(" Error: You must define a_insertionPoint in HTML ")
		return;
	}
	var tempInsertionPoint=document.getElementById(a_insertionPoint)
	var temp_divEnding
	
	if(fileNameString==""){ //solid color
		temp_rules+= ' overflow: hidden; ';
		temp_divEnding='</div>'
	}else{ //image
		temp_rules+=' background: url('+ fileNameString + ') ; ';
		temp_divEnding='<img id="' + temp_img_name + '" src="'+fileNameString+'" style="visibility: hidden ; display : block;" /></div>'; // hack to set the div dimensions to fit the image, probably to be replaced in a future by a more polite solution if an image preloader is added
		a_imagesToLoad.push(temp_img_name)
	}
	temp_rules+=style;
	var temp_name="."+name;
	a_writeClass(temp_name, temp_rules);
	tempInsertionPoint.innerHTML+='<div id="'+ name +'" class="' +  name +'">' + temp_divEnding;
		console.log("a_createDivElement: "+name+" : "+excludeFromElements)
	if(excludeFromElements==false){
		a_elementsCreated.push(name)
	}
}

function a_createTextElement(name , textContent, textStyle){
	var temp_nameContainerDiv=name+"_container"
	var back_a_insertionPoint =	a_insertionPoint

	a_createDivElement(temp_nameContainerDiv,"",1,0,0,"transparent")
	a_insertionPoint =temp_nameContainerDiv

	var tempInsertionPoint=document.getElementById(a_insertionPoint)
	temp_divEnding='</p>'
	
	var temp_name="."+name;
	a_writeClass(temp_name, textStyle); 
	tempInsertionPoint.innerHTML+='<p id="'+ name +'" class="' +  name +'">'+textContent + temp_divEnding;
	a_insertionPoint = back_a_insertionPoint
	a_elementsCreated.push(name)
}

function a_createBorder(color,borderWidth){
	var tempStyle="border-style: solid; border-color: "+color+" ; border-width: "+borderWidth+"px"
	var tempWidth=a_width-(borderWidth*2)
	var tempHeight=a_height-(borderWidth*2)
	a_createDivElement("border_frame","",(("opacity:1 ; left:0px ; top:0px ; background-color:transparent ; width:" + tempWidth + "px ; height:" + tempHeight + "px ; "+tempStyle) ),true)
	//a_writeClass(".border_style" , tempStyle)
	//a_applyClass("border_frame", "border_style")
}

//////////// TIME LINE ////////////

function a_setTimeLine(){
	a_timeLine=arguments
	a_currentFrameIndex=0;
}

function a_nextFrameInTimeLine(delay){
	delay=a_defaultParameter(delay,0);
	setTimeout(function(){
		if(a_currentFrameIndex<a_timeLine.length && a_clicked==false){
			a_print(a_currentFrameIndex+": "+a_timeLine[a_currentFrameIndex])
			a_gotoFrame(a_timeLine[a_currentFrameIndex])
			a_currentFrameIndex++;
		}
		
	},delay*1000);
}

function a_gotoFrame(functionName){
	/*
	var hostName=window.location.hostname;
	var tempDomain=hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
    if(tempDomain==="angelqa.com"){
		*/
		if(a_clicked==false){
			window[functionName]();
		}
	//}
}


//////////// BUTTONS AND CLICKTAG ////////////

function a_setBTN(element,userClickTagFunctionName,endFrame){
	element=a_getDomElement(element);
	var temp_estimated_endFrame=a_timeLine.length-1
	endFrame=a_defaultParameter(endFrame,a_timeLine[temp_estimated_endFrame]);
	element.addEventListener("click", function(){a_clickTag(userClickTagFunctionName,endFrame)})
	a_writeClass(".a_cursor","cursor: pointer;")
	a_applyClass(element,"a_cursor")
}

function a_clickTag(userClickTagFunctionName,endFrame){
	a_clicked=true
	a_print('-- \n a_clicked=true ; animation goes to frame "'+endFrame+'" and invokes function: '+userClickTagFunctionName+'()')
	window[endFrame](); // goto End Frame function
	window[userClickTagFunctionName](); // user implemented clickTag function
}
////////////PRELOADER///////////
function a_checkLoaded(){
	if(a_limitToWaitPreload>0){
		setTimeout(function(){
			var i=0;
			var temp_loaded=0;
			var element;
			for(i=0 ; i<a_imagesToLoad.length ; i++){
				element=a_getDomElement(a_imagesToLoad[i])
				if(element.complete == true){
					temp_loaded++;
				}
			}
			a_print("-- \n a_imagesLoaded "+temp_loaded+'/'+a_imagesToLoad.length)
			if(temp_loaded == a_imagesToLoad.length){
				a_nextFrameInTimeLine();	
			}else{
				a_limitToWaitPreload--;
				a_checkLoaded()
			}
		},333);
	}else{
		a_print("-- \n preloader timeOut")
		a_nextFrameInTimeLine();	
	}
}

//////////// HELPERS ////////////

function a_defaultParameter(parameter,value){//ie fix due to the lack of support for default parameters values in functions
	if (parameter === undefined || parameter === null) {
		return(value)
	}else{
		return(parameter)
	}
}

function a_isParameterDefined(parameter){
	if (parameter === undefined || parameter === null) {
		return(false)
	}else{
		return(true)
	}
}

function a_print(contentLog){
		if(a_debug===true && a_isParameterDefined(contentLog)){
			console.log(contentLog)
		}
}

function a_getDomElement(element){
	if(typeof element.valueOf() == "string"){
		element = document.getElementById(element);
	}
	return(element);
}
