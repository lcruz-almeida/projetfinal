// ========================= VARIÁVEIS GLOBAIS =========================
const bookContainer = document.getElementById('bookContainer');
const body = document.body;
let isOpen = false;
let particleInterval = null;
let particlesActive = false;
let fireActive = false;
let fireBox = null;
let sparkLoop = null;
let lumiereActive = false;
let lumiereInterval = null;
let writingActive = false;
let writingInterval = null;

// ========================= SONS =========================
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Erro de áudio: " + e));
    }
}

function stopSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

// ========================= TEMAS =========================
function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.style.transition = 'background 1.5s ease, color 1.5s ease';
    setTimeout(() => { body.style.transition = ''; }, 1600);
}

// ========================= LIVRO =========================
function toggleBook() {
    isOpen = !isOpen;
    if (isOpen) {
        bookContainer.classList.add('open');
        const pageTurnDelay = 200;
        setTimeout(() => playSound('soundPage'), 300);
        setTimeout(() => playSound('soundPage'), 300 + pageTurnDelay);
        setTimeout(() => playSound('soundPage'), 300 + 2 * pageTurnDelay);
    } else {
        bookContainer.classList.remove('open');
        clearTimeout(magicTimeout);
        stopAllEffects();
    }
}

// ========================= PARTICULAS =========================
function createParticle() {
    if (!isOpen) return;

    const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

    const particle = document.createElement('div');
    particle.classList.add('particle');

    const size = Math.random() * 12 + 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    const currentColors = body.classList.contains('dark-mode')
        ? ['#ffffff', '#cfcfcf', '#a0a0ff', '#ffd700', '#e0e0ff']
        : colors;

    const color = currentColors[Math.floor(Math.random() * currentColors.length)];
    particle.style.background = color;
    particle.style.boxShadow = `0 0 ${size * 3}px ${color}`;

    const origin = document.getElementById('particleOrigin').getBoundingClientRect();
    const startX = origin.left + origin.width / 2;
    const startY = origin.top + origin.height / 2;

    const tx = (Math.random() - 0.5) * 120;
    const txEnd = (Math.random() - 0.5) * 700;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--tx-end', `${txEnd}px`);

    const duration = Math.random() * 2 + 2;
    particle.style.animation = `floatUp ${duration}s ease-out forwards`;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
}

function startMagic() {
    stopMagic();
    for (let i = 0; i < 100; i++) setTimeout(createParticle, i * 15);
    particleInterval = setInterval(createParticle, 15);
}

function stopMagic() {
    if (particleInterval) clearInterval(particleInterval);
}

// Função do botão Partículas
function rainbowParticles() {
    if (!isOpen) return;
    stopAllEffects();
    startMagic();
    playSound("soundParticles");
    particlesActive = true;
}

// ========================= VENTO =========================
function flyPages() {
    if (!isOpen) return;
    stopAllEffects();

    const windSound = document.getElementById('soundWind');
    windSound.currentTime = 0;
    windSound.play().catch(e => console.log("Erro de áudio: " + e));

    const pages = document.querySelectorAll('.page:not(.front-cover):not(.back-cover)');
    const repeat = 10;
    const totalClones = pages.length * repeat;

    for (let i = 0; i < totalClones; i++) {
        setTimeout(() => {
            const page = pages[i % pages.length];
            const flyingPage = page.cloneNode(true);
            const rect = page.getBoundingClientRect();

            flyingPage.style.position = 'absolute';
            flyingPage.style.left = `${rect.left}px`;
            flyingPage.style.top = `${rect.top}px`;
            flyingPage.style.width = `${rect.width}px`;
            flyingPage.style.height = `${rect.height}px`;
            flyingPage.style.zIndex = 1000;
            flyingPage.style.pointerEvents = 'none';
            flyingPage.style.transition = 'transform 6s ease-out, opacity 6s ease-out';

            document.body.appendChild(flyingPage);

            const endX = (Math.random() - 0.5) * window.innerWidth * 2;
            const endY = (Math.random() - 0.5) * window.innerHeight * 2;
            const rotateX = (Math.random() - 0.5) * 1080;
            const rotateY = (Math.random() - 0.5) * 1080;

            requestAnimationFrame(() => {
                flyingPage.style.transform = `translate(${endX}px, ${endY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                flyingPage.style.opacity = 0;
            });

            setTimeout(() => flyingPage.remove(), 4000);
        }, i * 100);
    }

    setTimeout(() => {
        windSound.pause();
        windSound.currentTime = 0;
    }, 4000 + totalClones * 50);
}

// ========================= SACUDIR LIVRO =========================
function shakeBook() {
    if (!isOpen) toggleBook();
    stopAllEffects();

    bookContainer.classList.add('shake');
    playSound("soundShake");

    setTimeout(() => {
        bookContainer.classList.remove('shake');
        stopSound("soundShake");
    }, 2000);
}

// ========================= FOGO =========================
function startFire() {
    stopFire();

    fireBox = document.createElement("div");
    fireBox.classList.add("fire-container");

    const f1 = document.createElement("div");
    f1.classList.add("flame");
    const f2 = document.createElement("div");
    f2.classList.add("flame", "small");
    const f3 = document.createElement("div");
    f3.classList.add("flame", "small2");
    const smoke = document.createElement("div");
    smoke.classList.add("smoke");

    fireBox.appendChild(f1);
    fireBox.appendChild(f2);
    fireBox.appendChild(f3);
    fireBox.appendChild(smoke);
    document.body.appendChild(fireBox);

    playSound("soundFire");
}

function stopFire() {
    if (fireBox) {
        fireBox.remove();
        fireBox = null;
    }
    if (sparkLoop) {
        clearInterval(sparkLoop);
        sparkLoop = null;
    }
    stopSound("soundFire");
}

function toggleFire() {
    if (!isOpen) return;
    stopAllEffects();
    startFire();
    fireActive = true;
}

// ========================= LUMIÈRE =========================
function createMagicLight() {
    if (!isOpen) return;
    const light = document.createElement('div');
    light.classList.add('magic-light');

    const bookRect = bookContainer.getBoundingClientRect();
    const lightWidth = 300;
    const lightHeight = 300;
    const x = bookRect.left + bookRect.width / 2 - lightWidth / 2 - 80;
    const y = bookRect.top + bookRect.height / 2 - lightHeight / 2;

    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    light.style.position = 'fixed';
    light.style.zIndex = 9999;
    light.style.transform = 'none';

    document.body.appendChild(light);
    setTimeout(() => light.remove(), 1000);
}

function toggleLumiere(forceOff = false) {
    if (!isOpen) return;

    const audio = document.getElementById("soundLumiere");

    if (forceOff || lumiereActive) {
        if (audio) { audio.pause(); audio.currentTime = 0; }
        clearInterval(lumiereInterval);
        lumiereInterval = null;
        document.querySelectorAll('.magic-light').forEach(el => el.remove());
        lumiereActive = false;
    } else {
        if (audio) { audio.currentTime = 0; audio.play().catch(e => console.log("Erro de áudio: " + e)); }
        lumiereInterval = setInterval(createMagicLight, 200);
        lumiereActive = true;
    }
}

function toggleLumiereButton() {
    stopAllEffects();
    toggleLumiere();
}

// ========================= ESCRITA =========================
function startWriting() {
    if (!isOpen) toggleBook();
    stopAllEffects();

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const colors = ['red','blue','green','yellow','pink'];

    writingActive = true;
    playSound("soundWriting");

    writingInterval = setInterval(() => {
        const bookRect = bookContainer.getBoundingClientRect();
        const letter = document.createElement('div');
        letter.classList.add('bouncing-letter');
        letter.textContent = letters.charAt(Math.floor(Math.random() * letters.length));
        letter.style.color = colors[Math.floor(Math.random() * colors.length)];

        const x = bookRect.left + Math.random() * bookRect.width;
        const y = bookRect.top + Math.random() * bookRect.height;
        letter.style.left = `${x}px`;
        letter.style.top = `${y}px`;
        letter.style.position = 'absolute';

        const scale = 0.5 + Math.random();
        letter.style.transform = `scale(${scale}) rotate(${Math.random() * 360}deg)`;

        document.body.appendChild(letter);
        setTimeout(() => letter.remove(), 10000);
    }, 100);
}

function stopWriting() {
    writingActive = false;
    if (writingInterval) clearInterval(writingInterval);
    writingInterval = null;
    document.querySelectorAll('.bouncing-letter').forEach(el => el.remove());
    stopSound("soundWriting");
}

// ========================= STOP ALL EFFECTS =========================
function stopAllEffects() {
    stopMagic();
    stopSound("soundParticles");
    particlesActive = false;

    stopFire();
    fireActive = false;

    toggleLumiere(true);
    lumiereActive = false;

    stopWriting();
    writingActive = false;

    const windSound = document.getElementById('soundWind');
    if (windSound) { windSound.pause(); windSound.currentTime = 0; }

    document.querySelectorAll('.particle, .fire-container, .magic-light, .bouncing-letter').forEach(el => el.remove());
}

// ========================= RESET LIVRO =========================
function resetBook() {
    isOpen = false;
    bookContainer.classList.remove('open');

    if (body.classList.contains('dark-mode')) body.classList.remove('dark-mode');

    stopAllEffects();
}
