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
    "Cuanto mas tiempo lo lee mas se enoja >:v.",
    "- Moay relax , chill bro ... xd"
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

// Función del árbol que devuelve las coordenadas de las puntas
function drawTreeRecursive(startX, startY, len, angle, branchWidth, levelLimit, level) {
    ctx.save();
    ctx.strokeStyle = "#4A2F1D"; // Marrón más natural
    ctx.fillStyle = "#4A2F1D";
    ctx.lineWidth = branchWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI / 180);

    // 1. Dibujar el segmento de rama o tronco
    ctx.beginPath();
    ctx.moveTo(0, 0);

    if (level === 0) {
        // Tronco principal ligeramente curvo para más naturalidad
        ctx.quadraticCurveTo(10, -len / 2, 0, -len);
    } else {
        ctx.lineTo(0, -len);
    }
    ctx.stroke();

    // 2. Detalles estéticos solo para el tronco principal
    if (level === 0) {
        // Base ensanchada (raíces)
        ctx.beginPath();
        ctx.moveTo(-branchWidth * 1.2, 0);
        ctx.quadraticCurveTo(0, -40, branchWidth * 1.2, 0);
        ctx.fill();

        // Textura de corteza
        ctx.strokeStyle = "#331E10"; // Marrón más oscuro
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-15, -20); ctx.lineTo(-10, -110);
        ctx.moveTo(10, -40); ctx.lineTo(15, -140);
        ctx.moveTo(-2, -60); ctx.lineTo(3, -150);
        ctx.stroke();
    }

    level++;

    // Límite de nivel para pocas ramas y estructura determinística (bifurcar 3 veces -> 8 puntas)
    if (level >= levelLimit) {
        // Guardamos la transformación actual y obtenemos la posición final de la punta
        const endCoords = ctx.getTransform().transformPoint(new DOMPoint(0, -len));
        ctx.restore();
        return [endCoords]; // Retornamos la coordenada final
    }

    // Llamadas recursivas, cada una retorna una lista de coordenadas de sus hijos
    // Reducción de 0.7 y ángulo de 30 para una apertura limpia
    const tips1 = drawTreeRecursive(0, -len, len * 0.7, 30, branchWidth * 0.7, levelLimit, level);
    const tips2 = drawTreeRecursive(0, -len, len * 0.7, -30, branchWidth * 0.7, levelLimit, level);

    ctx.restore();
    // Combinamos todas las listas de coordenadas
    return tips1.concat(tips2);
}

// Función para dibujar un corazón de girasoles
function drawHeartShape(cx, cy, scale, totalFlowers) {
    let flowersDrawn = 0;

    function addHeartFlower() {
        if (flowersDrawn < totalFlowers) {
            let x = (Math.random() - 0.5) * 40;
            let y = (Math.random() - 0.5) * 40;

            // Ecuación matemática del corazón
            let eqX = x / 10;
            let eqY = y / 10;
            let formula = Math.pow(eqX * eqX + eqY * eqY - 1, 3) - (eqX * eqX * Math.pow(eqY, 3));

            if (formula <= 0) {
                let drawX = cx + (x * scale);
                let drawY = cy - (y * scale);

                // Flores de tamaño variable para el relleno
                let size = Math.random() * 0.3 + 0.3;
                drawFlower(drawX, drawY, size);
                flowersDrawn++;
            }

            requestAnimationFrame(addHeartFlower);
        }
    }

    // Usamos múltiples hilos para que el corazón se llene muy rápido
    for (let i = 0; i < 15; i++) {
        addHeartFlower();
    }
}

// Función principal para posicionar las flores formando un corazón
function spawnHearts(tips) {
    // Encontramos el centro horizontal usando las puntas exteriores
    const centerX = (tips[0].x + tips[tips.length - 1].x) / 2;
    // Posicionamos el corazón un poco más arriba de las puntas centrales para coronar el árbol
    const centerY = (tips[1].y + tips[2].y) / 2 - 40;

    // Dibujamos 1 solo corazón grande, bien definido y muy tupido
    drawHeartShape(centerX, centerY, 25, 1400); // scale: 25. flowers: 1400.
}

// Iniciar animaciones del lienzo
setTimeout(() => {
    // Limpiar canvas para que sea transparente y se vea el fondo CSS
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Dibujar árbol determinístico y obtener una lista de todas sus puntas (tips)
    // Tronco base largo (160), empezamos con un grosor de 40 para que se vea como un tronco real
    const tips = drawTreeRecursive(canvas.width / 2, canvas.height, 160, 0, 40, 3, 0);

    // 2. Un segundo después, iniciar los 3 corazones que cubran las ramas y el tronco
    setTimeout(() => {
        spawnHearts(tips);
        typeWriter(); // Escribimos el texto al mismo tiempo que aparecen las flores
    }, 1000);
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

        document.body.appendChild(firefly);
    }
}
createFireflies();