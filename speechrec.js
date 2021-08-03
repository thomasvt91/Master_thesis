const DRDoubleSDK = require("./DRDoubleSDK.js");

var d3 = new DRDoubleSDK();

var http = require('http');
var fs = require('fs');
// const tts = require('@google-cloud/text-to-speech');
const util = require("util");
// var player = require('play-sound') (opts = {});
// const say = require('say').Say
var gtts = require('node-gtts')('de');
var path = require('path')
const Audic = require('audic');



// var spoken = require('spoken');
// const domino = require('domino');

// const open = require('open');
// var speechSythesis = require('speech-synthesis')
// import { readFileSync } from 'fs';

// const DIST_FOLDER = join(process.cwd(), 'dist');
// const template = fs.readFileSync(join(DIST_FOLDER, 'browser', 'index.html')).toString();
// const winObj = domino.createWindow(template);global['window'] = winObj;
// global['document'] = winObj.document;


http.createServer(function (req, res) {
    fs.readFile('index.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(8000);


d3.on("connect", () => {
    d3.sendCommand("events.subscribe", {
        events: [
            "DRBase.status",
        ]
    });
    d3.sendCommand("screensaver.nudge");
    // d3.sendCommand("speaker.enable");
    // d3.sendCommand("gui.accessoryWebView.open",{url: ".", trusted: false});

    d3.sendCommand("gui.go.standby", {"url":"http://localhost:8000"});
    // let w = null;
    // if (typeof window !== "undefined") {
    //     w = window.localStorage.getItem('w');
    // }
    console.log("D3 connected");

    // open('http://localhost:3000');
    // d3.sendCommand("gui.accessoryWebView.open", {"url":"http://localhost:3000", "trusted": true});
    // texttospeech();
    // tts_spoken();
    gtts_tts();
    // tts_mozilla();
    // d3.sendCommand("base.requestStatus");
});

// function texttospeech(){
//     console.log('googleapi_tts called');
//     const client = new tts.TextToSpeechClient();
//     async function quickStart(){
//         const text = "Hallo. Hier spricht dein Roboter!";
//         const request = {
//             input: {text: text},
//             voice: {languageCode: 'de-DE', ssmlGender: 'MALE'},
//             audioConfig: {audioEncoding: 'wav'}
//         };
//         const [response] = await client.synthesizeSpeech(request);
//         const writeFile = util.promisify(fs.writeFile);
//         await writeFile('output.mp3', response.audioContent);
//
//         console.log('Audio content written to file: output.mp3');
//     }
//     quickStart();
//     // var player = require('play-sound')(opts = {})
//     d3.sendCommand('speaker.enable');
//     d3.sendCommand('speaker.requestVolume{"percent: 0.75"');
//
//     player.play('./output.mp3', function (err) {
//         if (err) throw err;
//         console.log("Audio finished");
//     });
// }

function gtts_tts(){
    console.log('gtts_tts called');
    var filepath = path.join(__dirname,'output.wav');
    var txt = 'Hallo, hier ist dein Double Roboter!';
    gtts.save(filepath, txt, function (){
        console.log('save done!');
    });
    d3.sendCommand('speaker.enable');
    d3.sendCommand('speaker.requestVolume{"percent: 0.2"');
    new Audic('output.wav').play();
    // player.play('./output.wav', function (err) {
    //     if (err) throw err;
    //     console.log("Audio finished");
    // });
    d3.sendCommand('speaker.disable');

}

// function tts_spoken() {
//     async function speak(){
//         spoken.recognition.language = navigator.language || 'de-DE';
//         let voices = (await spoken.voices()).filter( v => !v.lang.indexOf('de'))
//         spoken().say('hallo, hier spricht dein Roboter!', voices[0])
//     }
//     d3.sendCommand("speaker.enable");
//     speak();
//     d3.sendCommand("speaker.disable");
// }

// function tts_mozilla(){
//     console.log('tts called')
//     var msg = new SpeechSynthesisUtterance();
//     console.log('msg init')
//     msg.text = "Hallo. Hier spricht dein Double Roboter!";
//     msg.lang = 'de-DE';
//     msg.volume = 1;
//     msg.rate = 1;
//     msg.pitch = 2;
//     msg.onend = function (e){
//         (document.querySelector('#output').innerText = (event.elapsedTime/1000) + 'Sek');
//     }
//     d3.sendCommand("speaker.enable")
//     speechSynthesis.speak(msg);
//     d3.sendCommand("speaker.disable")
//
//
// }

// function tts_say(){
//     d3.sendCommand("speaker.enable")
//     speechSythesis('Hallo, dies ist ein Test!','de-DE');
//     d3.sendCommand("speaker.disable")
//
// }

function retract(){
    console.log("retract called");
    d3.sendCommand('base.kickstand.retract');
}

function deploy(){
    console.log("Deploy called");
    d3.sendCommand('base.kickstand.deploy');
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