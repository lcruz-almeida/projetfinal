const bookContainer = document.getElementById('bookContainer');
const body = document.body;
let isOpen = false;

let particleInterval = null;
let lumiereInterval = null;
let writingInterval = null;
let fireBox = null;

// =======================
// 🔊 SOM
// =======================
function playSound(id) {
    const a = document.getElementById(id);
    if (a) {
        a.currentTime = 0;
        a.play().catch(() => {});
    }
}

function stopSound(id) {
    const a = document.getElementById(id);
    if (a) {
        a.pause();
        a.currentTime = 0;
    }
}

// =======================
// ⛔ PARA TUDO (FUNÇÃO CENTRAL)
// =======================
function stopAllEffects() {

    // PARTICULES
    if (particleInterval) clearInterval(particleInterval);
    particleInterval = null;
    document.querySelectorAll('.particle').forEach(e => e.remove());
    stopSound("soundParticles");

    // FEU
    if (fireBox) {
        fireBox.remove();
        fireBox = null;
    }
    stopSound("soundFire");

    // VENT
    stopSound("soundWind");

    // SECOUER
    bookContainer.classList.remove("shake");
    stopSound("soundShake");

    // LUMIÈRE
    if (lumiereInterval) clearInterval(lumiereInterval);
    lumiereInterval = null;
    document.querySelectorAll(".magic-light").forEach(e => e.remove());
    stopSound("soundLumiere");

    // ÉCRITURE
    if (writingInterval) clearInterval(writingInterval);
    writingInterval = null;
    document.querySelectorAll(".bouncing-letter").forEach(e => e.remove());
    stopSound("soundWriting");
}

// =======================
// 📖 LIVRO
// =======================
function toggleBook() {
    isOpen = !isOpen;

    if (isOpen) {
        bookContainer.classList.add("open");
        setTimeout(() => playSound("soundPage"), 300);
        setTimeout(() => playSound("soundPage"), 500);
        setTimeout(() => playSound("soundPage"), 700);
    } else {
        bookContainer.classList.remove("open");
        stopAllEffects();
    }
}

// =======================
// 🎨 TEMA
// =======================
function toggleTheme() {
    body.classList.toggle("dark-mode");
}

// =======================
// ✨ PARTICULES
// =======================
function createParticle() {
    if (!isOpen) return;

    const p = document.createElement("div");
    p.className = "particle";

    const size = Math.random() * 10 + 5;
    p.style.width = size + "px";
    p.style.height = size + "px";

    const colors = ['#ffd700', '#ff9a9e', '#a18cd1', '#ffffff', '#84fab0'];
    const c = colors[Math.floor(Math.random() * colors.length)];
    p.style.background = c;
    p.style.boxShadow = `0 0 ${size * 3}px ${c}`;

    const origin = document.getElementById('particleOrigin').getBoundingClientRect();
    p.style.left = origin.left + "px";
    p.style.top = origin.top + "px";
    p.style.position = "fixed";

    p.style.setProperty('--tx', (Math.random() - 0.5) * 120 + "px");
    p.style.setProperty('--tx-end', (Math.random() - 0.5) * 700 + "px");
    p.style.animation = "floatUp 3s forwards";

    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3000);
}

function rainbowParticles() {
    if (!isOpen) return;

    stopAllEffects();
    playSound("soundParticles");

    particleInterval = setInterval(createParticle, 20);
}

// =======================
// 🔥 FEU
// =======================
function toggleFire() {
    if (!isOpen) return;

    stopAllEffects();

    fireBox = document.createElement("div");
    fireBox.className = "fire-container";

    fireBox.innerHTML = `
        <div class="flame"></div>
        <div class="flame small"></div>
        <div class="flame small2"></div>
        <div class="smoke"></div>
    `;

    document.body.appendChild(fireBox);
    playSound("soundFire");
}

// =======================
// 🌬️ VENT
// =======================
function flyPages() {
    if (!isOpen) return;

    stopAllEffects();
    playSound("soundWind");

    const pages = document.querySelectorAll('.page:not(.front-cover):not(.back-cover)');
    pages.forEach(page => {
        const clone = page.cloneNode(true);
        const r = page.getBoundingClientRect();

        clone.style.position = "fixed";
        clone.style.left = r.left + "px";
        clone.style.top = r.top + "px";
        clone.style.width = r.width + "px";
        clone.style.height = r.height + "px";
        clone.style.zIndex = 1000;
        clone.style.transition = "transform 4s ease-out, opacity 4s";

        document.body.appendChild(clone);

        requestAnimationFrame(() => {
            clone.style.transform =
                `translate(${(Math.random()-0.5)*1000}px, ${(Math.random()-0.5)*1000}px)
                 rotateX(${Math.random()*720}deg)
                 rotateY(${Math.random()*720}deg)`;
            clone.style.opacity = 0;
        });

        setTimeout(() => clone.remove(), 4000);
    });

    setTimeout(() => stopSound("soundWind"), 4000);
}

// =======================
// 🔁 SECOUER
// =======================
function shakeBook() {
    stopAllEffects();

    if (!isOpen) toggleBook();

    setTimeout(() => {
        bookContainer.classList.add("shake");
        playSound("soundShake");

        setTimeout(() => {
            bookContainer.classList.remove("shake");
            stopSound("soundShake");
        }, 2000);
    }, 1200);
}

// =======================
// 💡 LUMIÈRE
// =======================
function toggleLumiere() {
    if (!isOpen) return;

    stopAllEffects();
    playSound("soundLumiere");

    lumiereInterval = setInterval(() => {
        const l = document.createElement("div");
        l.className = "magic-light";
        document.body.appendChild(l);
        setTimeout(() => l.remove(), 1000);
    }, 200);
}

// =======================
// ✍️ ÉCRITURE
// =======================
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function startWriting() {
    if (!isOpen) toggleBook();

    stopAllEffects();
    playSound("soundWriting");

    writingInterval = setInterval(() => {
        const r = bookContainer.getBoundingClientRect();
        const l = document.createElement("div");
        l.className = "bouncing-letter";
        l.textContent = letters[Math.floor(Math.random() * letters.length)];
        l.style.left = r.left + Math.random() * r.width + "px";
        l.style.top = r.top + Math.random() * r.height + "px";
        document.body.appendChild(l);
        setTimeout(() => l.remove(), 8000);
    }, 120);
}

// =======================
// 🔄 RESET
// =======================
function resetBook() {
    stopAllEffects();
    isOpen = false;
    bookContainer.classList.remove("open");
    body.classList.remove("dark-mode");
}
