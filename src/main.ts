const sliders = document.querySelectorAll<HTMLInputElement>(".slider");
const startButton = document.getElementById("start")!;

let audioCtx: AudioContext;
let sources: Record<string, AudioBufferSourceNode> = {};
let buffers: Record<string, AudioBuffer> = {};

const audioFiles = {
    base: "/audio/base.mp3",
    birds: "/audio/birds.mp3",
    rain: "/audio/rain.mp3",
    traffic: "/audio/traffic.mp3",
    footsteps: "/audio/footsteps.mp3",
};



// Charger un son
async function loadSound(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return audioCtx.decodeAudioData(arrayBuffer);
}

async function init() {
    audioCtx = new AudioContext();

    // Charger tous les sons
    for (const [key, path] of Object.entries(audioFiles)) {
        buffers[key] = await loadSound(path);
    }

    // Lecture de base
    playLoop("base");

    // Gestion des sliders
    sliders.forEach((slider) => {
        slider.addEventListener("input", handleSliderChange);
    });
}

function playLoop(name: string) {
    stopSound(name); // éviter les doublons
    const source = audioCtx.createBufferSource();
    source.buffer = buffers[name];
    source.loop = true;
    source.connect(audioCtx.destination);
    source.start();
    sources[name] = source;
}

function stopSound(name: string) {
    if (sources[name]) {
        sources[name].stop();
        delete sources[name];
    }
}

function handleSliderChange() {
    const values = Array.from(sliders).map((s) => Number(s.value));

    // Exemple de combinaisons
    if (values[1] > 80 && values[4] > 80) {
        if (!sources["birds"]) playLoop("birds");
    } else {
        stopSound("birds");
    }

    if (values[0] > 60 && values[2] > 60) {
        if (!sources["rain"]) playLoop("rain");
    } else {
        stopSound("rain");
    }

    if (values[3] > 70) {
        if (!sources["traffic"]) playLoop("traffic");
    } else {
        stopSound("traffic");
    }

    if (values.reduce((a, b) => a + b) / 5 > 50) {
        if (!sources["footsteps"]) playLoop("footsteps");
    } else {
        stopSound("footsteps");
    }

}

startButton.addEventListener("click", async () => {
    console.log("init")
    await init();
    startButton.style.display = "none";
});
