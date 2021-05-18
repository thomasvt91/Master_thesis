const tts = require('@google-cloud/text-to-speech');
const util = require('util')

function texttospeech(){

    const client = new tts.TextToSpeechClient();
    async function quickStart(){
        const text = "Hallo. Hier spricht dein Roboter!";
        const request = {
            input: {text: text},
            voice: {languageCode: 'de-DE', ssmlGender: 'MALE'},
            audioConfig: {audioEncoding: 'MP3'}
        };
        const [response] = await client.SynthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.mp3', response.audioContent, 'binary');
        console.log('Audio content written to file: output.mp3');
    }
    quickStart();
    var player = require('play-sound')(opts = {})

    player.play('./output.mp3', function (err) {
        if (err) throw err;
        console.log("Audio finished");
    });
}