function getBackgroundPageWindow(){
	return chrome.extension.getBackgroundPage();
}

window.addEventListener("load", function load() {
	/*
	chrome.storage.sync.get("", function (data) {
		
	});
	*/

	
	
	console.log(getBackgroundPageWindow().getTicker());
	

}, false);







