// public/javascripts/gamec.js
const socket = io(); //
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const resourceValue = document.getElementById('resourceValue');
const resourcesDisplay = document.getElementById('resourcesDisplay');

const gameState = {}; // Armazena as construções: { "x,y": { type: 'machine' } }


function render() {
    //
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const pos in gameState) {
        const [x, y] = pos.split(',').map(Number);
        
        // Desenha a máquina com uma borda interna para dar profundidade
        ctx.fillStyle = '#4ecca3'; // Verde água industrial
        ctx.fillRect(x, y, 1, 1);
        
        ctx.fillStyle = 'rgba(0,0,0,0.2)'; // Sombra interna
        ctx.fillRect(x + 0.7, y, 0.3, 1);
        ctx.fillRect(x, y + 0.7, 1, 0.3);
    }
}

// Clique para construir
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    // Converte o clique do mouse para a escala 0-50 do canvas
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);

    console.log(`Tentando construir em: ${x},${y}`);
    socket.emit('playerMove', { x, y, type: 'miner' }); // Reutiliza seu evento
});

// Recebe atualizações do servidor
socket.on('update', (data) => { //
    gameState[`${data.x},${data.y}`] = { type: data.type };
    render();
});


socket.on('resourceUpdate', (data) => {
    resourceValue.innerText = data.total;
});

socket.on('error_msg', (msg) => {
    resourcesDisplay.style.color = 'red';
    setTimeout(() => {
        resourcesDisplay.style.color = '#4cc9f0';
    }, 1000);
});