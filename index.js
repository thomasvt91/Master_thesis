const google_cloud_tts = require('@google-cloud/text-to-speech');
const fs = require('fs');
const tts = require('@google-cloud/text-to-speech');
const util = require("util");
const player = require('play-sound')(opts = {});
// const say = require('say').Say
const gtts = require('node-gtts')('de');
const path = require('path');


const spoken = require('spoken');
// const domino = require('domino');


// DRDoubleSDK is a global object loaded in by Electron in the Standby window and a "Trusted" Accessory window
if (!("DRDoubleSDK" in window)) {
	console.error("window.DRDoubleSDK not found. This is required.");
}
// const d3 = DRDoubleSDK;

function q(selector) {
	return document.querySelector(selector);
}

DRDoubleSDK.on("event", (message) => {
	// Event messages include: { class: "DRNetwork", key: "info", data: {...} }
	switch (message.class + "." + message.key) {

		// DRNetwork
		case "DRNetwork.info": {
			q("#wifi_ssid").innerText = (message.data.connection == "connected" && message.data.ssid) ? message.data.ssid : "Unknown";
			q("#wifi_ip").innerText = message.data.internalIp;
			break;
		}

	}
});

function onConnect() {
	if (DRDoubleSDK.isConnected()) {
		DRDoubleSDK.resetWatchdog();

		// Subscribe to events that you will process. You can subscribe to more events at any time.
		DRDoubleSDK.sendCommand("events.subscribe", {
			events: [
				"DRBase.status",
				"DRNetwork.info",
			]
		});

		// Send commands any time – here, we're requesting initial info to show
		DRDoubleSDK.sendCommand("network.requestInfo");
		DRDoubleSDK.sendCommand("base.requestStatus");

		// Turn on the screen, but allow the screensaver to kick in later
		DRDoubleSDK.sendCommand("screensaver.nudge");
		console.log('connected from index.js')
		// DRDoubleSDK.sendCommand("speaker.enable")
		// tts();

	} else {
		window.setTimeout(onConnect, 100);
	}
}
// function tts(){
// 	console.log('tts called');
// 	var msg = new SpeechSynthesisUtterance();
// 	msg.text = "Hallo. Hier spricht dein Double Roboter!";
// 	ms.lang = 'de-DE'
// 	msg.volume = 1;
// 	msg.rate = 1;
// 	msg.pitch = 2;
// 	msg.onend = function (e){
// 		(document.querySelector('#output').innerText = (event.elapsedTime/1000) + 'Sek');
// 	}
// 	DRDoubleSDK.sendCommand("speaker.enable");
// 	speechSynthesis.speak(msg);
// 	DRDoubleSDK.sendCommand("speaker.disable");
// }

function tts_googlecloud(){
	console.log('tts_googlecloud called ')
	const client = new google_cloud_tts.TextToSpeechClient();
	async function quickStart(){
		const text = "Hallo. Hier spricht dein Roboter!";
		const request = {
			input: {text: text},
			voice: {languageCode: 'de-DE', ssmlGender: 'MALE'},
			audioConfig: {audioEncoding: 'MP3'}
		};
		const [response] = await client.synthesizeSpeech(request);
		const writeFile = util.promisify(fs.writeFile);
		await writeFile('output.mp3', response.audioContent,'binary');

		console.log('Audio content written to file: output.mp3');
	}
	quickStart();
	// var player = require('play-sound')(opts = {})
	DRDoubleSDK.sendCommand('speaker.enable');
	DRDoubleSDK.sendCommand('speaker.requestVolume{"percent: 1"');
	player.play('./output.mp3', function (err) {
		if (err) throw err;
		console.log("Audio finished");
	});
}

function tts_spoken() {
	console.log('tts_spoken called');
    async function speak(){
        spoken.recognition.language = navigator.language || 'de-DE';
        let voices = (await spoken.voices()).filter( v => !v.lang.indexOf('de'))
        spoken().say('hallo, hier spricht dein Roboter!', voices[0])
    }
    DRDoubleSDK.sendCommand("speaker.enable");
	DRDoubleSDK.sendCommand('speaker.requestVolume{"percent: 1"');
    speak();
    DRDoubleSDK.sendCommand("speaker.disable");
}

function gtts_tts(){
	console.log('gtts_tts called');
	var filepath = path.join(__dirname,'output.wav');
	var txt = 'Hallo, hier ist dein Double Roboter!';
	gtts.save(filepath, txt, function (){
		console.log('save done!');
	});
	DRDoubleSDK.sendCommand('speaker.enable');
	DRDoubleSDK.sendCommand('speaker.requestVolume{"percent: 0.75"');
	player.play('./output.wav', function (err) {
		if (err) throw err;
		console.log("Audio finished");
	});
	DRDoubleSDK.sendCommand('speaker.disable');

}

function tts_mozilla(){
    console.log('tts mozilla called');
    var msg = new SpeechSynthesisUtterance();
    console.log('msg init')
    msg.text = "Hallo. Hier spricht dein Double Roboter!";
    msg.lang = 'de-DE';
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 2;
    msg.onend = function (e){
        (document.querySelector('#output').innerText = (event.elapsedTime/1000) + 'Sek');
    }
    DRDoubleSDK.sendCommand("speaker.enable")
	DRDoubleSDK.sendCommand('speaker.requestVolume{"percent: 1"');
    speechSynthesis.speak(msg);
    DRDoubleSDK.sendCommand("speaker.disable")


}

// function tts_say(){
//     DRDoubleSDK.sendCommand("speaker.enable")
//     speechSythesis('Hallo, dies ist ein Test!','de-DE');
//     DRDoubleSDK.sendCommand("speaker.disable")
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

window.onload = () => {
	// REQUIRED: Tell d3-api that we're still running ok (faster than every 3000 ms) or the page will be reloaded.
	window.setInterval(() => {
		DRDoubleSDK.resetWatchdog();
	}, 2000);

	// DRDoubleSDK 
	onConnect();
	DRDoubleSDK.on("connect", () => {
		onConnect();
	});
};