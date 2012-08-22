
window.onerror = function(e)
{
    console.log("Error:" + e);
}

var accelX = 0,
    accelY = 0,
    accelZ = 0,
    timestamp = 0;

var threshold = 3;
var radius = 150; 

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.deviceready, false);
        sendButton.addEventListener("click",function() {
                                        app.onShakeOrButton();
                                    });
    },
    deviceready: function() {
        // note that this is an event handler so the scope is that of the event
        // so we need to call app.report(), and not this.report()
        //app.report('deviceready');
        var networkState = navigator.network.connection.type;
        if(networkState == Connection.NONE)
            app.onlineFailure();
        else
            app.onlineSuccess();
            
        function accelSuccess(acceleration) {
            // init acceleration value
            if(accelZ == 0){
                accelZ = acceleration.z;
            }

            var deltaZ = Math.abs(acceleration.z - accelZ);
            console.log('deltaZ: ' + deltaZ);
            
            if(deltaZ >= threshold){
                console.log("Bump detected! Do stuff!");
                app.onShakeOrButton();
            }
            
            accelZ = acceleration.z;
        };
        
        function accelError() {
            console.log("Acceleration failed");
        };
        
        var options = { frequency: 1000 };  
        var watchID = navigator.accelerometer.watchAcceleration(accelSuccess, accelError, options);
    },
    onShakeOrButton:function(){
        var textField = document.getElementById('sendText');
        if(textField.value.length > 0)
        {
            msgOut.innerHTML = "Sending your message";
            console.log("We should send a message");
            PumpService.leaveMessage(app.onMessageSent, app.position.coords.latitude, app.position.coords.longitude, textField.value);
        }
        else
        {
            console.log("We should get the messages");
            msgOut.innerHTML = "Looking for a message";
            PumpService.getMessagesNear(app.onMessagesLoaded, app.position.coords.latitude, app.position.coords.longitude, radius);
        }
    },
    onlineSuccess: function() {
        app.onlineWatcher = navigator.geolocation.watchPosition(app.geoSuccess, app.geoFailure, {});
        msgOut.innerHTML = "Pump is online!";
    },
    onlineFailure: function() {
        console.log('This failed');
        msgOut.innerHTML = "Network is not available, are you online?";
    },
    geoSuccess: function(position) {
        console.log('We have a location');
        app.position = position; 
    },
    geoFailure: function() {
        //Not sure what to do here
        console.log("We failed to get a location, we should do stuff");
        msgOut.innerHTML = "Error getting location";
    },
    onMessageSent: function(status) { 
        console.log("Message has been sent");
        var textField = document.getElementById('sendText');
        textField.value = "";
        msgOut.innerHTML = "Message sent.";
    },
    onMessagesLoaded: function(status, resp) {
        
        var now = + new Date();
        var messages = resp.messages;
        for(var n = 0; n < messages.length; n++)
        {
            if(messages[n].distance < 100)
            {
                console.log("this is a likely message : " + n);
                if(Math.abs(now - messages[n].timestamp) < 10000)
                {
                    console.log("I think this is the one!");
                    sendText.value = messages[n].message;
                    msgOut.innerHTML = "";
                    return;
                }
                
            }
        }
        
        msgOut.innerHTML = "Sorry, no messages";
        console.log("messages[0] = " + resp.messages[0].timestamp);
                
/*
 {"messages":[ {"location":{"longitude":-122.440593,"latitude":37.757416},
                "message":"BoomBoom",
                "distance":4361,
                "timestamp":1345596967195}
                ,...
*/
        console.log("Current Response :: " + resp );
    }
};
