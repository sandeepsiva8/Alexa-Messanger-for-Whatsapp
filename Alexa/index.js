
var awsIot = require('aws-iot-device-sdk');
var config = require("./config");
const operationTimeout = 10000;
var send_2rec_1=2;
var currentTimeout = null;
var thingName = 'thing';       // YOUR THING NAME HERE

var privateKey = new Buffer("-----BEGIN RSA PRIVATE KEY-----\n"+
//add your key here
"-----END RSA PRIVATE KEY-----\n");

var certificate = new Buffer("-----BEGIN CERTIFICATE-----\n"+
//add your certificate here
"-----END CERTIFICATE-----\n");



/**
 * Standard rootCA for everyone to use
 */
var rootCA = new Buffer("-----BEGIN CERTIFICATE-----\n"+
"MIIE0zCCA7ugAwIBAgIQGNrRniZ96LtKIVjNzGs7SjANBgkqhkiG9w0BAQUFADCB\n"+
"yjELMAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYDVQQL\n"+
"ExZWZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTowOAYDVQQLEzEoYykgMjAwNiBWZXJp\n"+
"U2lnbiwgSW5jLiAtIEZvciBhdXRob3JpemVkIHVzZSBvbmx5MUUwQwYDVQQDEzxW\n"+
"ZXJpU2lnbiBDbGFzcyAzIFB1YmxpYyBQcmltYXJ5IENlcnRpZmljYXRpb24gQXV0\n"+
"aG9yaXR5IC0gRzUwHhcNMDYxMTA4MDAwMDAwWhcNMzYwNzE2MjM1OTU5WjCByjEL\n"+
"MAkGA1UEBhMCVVMxFzAVBgNVBAoTDlZlcmlTaWduLCBJbmMuMR8wHQYDVQQLExZW\n"+
"ZXJpU2lnbiBUcnVzdCBOZXR3b3JrMTowOAYDVQQLEzEoYykgMjAwNiBWZXJpU2ln\n"+
"biwgSW5jLiAtIEZvciBhdXRob3JpemVkIHVzZSBvbmx5MUUwQwYDVQQDEzxWZXJp\n"+
"U2lnbiBDbGFzcyAzIFB1YmxpYyBQcmltYXJ5IENlcnRpZmljYXRpb24gQXV0aG9y\n"+
"aXR5IC0gRzUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCvJAgIKXo1\n"+
"nmAMqudLO07cfLw8RRy7K+D+KQL5VwijZIUVJ/XxrcgxiV0i6CqqpkKzj/i5Vbex\n"+
"t0uz/o9+B1fs70PbZmIVYc9gDaTY3vjgw2IIPVQT60nKWVSFJuUrjxuf6/WhkcIz\n"+
"SdhDY2pSS9KP6HBRTdGJaXvHcPaz3BJ023tdS1bTlr8Vd6Gw9KIl8q8ckmcY5fQG\n"+
"BO+QueQA5N06tRn/Arr0PO7gi+s3i+z016zy9vA9r911kTMZHRxAy3QkGSGT2RT+\n"+
"rCpSx4/VBEnkjWNHiDxpg8v+R70rfk/Fla4OndTRQ8Bnc+MUCH7lP59zuDMKz10/\n"+
"NIeWiu5T6CUVAgMBAAGjgbIwga8wDwYDVR0TAQH/BAUwAwEB/zAOBgNVHQ8BAf8E\n"+
"BAMCAQYwbQYIKwYBBQUHAQwEYTBfoV2gWzBZMFcwVRYJaW1hZ2UvZ2lmMCEwHzAH\n"+
"BgUrDgMCGgQUj+XTGoasjY5rw8+AatRIGCx7GS4wJRYjaHR0cDovL2xvZ28udmVy\n"+
"aXNpZ24uY29tL3ZzbG9nby5naWYwHQYDVR0OBBYEFH/TZafC3ey78DAJ80M5+gKv\n"+
"MzEzMA0GCSqGSIb3DQEBBQUAA4IBAQCTJEowX2LP2BqYLz3q3JktvXf2pXkiOOzE\n"+
"p6B4Eq1iDkVwZMXnl2YtmAl+X6/WzChl8gGqCBpH3vn5fJJaCGkgDdk+bW48DW7Y\n"+
"5gaRQBi5+MHt39tBquCWIMnNZBU4gcmU7qKEKQsTb47bDN0lAtukixlE0kF6BWlK\n"+
"WE9gyn6CagsCqiUXObXbf+eEZSqVir2G3l6BFoMtEMze/aiCKm0oHw0LxOXnGiYZ\n"+
"4fQRbxC1lfznQgUy286dUV4otp6F01vvpX1FQHKOtw5rDgb7MzVIcbidJ4vEZV8N\n"+
"hnacRHr2lVz2XTIIM6RUthg/aFzyQkqFOFSDX9HoLPKsEdao7WNq\n"+
"-----END CERTIFICATE-----");
var mqtt_config = {
	host :"a4hxjcrdpeqvc.iot.us-east-1.amazonaws.com",
	privateKey: privateKey,
    clientCert: certificate,
    caCert: rootCA,
    clientId: thingName,
    region: 'us-east-1'
    
};
var stack = [];
var ctx = null;
var client = null;
var thingShadows;
// Route the incoming request based on type (LaunchRequest, IntentRequest, etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);
        ctx = context;

        if (event.session.application.applicationId !==config.app_id ) {
             ctx.fail("Invalid Application ID");
         }

       // client = awsIot.device(mqtt_config);
		thingShadows=awsIot.thingShadow(mqtt_config);
       /* client.on("connect",function(){
            console.log("Connected to AWS IoT");
//            callback();
        });*/


        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request, event.session);
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request, event.session);
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            ctx.succeed();
        }
    } catch (e) {
        console.log("EXCEPTION in handler:  " + e);
        ctx.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId + ", sessionId=" + session.sessionId);
}


/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session ) {                  //, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
    intentName = intentRequest.intent.name;

    console.log("REQUEST to string =" + JSON.stringify(intentRequest));

    var callback = null;
    // Dispatch to your skill's intent handlers
    if ("TextIntent" === intentName) {
        doTextIntent(intent, session);
    } else if ("HelpIntent" === intentName) {
        getWelcomeResponse();
    } else {
        throw "Invalid intent";
    }

}


function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse() {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the Alexa Messenger For Whatsapp . ";

    

    var repromptText = "Messenger is ready.";
    var shouldEndSession = false;

    ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));

}



function doTextIntent(intent, session, callback) {

    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    repromptText = "Tell me what you want to send.  ";

    var direction = intent.slots.Message.value;
    var Rotaion = intent.slots.Recepient.value;

        var cardTitle = "Sending message to" + direction;
        speechOutput = "Sending message to" + direction;
		  //text();
        mqttPublish(intent, sessionAttributes, cardTitle, speechOutput, repromptText, shouldEndSession);
    
}



function mqttPublish(intent, sessionAttributes, cardTitle, speechOutput, repromptText, shouldEndSession)
{
	//var t = JSON.parse('{"name":"TextIntent","slots":{"Direction":{"name":"Direction","value":"left"},"Rotation":{"name":"Rotation","value":"40"}}}');
    var strIntent = JSON.stringify(intent);
    console.log("mqttPublish:  INTENT text = " + strIntent);
 function genericOperation(operation, state) {
      var clientToken = thingShadows[operation](thingName, state);

      if (clientToken === null) {
         //
         // The thing shadow operation can't be performed because another one
         // is pending; if no other operation is pending, reschedule it after an 
         // interval which is greater than the thing shadow operation timeout.
         //
        } else {
         
         // Save the client token so that we know when the operation completes.
         //
		 
         stack.push(clientToken);
		 return;
    }
   }

   function buildstate() {
	   
      var msgcontent = {
         Recepient: intent['slots']['Recepient']['value'],
         Message: intent['slots']['Message']['value']
              };

      //msgcontent.red = Math.floor(Math.random() * 255);
     // msgcontent.green = Math.floor(Math.random() * 255);
     // msgcontent.blue = Math.floor(Math.random() * 255);

      return {
         state: {
            desired : msgcontent
         }
      };
   }

   function mobileAppConnect() {
      thingShadows.register(thingName, {
         ignoreDeltas: false,
         operationTimeout: operationTimeout
      });
   }

   function deviceConnect() {
      thingShadows.register(thingName, {
         ignoreDeltas: true,
        // operationTimeout: operationTimeout
      });
      genericOperation('update', buildstate());
   }

   if (send_2rec_1 === 1) {
      mobileAppConnect();
   } else {
      deviceConnect();
	        
   }

   function handleStatus(thingName, stat, clientToken, stateObject) {
      var expectedClientToken = stack.pop();

      if (expectedClientToken === clientToken) {
         console.log('got \'' + stat + '\' status on: ' + thingName);
      } else {
         console.log('(status) client token mismtach on: ' + thingName);
      }

      if (send_2rec_1 === 2) {
         console.log('updated state to thing shadow');
         ctx.succeed(buildResponse(sessionAttributes, buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession)));

         // If no other operation is pending, restart it after 10 seconds.
         //

      }
   }

   function handleDelta(thingName, stateObject) {
      if (send_2rec_1 === 2) {
         console.log('unexpected delta in device mode: ' + thingName);
      } else {
         console.log('delta on: ' + thingName + JSON.stringify(stateObject));
      }
   }

   function handleTimeout(thingName, clientToken) {
      var expectedClientToken = stack.pop();

      if (expectedClientToken === clientToken) {
         console.log('timeout on: ' + thingName);
      } else {
         console.log('(timeout) client token mismtach on: ' + thingName);
      }

      if (send_2rec_1 === 2) {
         genericOperation('update', buildstate());
      }
   }

   thingShadows.on('connect', function() {
      console.log('connected to AWS IoT');
   });

   thingShadows.on('close', function() {
      
      thingShadows.unregister(thingName);
	  
	  
   });

   thingShadows.on('reconnect', function() {
      console.log('reconnect');
   });

   thingShadows.on('offline', function() {
      //
      // If any timeout is currently pending, cancel it.
      //
      if (currentTimeout !== null) {
         clearTimeout(currentTimeout);
         currentTimeout = null;
      }
      //
      // If any operation is currently underway, cancel it.
      //
      while (stack.length) {
         stack.pop();
      }
      console.log('offline');
   });

   thingShadows.on('error', function(error) {
      console.log('error', error);
   });

   thingShadows.on('message', function(topic, payload) {
      console.log('message', topic, payload.toString());
   });

   thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
      handleStatus(thingName, stat, clientToken, stateObject);
   });

   thingShadows.on('delta', function(thingName, stateObject) {
      handleDelta(thingName, stateObject);
   });

   thingShadows.on('timeout', function(thingName, clientToken) {
	   
      handleTimeout(thingName, clientToken);
   });

       

}


// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}


