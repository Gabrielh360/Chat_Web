const { WebSocketServer, WebSocket } = require("ws")
const dotenv = require("dotenv")

// Importa o módulo dotenv para carregar variáveis de ambiente a partir de um arquivo .env.
dotenv.config()

// Cria uma instância do servidor WebSocket que escuta na porta especificada na variável de ambiente PORT, ou na porta 8080 se a variável não estiver definida.
const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

// Mantém o contador de usuários online.
let usersOnline = 0; 

// Define um callback para o evento connection. Sempre que um novo cliente se conecta, o código dentro desta função é executado.
wss.on("connection", (ws) => {
    usersOnline++; // Incrementa o contador de usuários online.
    broadcastUserCount(); // Chama a função para enviar a contagem de usuários para todos os clientes conectados.

    // Adiciona um handler para o evento error do WebSocket, que loga erros no console.
    ws.on("error", console.error)

    // Adiciona um handler para o evento message. Quando uma mensagem é recebida de um cliente, ela é enviada para todos os outros clientes conectados.
    ws.on("message", (data) => {
        //  Itera sobre todos os clientes conectados e envia a mensagem recebida para cada um.
        wss.clients.forEach((client) => client.send(data.toString()))
    })

    // Adiciona um handler para o evento close, quando um cliente se desconecta
    ws.on("close", () => {
        usersOnline--; // Decrementa o contador de usuários online.
        broadcastUserCount(); // Atualiza a contagem para todos os clientes.
    });

    // Loga uma mensagem no console sempre que um novo cliente se conecta.
    console.log("client connected")
})

// Define uma função para criar e enviar uma mensagem com a contagem atual de usuários online.
const broadcastUserCount = () => {
    // Cria um objeto de mensagem com a contagem de usuários e o converte para uma string JSON. 
    const userCountMessage = JSON.stringify({
        userId: "",
        userName: "",
        userColor: "",
        content: `👥 ${usersOnline}`,
        systemMessage: true
    });

    // tera sobre todos os clientes conectados e envia a mensagem de contagem para cada cliente que está com o estado de conexão OPEN.
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(userCountMessage);
        }
    });
};

