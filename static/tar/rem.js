var oHtml = document.documentElement;

window.onload = function() {
    getSize();
}

function getSize(){

	var screenWidth = oHtml.clientWidth;

	if (screenWidth <= 320) {
	    oHtml.style.fontSize = '20px';
	} else if (screenWidth > 320 && screenWidth <= 640) {
	    oHtml.style.fontSize = screenWidth / 320 * 20 + 'px';
	} else if (screenWidth > 640 && screenWidth <= 1280) {
	    oHtml.style.fontSize = '26.6666666667px';
	} else if (screenWidth > 1920) {

	    oHtml.style.fontSize = '60px';

	}else{

	    oHtml.style.fontSize = screenWidth / 1920 * 34 + 'px';

	}	
}

window.onresize = function(){
	getSize();
}