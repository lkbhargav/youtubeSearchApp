url = "https://www.googleapis.com/youtube/v3/videos?id=sAz2bRy8-L8&key=AIzaSyCqMSMM1P41CuXoFXYpgb4k8r98zyoS-9c&part=statistics,snippet";
    
    $.getJSON(url,function(response) {
	console.log(response);
});