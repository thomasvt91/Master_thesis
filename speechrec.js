const DRDoubleSDK = require("./DRDoubleSDK.js");

var d3 = new DRDoubleSDK();

d3.on("connect", () => {
    d3.sendCommand("events.subscribe", {
        events: [
            "DRBase.status",
        ]
    });
    d3.sendCommand("screensaver.nudge");
    d3.sendCommand("speaker.enable");
    // d3.sendCommand("base.requestStatus");
    tts();
});

function tts(){
    var msg = new SpeechSynthesisUtterance();
    msg.text = "Hallo. Hier spricht dein Double Roboter!";
    ms.lang = 'de-DE'
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 2;
    msg.onend = function (e){
        (document.querySelector('#output').innerText = (event.elapsedTime/1000) + 'Sek');
    }
    // d3.sendCommand("speaker.enable")
    speechSynthesis.speak(msg);

}



// Shutdown
var alreadyCleanedUp = false;
function exitHandler(options, exitCode) {
    console.log("Exiting with code:", exitCode, "Cleanup:", options.cleanup);

    if (options.cleanup && !alreadyCleanedUp) {
        alreadyCleanedUp = true;
        //TODO: things for cleanup
        d3.sendCommand("speaker.disable")
        // d3.sendCommand("camera.disable");
    }

    if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null, {cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {cleanup:true, exit:true})); // catches ctrl+c event
process.on('SIGTERM', exitHandler.bind(null, {cleanup:true, exit:true})); // catches SIGTERM event
process.on('uncaughtException', exitHandler.bind(null, {cleanup:true, exit:true})); // catches uncaught exceptions

d3.connect();