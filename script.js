const bookContainer = document.getElementById('bookContainer');
const body = document.body;
let isOpen = false;
let particleInterval;
let magicTimeout;
let fireInterval = null;

// Cores mágicas para partículas
const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];

// FUNÇÃO PARA TOCAR SOM
function playSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Erro de áudio: " + e));
    }
}

// FUNÇÃO PARA PARAR SOM
function stopSound(audioId) {
    const audio = document.getElementById(audioId);
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
}

// =======================
// ⛔ FUNÇÃO CENTRAL: PARA TODOS OS EFEITOS E SONS
// =======================
function stopAllEffects() {
    // PARTICULES
    particlesActive = false;
    stopMagic();
    stopSound("soundParticles");

    // FEU
    fireActive = false;
    stopFire();

    // VENT
    stopSound("soundWind");

    // SECOUER
    bookContainer.classList.remove("shake");
    stopSound("soundShake");

    // LUMIÈRE
    lumiereActive = false;
    if (lumiereInterval) clearInterval(lumiereInterval);
    lumiereInterval = null;
    document.querySelectorAll(".magic-light").forEach(el => el.remove());
    stopSound("soundLumiere");

    // ÉCRITURE
    stopWriting();
}

// Alternar tema (dark/light)
function toggleTheme() {
    body.classList.toggle('dark-mode');
    body.style.transition = 'background 1.5s ease, color 1.5s ease';
    setTimeout(() => { body.style.transition = ''; }, 1600);
}

// Abrir/fechar livro
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
    
// BUTTON PARTICULES
let particlesActive = false;

function createParticle() {
    if (!isOpen) return;

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

    particle.style.left = startX + "px";
    particle.style.top = startY + "px";
    particle.style.position = "fixed";

    const tx = (Math.random() - 0.5) * 120;
    const txEnd = (Math.random() - 0.5) * 700;
    particle.style.setProperty('--tx', `${tx}px`);
    particle.style.setProperty('--tx-end', `${txEnd}px`);

    const duration = Math.random() * 2 + 2;
    particle.style.animation = `floatUp ${duration}s ease-out forwards`;

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), duration * 1000);
}

function rainbowParticles() {
    if (!isOpen) return;

    stopAllEffects(); // ⛔ PARA TUDO
    startMagic();
    playSound("soundParticles"); 
    particlesActive = true;
}

function startMagic() {
    stopMagic();
    for (let i = 0; i < 100; i++) setTimeout(createParticle, i * 15);
    particleInterval = setInterval(createParticle, 15);
}

function stopMagic() {
    if (particleInterval) clearInterval(particleInterval);
}

// BUTTON VENT
function flyPages() {
    if (!isOpen) return;

    stopAllEffects(); // ⛔ PARA TUDO

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

// BUTTON SECOUER
function shakeBook() {
    stopAllEffects(); // ⛔ PARA TUDO

    if (!isOpen) {
        toggleBook();
        setTimeout(() => {
            bookContainer.classList.add('shake');
            playSound("soundShake");
            setTimeout(() => {
                bookContainer.classList.remove('shake');
                stopSound("soundShake");
            }, 500);
        }, 1200);
    } else {
        bookContainer.classList.add('shake');
        playSound("soundShake");
        setTimeout(() => {
            bookContainer.classList.remove('shake');
            stopSound("soundShake");
        }, 2000);
    }
}

// BUTTON LUMIERE
let lumiereActive = false;
let lumiereInterval = null;

function createMagicLight() {
    if (!isOpen) return;

    const light = document.createElement('div');
    light.classList.add('magic-light');

    const bookRect = document.getElementById('bookContainer').getBoundingClientRect();
    const lightWidth = 300;
    const lightHeight = 300;
    const x = bookRect.left + bookRect.width / 2 - lightWidth / 2;
    const y = bookRect.top - lightHeight / 2; // acima do livro

    document.body.appendChild(light);
    light.style.left = `${x}px`;
    light.style.top = `${y}px`;
    light.style.position = 'fixed';
    light.style.zIndex = 9999;
    light.style.transform = 'none';

    setTimeout(() => light.remove(), 1000);
}

function toggleLumiere() {
    if (!isOpen) return;

    stopAllEffects(); // ⛔ PARA TUDO

    const audio = document.getElementById("soundLumiere");
    if (audio) { audio.currentTime = 0; audio.play().catch(()=>{}); }

    lumiereInterval = setInterval(createMagicLight, 200);
    lumiereActive = true;
}

// BUTTON FEU
let fireActive = false;
let fireBox = null;

function toggleFire() {
    if (!isOpen) return;

    stopAllEffects(); // ⛔ PARA TUDO

    startFire();
    fireActive = true;
}

// BUTTON ÉCRITURE
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let writingActive = false;
let writingInterval = null;

function startWriting() {
    if (!isOpen) toggleBook();

    stopAllEffects(); // ⛔ PARA TUDO

    writingActive = true;
    playSound("soundWriting");

    writingInterval = setInterval(() => {
        const bookRect = document.getElementById('bookContainer').getBoundingClientRect();
        const letter = document.createElement('div');
        letter.classList.add('bouncing-letter');

        letter.textContent = letters.charAt(Math.floor(Math.random() * letters.length));

        const colors = ['red','blue','green','yellow','pink'];
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

// RESET
function resetBook() {
    isOpen = false;
    bookContainer.classList.remove('open');
    if (document.body.classList.contains('dark-mode')) document.body.classList.remove('dark-mode');

    stopAllEffects();
    document.querySelectorAll('.particle, .fire, .magic.beam').forEach(el => el.remove());   
}
