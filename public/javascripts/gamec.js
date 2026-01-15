// public/javascripts/gamec.js
const socket = io(); //
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameState = {}; // Armazena as construções: { "x,y": { type: 'machine' } }

// Desenha o estado atual do jogo
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (const pos in gameState) {
        const [x, y] = pos.split(',').map(Number);
        ctx.fillStyle = 'green'; // Cor da máquina
        ctx.fillRect(x, y, 1, 1); // Desenha 1x1 na grade de 50x50
    }
}

// Clique para construir
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    // Converte o clique do mouse para a escala 0-50 do canvas
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * canvas.width);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * canvas.height);

    console.log(`Tentando construir em: ${x},${y}`);
    socket.emit('playerMove', { x, y, type: 'machine' }); // Reutiliza seu evento
});

// Recebe atualizações do servidor
socket.on('update', (data) => { //
    gameState[`${data.x},${data.y}`] = { type: data.type };
    render();
});