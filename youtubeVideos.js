var categories = new Array();

function getPosition() {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function retrieveLocation() {
    var loc = document.getElementById("locations").value;
    
    url = "https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode="+loc+"&key=AIzaSyCqMSMM1P41CuXoFXYpgb4k8r98zyoS-9c";
    
    locationResult(url);
}
    
function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    
    url = "http://api.openweathermap.org/data/2.5/weather?appid=1b83a17d019aea7811a9f93bf08d5c3a&mode=JSON&lat="+lat+"&lon="+lon;
    
    $.getJSON(url,function(response) {
        url = "https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&regionCode="+response.sys.country+"&key=AIzaSyCqMSMM1P41CuXoFXYpgb4k8r98zyoS-9c";

	document.getElementById("locations").disabled =  true;
                locationResult(url);
    });
}


function locationResult(url) {
    
    $.ajax({url: url, dataType: "jsonp", async: false, success: function(response){
            response = JSON.stringify(response);
            response = JSON.parse(response);
                
            var list = "";
            
            for(var i = 0; i<response.items.length; i++) {
                list += "<option value='"+response.items[i].id+"'>"+ response.items[i].id + " " + response.items[i].snippet.title+"</option>";
            }
            
            document.getElementById("ddmenu").innerHTML = list;
            
        }});
}


function recordValues() {
    
    var counter = 0;
    var opt;
    var t = document.getElementById("ddmenu");
    for(var i = 0; i < t.length; i++) {
        opt = t.options[i];
        if(opt.selected) {
            categories[counter] = t.options[i].value;
            counter++;       
        }
    }
    
    if(categories.length == 0) {
        console.log("Working...");
        for(var i = 0; i < t.length; i++) {
        opt = t.options[i];
        categories[i] = t.options[i].value;     
        }
    }
}


function search() {
    
    $("#divId").empty();
    $("#irre").empty();
    $("#irrele").empty(); 
    
    var minimumUplift = 5;
    
    minimumUplift = document.getElementById("likes").value;
    
    if(minimumUplift == null || minimumUplift == undefined || minimumUplift == 0 || minimumUplift == "") {
        minimumUplift = 5;
    }
    
    console.log("Likes Count (minimumuplift)" + minimumUplift);
    
    recordValues();
    
    searchItem = document.getElementById("search").value;
    
    $.ajax({url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q="+searchItem+"&maxResults=50&key=AIzaSyCqMSMM1P41CuXoFXYpgb4k8r98zyoS-9c", dataType: "jsonp", async: false, success: function(result){
            result = JSON.stringify(result);
            result = JSON.parse(result);
            console.log("Total Video Captured: "+result.items.length);
            
            for(var v = 0; v < result.items.length; v++) {
                
                url = "https://www.googleapis.com/youtube/v3/videos?id="+result.items[v].id.videoId+"&key=AIzaSyCqMSMM1P41CuXoFXYpgb4k8r98zyoS-9c&part=statistics,snippet";
                
                var totalLikes;
                var totalDislikes;
                $.ajax({url: url, dataType: "jsonp", async: false, success: function(response){
                    response = JSON.stringify(response);
                    response = JSON.parse(response);
                    totalLikes = response.items[0].statistics.likeCount;
                    totalDislikes = response.items[0].statistics.dislikeCount;
                    totalDislikes = (totalDislikes==0?1:totalDislikes);
                    for(var i = 0; i<categories.length; i++) {
            
                        if(categories[i] == response.items[0].snippet.categoryId) {
                            if((Math.round(totalLikes/totalDislikes) >= minimumUplift)) {
                                $("#divId").append("<br/><a target='_blank' href='http://www.youtube.com/watch?v="+response.items[0].id+"'> <img src='"+response.items[0].snippet.thumbnails.medium.url+"'> <br/>"+response.items[0].snippet.title + " (" + response.items[0].snippet.categoryId + ") (" + Math.round(totalLikes/totalDislikes) +")</a> <br/> <br/>");
                                break;
                            }
           
                            if(i == (categories.length - 1)) {
                                $("#irre").append("<br/><a target='_blank' href='http://www.youtube.com/watch?v="+response.items[0].id+"'> <img src='"+response.items[0].snippet.thumbnails.medium.url+"'> <br/>"+response.items[0].snippet.title + " (" + response.items[0].snippet.categoryId + ") (" + Math.round(totalLikes/totalDislikes) +")</a> <br/> <br/>");
                                break;        
                            }
                        } else if(i == (categories.length - 1)){
                             $("#irrele").append("<br/><a target='_blank' href='http://www.youtube.com/watch?v="+response.items[0].id+"'> <img src='"+response.items[0].snippet.thumbnails.medium.url+"'> <br/>"+response.items[0].snippet.title + " (" + response.items[0].snippet.categoryId + ") (" + Math.round(totalLikes/totalDislikes) +" )</a> <br/> <br/>");
                                break;        
                        }
                    }
                    
                }});
             }
            
        }});
}

function keyCodeVerification(event) {
    if(event.keyCode == 13) {
        console.log("Enter Key Detected");
        search();
    }
        
}