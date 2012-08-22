var accelX = 0,
    accelY = 0,
    accelZ = 0,
    timestamp = 0;

var threshold = 3;
var radius = 500; 

var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.deviceready, false);
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
                var textField = document.getElementById('sendText');
                if(textField.value.length > 0)
                {
                    console.log("We should send a message");
                    PumpService.leaveMessage(app.sendMessage, app.position.coords.latitude, app.position.coords.longitude, textField.value);
                }
                else
                {
                    console.log("We should get the messages");
                    PumpService.getMessagesNear(app.recvMessage, app.position.coords.latitude, app.position.coords.longitude, radius);
                }
            }
            
            accelZ = acceleration.z;
        };
        
        function accelError() {
            console.log("Acceleration failed");
        };
        
        var options = { frequency: 1000 };  
        var watchID = navigator.accelerometer.watchAcceleration(accelSuccess, accelError, options);
    },
    onlineSuccess: function() {
        app.onlineWatcher = navigator.geolocation.watchPosition(app.geoSuccess, app.geoFailure, {});
    },
    onlineFailure: function() {
        console.log('This failed');
    },
    geoSuccess: function(position) {
        console.log('We have a location');
        app.position = position; 
    },
    geoFailure: function() {
        //Not sure what to do here
        console.log("We failed to get a location, we should do stuff");
    },
    sendMessage: function(status, resp) { 
        console.log("Message has been sent");
    },
    recvMessage: function(status, resp) {
        console.log("Current Response");
    }
};
