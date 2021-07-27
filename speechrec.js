const DRDoubleSDK = require("./DRDoubleSDK.js");

var d3 = new DRDoubleSDK();

var http = require('http');
var fs = require('fs');
var speechSythesis = require('speech-synthesis')

http.createServer(function (req, res) {
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(3000);


d3.on("connect", () => {
    d3.sendCommand("events.subscribe", {
        events: [
            "DRBase.status",
        ]
    });
    d3.sendCommand("screensaver.nudge");
    d3.sendCommand("speaker.enable");
    // d3.sendCommand("gui.accessoryWebView.open",{url: ".", trusted: false});
    d3.sendCommand("gui.accessoryWebView.open", {"url":"http://localhost:3000", "trusted": true});
    // d3.sendCommand("base.requestStatus");
    console.log("D3 connected")
});

function tts_mozilla(){
    console.log('tts called')
    var msg = new SpeechSynthesisUtterance();
    console.log('msg init')
    msg.text = "Hallo. Hier spricht dein Double Roboter!";
    ms.lang = 'de-DE';
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 2;
    msg.onend = function (e){
        (document.querySelector('#output').innerText = (event.elapsedTime/1000) + 'Sek');
    }
    d3.sendCommand("speaker.enable")
    speechSynthesis.speak(msg);

}

function tts_speechsynth(){
    d3.sendCommand("speaker.enable")
    speechSythesis('Hallo, dies ist ein Test!','de-DE');
}



function stt(){

}



// Shutdown
var alreadyCleanedUp = false;
function exitHandler(options, exitCode) {
    console.log("Exiting with code:", exitCode, "Cleanup:", options.cleanup);

    if (options.cleanup && !alreadyCleanedUp) {
        alreadyCleanedUp = true;
        //TODO: things for cleanup
        d3.sendCommand("speaker.disable")
        d3.sendCommand("gui.accessoryWebView.close")
        // d3.sendCommand("camera.disable");
    }

    if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null, {cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {cleanup:true, exit:true})); // catches ctrl+c event
process.on('SIGTERM', exitHandler.bind(null, {cleanup:true, exit:true})); // catches SIGTERM event
process.on('uncaughtException', exitHandler.bind(null, {cleanup:true, exit:true})); // catches uncaught exceptions

d3.connect();
// tts();