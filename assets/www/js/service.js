var PumpService = {
    
    baseUrl:"http://23.21.32.1/",
    
    getMessagesNear:function(cb,lat,lon,radius) {
        var xhr = new XMLHttpRequest();
        var url = this.baseUrl + "/messages?latitude=" + lat + "&longitude=" + lon + "&radius=" + radius;
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
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
            if (xhr.readyState === 4) {
                cb(xhr.status,JSON.parse(xhr.responseText));
            }
        };
        xhr.open("POST",url,true);
        var obj = {latitude:lat,
                   longitude:lon,
                   message:message};
        xhr.send(obj);
    }
    
    
};