var PumpService = {
    
    baseUrl:"http://23.21.32.1",
    
    getMessagesNear:function(cb,lat,lon,radius) {
        var xhr = new XMLHttpRequest();
        var url = this.baseUrl + "/messages?latitude=" + lat + "&longitude=" + lon + "&radius=" + radius;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                //console.log("Result:" + xhr.responseText);
                cb(xhr.status,JSON.parse(xhr.responseText));
            }
        };
        xhr.open("GET",url,true);
        xhr.send();
    },
    
    leaveMessage:function(cb,lat,lon,message){
        var xhr = new XMLHttpRequest();
        var url = this.baseUrl + "/message";
        xhr.onreadystatechange = function() {
            console.log("Ready state = " + xhr.readyState);
            if (xhr.readyState === 4) {
                cb(xhr.status);
            }
        };
        xhr.open("POST",url,true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var param = "latitude=" + lat + "&longitude=" + lon + "&message=" + encodeURIComponent(message);
        xhr.send(param);
    }
    
    
};
