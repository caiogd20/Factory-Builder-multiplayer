// games.js
const worldMap = {}; // Memória do servidor
let resources = 0; // Recursos globais

module.exports = function (io) {
    // --- Loop de Produção (O Coração da Fábrica) ---
    setInterval(() => {
        let producaoNesteTick = 0;

        for (const pos in worldMap) {
            if (worldMap[pos].type === 'miner') {
                producaoNesteTick += 1; // Cada minerador gera 1 recurso por tick
            }
        }

        if (producaoNesteTick > 0) {
            resources += producaoNesteTick;
            // Avisa todos os jogadores o novo total de recursos
            io.emit('resourceUpdate', { total: resources, gain: producaoNesteTick });
        }
    }, 1000); // Roda uma vez por segundo ⏱️
    io.on('connection', (socket) => {
        console.log('Jogador conectado:', socket.id); //

        // Envia o mapa atual para o novo jogador
        for (const pos in worldMap) {
            socket.emit('update', { ...worldMap[pos], x: pos.split(',')[0], y: pos.split(',')[1] });
        }

        socket.on('playerMove', (data) => { //
            const posKey = `${data.x},${data.y}`;
            
            // Validação simples: só constrói se estiver vazio
            if (!worldMap[posKey]) {
                worldMap[posKey] = { type: data.type };
                // Avisa todos os jogadores sobre a nova construção
                io.emit('update', data); //
            }
        });

        socket.on('disconnect', () => {
            console.log('Jogador saiu.'); //
        });
    });
};