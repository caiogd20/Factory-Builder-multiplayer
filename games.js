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
            console.log(`Recursos atualizados: ${resources} (+${producaoNesteTick})`);
            io.emit('resourceUpdate', { total: resources, gain: producaoNesteTick });
        }
    }, 1000); // Roda uma vez por segundo ⏱️
    io.on('connection', (socket) => {
        console.log('Jogador conectado:', socket.id); //

        // Envia o mapa atual para o novo jogador
        for (const pos in worldMap) {
            socket.emit('update', { ...worldMap[pos], x: pos.split(',')[0], y: pos.split(',')[1] });
            console.log('Enviando construção existente para o novo jogador:', worldMap[pos]); //
        }

        socket.on('playerMove', (data) => {
    const posKey = `${data.x},${data.y}`;
    const PRECO_MINERADOR = 50; // Definimos um custo

    const mapaVazio = Object.keys(worldMap).length === 0;
    const custoAtual = mapaVazio ? 0 : PRECO_MINERADOR;

    // Precisamos de uma condição extra aqui:
    if (!worldMap[posKey] && resources >= custoAtual) {
        resources -= custoAtual; // Deduz o valor
        worldMap[posKey] = { type: data.type };
        
        // Avisamos sobre a construção e o novo saldo
        io.emit('update', data); 
        io.emit('resourceUpdate', { total: resources, gain: 0 });
    }else if (resources < PRECO_MINERADOR) {
        // Se não tiver dinheiro, avisamos apenas o jogador que tentou construir
        socket.emit('error_msg', 'Créditos insuficientes!');
    }
});

        socket.on('disconnect', () => {
            console.log('Jogador saiu.'); //
        });
    });
};