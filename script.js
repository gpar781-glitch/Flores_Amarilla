// ----------------------------------------------------
// 1. LÓGICA DEL CONTADOR DE TIEMPO (Sin cambios)
// ----------------------------------------------------
const startDate = new Date();
// Ajusta la fecha a tu aniversario: new Date('2023-04-10T00:00:00')
startDate.setDate(startDate.getDate() - 364);
startDate.setHours(startDate.getHours() - 23);
startDate.setMinutes(startDate.getMinutes() - 59);

function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    const format = (num) => num.toString().padStart(2, '0');

    document.getElementById("counter").innerText =
        `${days} días ${format(hours)} horas ${format(minutes)} minutos ${format(seconds)} segundos`;
}
setInterval(updateCounter, 1000);
updateCounter();


// ----------------------------------------------------
// 2. LÓGICA DEL TEXTO TIPO MÁQUINA DE ESCRIBIR (Sin cambios)
// ----------------------------------------------------
const messages = [
    "Sana sana colita de rana , si no sana hoy sanara mañana :3.",
    "Unos makis p' ti :3",
    "- Moay cuidate mucho"
];

let currentMessage = 0;
let currentChar = 0;
let typingElement = document.getElementById("typing-text");

function typeWriter() {
    if (currentMessage < messages.length) {
        if (currentChar < messages[currentMessage].length) {
            typingElement.innerHTML += messages[currentMessage].charAt(currentChar);
            currentChar++;
            setTimeout(typeWriter, 40);
        } else {
            typingElement.innerHTML += "<br><br>";
            currentMessage++;
            currentChar = 0;
            setTimeout(typeWriter, 1200);
        }
    }
}
// Se inicia typeWriter junto con la animación de las flores


// ----------------------------------------------------
// 3. LÓGICA DEL ÁRBOL Y LOS 3 CORAZONES (CANVAS)
// ----------------------------------------------------
const canvas = document.getElementById("treeCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 700; // Un poco más alto para el tronco y el corazón

// Función del girasol individual (sin cambios)
function drawFlower(x, y, scale) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Pétalos
    ctx.fillStyle = "#FFD700";
    for (let i = 0; i < 15; i++) {
        ctx.rotate(Math.PI / 7.5);
        ctx.beginPath();
        ctx.ellipse(0, 8, 3, 12, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    // Centro del girasol
    ctx.fillStyle = "#6B4226";
    ctx.beginPath();
    ctx.arc(0, 0, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}

// Función para dibujar el árbol de manera progresiva
function drawGrowingTree(startX, startY, len, angle, branchWidth, levelLimit, level, progress) {
    if (progress <= 0) return [];

    let currentLen = len * Math.min(1, progress);

    ctx.save();
    ctx.strokeStyle = "#4A2F1D";
    ctx.fillStyle = "#4A2F1D";
    ctx.lineWidth = branchWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI / 180);

    ctx.beginPath();
    ctx.moveTo(0, 0);

    if (level === 0) {
        ctx.quadraticCurveTo(10, -currentLen / 2, 0, -currentLen);
    } else {
        ctx.lineTo(0, -currentLen);
    }
    ctx.stroke();

    if (level === 0 && progress > 0.5) {
        let rootProg = Math.min(1, (progress - 0.5) * 2);
        ctx.beginPath();
        ctx.moveTo(-branchWidth * 1.2 * rootProg, 0);
        ctx.quadraticCurveTo(0, -40 * rootProg, branchWidth * 1.2 * rootProg, 0);
        ctx.fill();

        ctx.strokeStyle = "#331E10";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, -20); ctx.lineTo(-10, -110 * rootProg);
        ctx.moveTo(10, -40); ctx.lineTo(15, -140 * rootProg);
        ctx.moveTo(-2, -60); ctx.lineTo(3, -150 * rootProg);
        ctx.stroke();
    }

    let tips = [];
    level++;
    let childProgress = progress - 1;

    if (level >= levelLimit) {
        if (progress >= 1) {
            const endCoords = ctx.getTransform().transformPoint(new DOMPoint(0, -len));
            tips.push(endCoords);
        }
    } else if (childProgress > 0) {
        const tips1 = drawGrowingTree(0, -len, len * 0.7, 30, branchWidth * 0.7, levelLimit, level, childProgress * 1.5);
        const tips2 = drawGrowingTree(0, -len, len * 0.7, -30, branchWidth * 0.7, levelLimit, level, childProgress * 1.5);
        tips = tips1.concat(tips2);
    }

    ctx.restore();
    return tips;
}

// Función para animar el crecimiento completo del árbol
function animateTreeGrowth(finishCallback) {
    let progress = 0;
    let tips = [];
    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        tips = drawGrowingTree(canvas.width / 2, canvas.height, 160, 0, 40, 3, 0, progress);
        progress += 0.03;

        if (progress < 3.5) {
            requestAnimationFrame(loop);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            tips = drawGrowingTree(canvas.width / 2, canvas.height, 160, 0, 40, 3, 0, 10);
            finishCallback(tips);
        }
    }
    loop();
}

// Función para animar el florecimiento individual
function drawBloomingFlower(x, y, finalSize) {
    let currentSize = 0;
    function bloom() {
        currentSize += finalSize / 15;
        if (currentSize > finalSize) currentSize = finalSize;
        drawFlower(x, y, currentSize);
        if (currentSize < finalSize) {
            requestAnimationFrame(bloom);
        }
    }
    bloom();
}

// Función para dibujar un corazón de girasoles
function drawHeartShape(cx, cy, scale, totalFlowers) {
    let flowersDrawn = 0;

    function addHeartFlower() {
        if (flowersDrawn < totalFlowers) {
            let x = (Math.random() - 0.5) * 40;
            let y = (Math.random() - 0.5) * 40;

            let eqX = x / 10;
            let eqY = y / 10;
            let formula = Math.pow(eqX * eqX + eqY * eqY - 1, 3) - (eqX * eqX * Math.pow(eqY, 3));

            if (formula <= 0) {
                let drawX = cx + (x * scale);
                let drawY = cy - (y * scale);

                let size = Math.random() * 0.3 + 0.3;
                drawBloomingFlower(drawX, drawY, size);
                flowersDrawn++;
            }
            requestAnimationFrame(addHeartFlower);
        }
    }

    // Usamos menos hilos para que el florecimiento se vea más progresivo
    for (let i = 0; i < 5; i++) {
        setTimeout(addHeartFlower, i * 200);
    }
}

// Función principal para posicionar los corazones
function spawnHearts(tips) {
    if (!tips || tips.length === 0) return;
    const centerX = (tips[0].x + tips[tips.length - 1].x) / 2;
    const centerY = (tips[1].y + tips[2].y) / 2 - 40;
    drawHeartShape(centerX, centerY, 25, 1400);
}

// Iniciar animaciones
setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animateTreeGrowth((tips) => {
        spawnHearts(tips);
        typeWriter();

        // Empezar a generar pétalos cayendo un poco después de que salen los corazones
        setTimeout(createFallingPetals, 2000);
    });
}, 500);

// ----------------------------------------------------
// 4. LÓGICA DE LUCIÉRNAGAS (PARTÍCULAS MÁGICAS)
// ----------------------------------------------------
function createFireflies() {
    const fireflyCount = 40; // Cantidad de luciérnagas
    for (let i = 0; i < fireflyCount; i++) {
        let firefly = document.createElement("div");
        firefly.classList.add("firefly");

        // Tamaño aleatorio (entre 2px y 5px)
        let size = Math.random() * 3 + 2;
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;

        // Posición horizontal aleatoria
        firefly.style.left = `${Math.random() * 100}vw`;

        // Retrasos y duraciones aleatorias para que el movimiento se vea natural y no sincronizado
        firefly.style.animationDelay = `${Math.random() * 10}s, ${Math.random() * 3}s`;
        firefly.style.animationDuration = `${Math.random() * 15 + 10}s, ${Math.random() * 2 + 2}s`;

        // Agregar variable para balanceo aleatorio (zig-zag)
        firefly.style.setProperty('--sway-amount', `${Math.random() * 60 - 30}px`);

        document.body.appendChild(firefly);
    }
}
createFireflies();

// ----------------------------------------------------
// 5. LÓGICA DE PÉTALOS CAYENDO
// ----------------------------------------------------
function createFallingPetals() {
    const canvasContainer = document.querySelector(".canvas-container");
    const petalCount = 20; // Menos pétalos para no recargar visualmente
    for (let i = 0; i < petalCount; i++) {
        let petal = document.createElement("div");
        petal.classList.add("falling-petal");

        // Posicionarlos aleatoriamente pero centrados en el área del árbol (20% a 80% del contenedor)
        petal.style.left = `${Math.random() * 60 + 20}%`;
        petal.style.animationDelay = `${Math.random() * 10}s`;
        petal.style.animationDuration = `${Math.random() * 5 + 6}s`;

        petal.style.setProperty('--sway-amount', `${Math.random() * 80 - 40}px`);
        petal.style.setProperty('--rot-start', `${Math.random() * 360}deg`);
        petal.style.setProperty('--rot-end', `${Math.random() * 360 + 360}deg`);

        canvasContainer.appendChild(petal);
    }
}
// createFallingPetals(); ahora se llama desde la animación del árbol

// ----------------------------------------------------
// 6. LÓGICA DE MÚSICA DE FONDO
// ----------------------------------------------------
const musicBtn = document.getElementById("music-btn");
const bgMusic = document.getElementById("bg-music");
let isPlaying = false;

bgMusic.volume = 0.4; // Volumen suave

// Sincronizar estado visual con el estado real del audio
bgMusic.addEventListener("play", () => {
    isPlaying = true;
    musicBtn.classList.add("playing");
    musicBtn.innerHTML = "🎶";
});

bgMusic.addEventListener("pause", () => {
    isPlaying = false;
    musicBtn.classList.remove("playing");
    musicBtn.innerHTML = "🎵";
});

musicBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Evitar doble ejecución con el clic global
    if (isPlaying) {
        bgMusic.pause();
    } else {
        bgMusic.play().catch(() => { });
    }
});

// Forzar inicio de la música al primer clic o interacción en la pantalla 
// (ya que los navegadores suelen bloquear el autoplay automático puro)
document.body.addEventListener("click", () => {
    if (!isPlaying) {
        bgMusic.play().catch(() => { });
    }
}, { once: true });

// ----------------------------------------------------
// 7. LÓGICA PARALLAX 3D (INTERACTIVIDAD CON EL MOUSE)
// ----------------------------------------------------
document.addEventListener("mousemove", (e) => {
    // Calculamos el centro de la pantalla
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Obtenemos la posición del mouse relativa al centro (de -1 a 1)
    const mouseX = (e.clientX - centerX) / centerX;
    const mouseY = (e.clientY - centerY) / centerY;

    // Aplicamos movimiento al canvas (Árbol) en el eje opuesto para dar profundidad
    const canvasContainer = document.querySelector('.canvas-container');
    if (canvasContainer) {
        // Reducimos los multiplicadores para hacerlo más sutil y elegante
        canvasContainer.style.transform = `translate(${mouseX * -6}px, ${mouseY * -6}px) rotateY(${mouseX * 2.5}deg) rotateX(${mouseY * -2.5}deg)`;
    }

    // Movimiento a las tarjetas Glassmorphism (Texto y Contador) en la misma dirección
    const textSection = document.querySelector('.text-section');
    const counterSection = document.querySelector('.counter-section');

    if (textSection) {
        textSection.style.transform = `translate(${mouseX * 4}px, ${mouseY * 4}px)`;
    }
    if (counterSection) {
        counterSection.style.transform = `translate(${mouseX * 2}px, ${mouseY * 2}px)`;
    }
});