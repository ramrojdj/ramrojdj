// ABRE UN CONTEXTO PARA USAR EL SONIDO DEL DISPOSITIVO
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
// OSCILADOR PARA PRODUCIR LAS NOTAS 
let currentOscillator = null;

const PIANO = document.querySelector("#piano");
const CANCIONSECTION = document.querySelector("footer");

// FUNCION PARA REPRODUCIR UNA NOTA
function playNote(freq) {
    stopNote();

    let oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.connect(audioContext.destination);
    oscillator.start();

    return currentOscillator = oscillator;
};
// FUNCION PARA DETENER LA NOTA 
function stopNote() {
    if (currentOscillator) {
        return currentOscillator.stop();
    };
};

// FUNCION ASIGNA EL SONIDO DE LA NOTA 
function playKey(key) {
    switch (key) {
        case "cKey":
            playNote(261.63);
            break;
        case "c#Key":
            playNote(277.18);
            break;
        case "dKey":
            playNote(293.66);
            break;
        case "d#Key":
            playNote(311.13);
            break;
        case "eKey":
            playNote(329.63);
            break;
        case "fKey":
            playNote(349.23);
            break;
        case "f#Key":
            playNote(369.99);
            break;
        case "gKey":
            playNote(392.00);
            break;
        case "g#Key":
            playNote(415.30);
            break;
        case "aKey":
            playNote(440.00);
            break;
        case "a#Key":
            playNote(466.16);
            break;
        case "bKey":
            playNote(493.88);
            break;
        case "c2Key":
            playNote(523.25);
            break;
        default:
            false;
            break;
    };
    return true;
};
function untouchKey(event) {
    event.preventDefault();
    try {
        const tecla = event.target.closest("div");
        tecla.style.boxShadow = "2px 3px var(--oscuro)";
        stopNote();
    } catch (e) { "toca una tecla del piano. ", e.message };
};
function touchKey(event) {
    event.preventDefault();
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    };
    try {
        const tecla = event.target.closest("div");

        tecla.style.boxShadow = "0 0";
        playKey(tecla.id)

    } catch (e) { console.log("toca una tecla del piano. ", e.message) };
};
PIANO.addEventListener("mousedown", touchKey);
PIANO.addEventListener("mouseup", untouchKey);
PIANO.addEventListener("touchstart", touchKey);
PIANO.addEventListener("touchend", untouchKey);


const songHappyBirthday = [
    "C", "HAP-", "C", "PY", "D", "BIRTH-", "C", "DAY", "F", "TO", "E", "YOU",
    "C", "HAP-", "C", "PY", "D", "BIRTH-", "C", "DAY", "G", "TO", "F", "YOU",
    "C", "HAP-", "C", "PY", "C^", "BIRTH-", "A", "DAY",
    "F", "DEAR", "E", "FRY", "D", "END", "A#", "HAP-",
    "A#", "PY", "A", "BIRTH-", "F", "DAY", "G", "TO",
    "F", "YOU!"
];
const songHimnoAlegria = [
    "E", "", "E", "", "F#", "", "G", "", "G", "", "F#", "", "E", "", "D", "", "C", "",
    "C", "", "D", "", "E", "", "E", "", "D", "", "D", "", "E", "", "E", "",
    "F#", "", "G", "", "G", "", "F#", "", "E", "", "D", "", "C", "",
    "C", "", "D", "", "E", "", "E", "", "D", "", "D", "",
];



function formateaCancion(cancion) {
    const letraConFormato = [];
    const regexFINDNOTES = /^[CDEFGAB][#^]?$/;
    cancion.forEach((item, index) => {
        if (regexFINDNOTES.test(item)) {
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `<p class="lyric"></p><p class="note"></p>`;
            card.children[0].innerText = `${cancion[index + 1]}`;
            card.children[1].innerText = `${cancion[index]}`;

            letraConFormato.push(card);
        };
    });
    return letraConFormato;
};

let CONTADOR = 0;
let eventoNavegacion;

function muestraCancion(cancion) {
    const TAB = formateaCancion(cancion);
    const cardContainer = document.querySelector(".cardContainer");
    const navButton = document.querySelector("div.nav");

    function displayTab(inicio, final) {
        cardContainer.innerHTML = "";

        for (let i = inicio; i < final; i++) {
            cardContainer.appendChild(TAB[i]);
        }
    };

    function callDisplayTAB() {
        if (CONTADOR >= TAB.length) {
            CONTADOR = 0;
            navButton.innerText = "NEXT";
        };

        if (CONTADOR + 6 >= TAB.length) {
            navButton.innerHTML = "RESET";
        };
        let final = Math.min(CONTADOR + 6, TAB.length);

        displayTab(CONTADOR, final);
        CONTADOR += 6;
    };

    CONTADOR = 0;
    cardContainer.innerHTML = "";
    if (eventoNavegacion) {
        navButton.removeEventListener("click", eventoNavegacion);
    };

    eventoNavegacion = callDisplayTAB;
    navButton.addEventListener("click", eventoNavegacion);

    callDisplayTAB();
};

function switchActiveSong(newActive) {
    const oldActive = document.querySelector(".activeSong");
    if (oldActive) {
        oldActive.classList.remove("activeSong");
        newActive.classList.add("activeSong");
    }else{
        newActive.classList.add("activeSong");
    }
};
function handleSelectedSong(event) {
    const selectedSong = event.target.closest("h2");
    if (selectedSong.innerText === "Happy Birthday") {
        muestraCancion(songHappyBirthday);
        switchActiveSong(selectedSong);
    } else if (selectedSong.innerText === "Himno Alegria") {
        muestraCancion(songHimnoAlegria);
        switchActiveSong(selectedSong);
    };
};
CANCIONSECTION.addEventListener("click", handleSelectedSong);