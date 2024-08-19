// Essas constantes capturam os elementos da interface de usuário (UI) relacionados ao login e chat. 
// login elements
const login = document.querySelector(".login");
const loginForm = login.querySelector(".login__form");
const loginInput = login.querySelector(".login__input");
const rememberMeCheckbox = document.getElementById("rememberMe");

// chat elements
const chat = document.querySelector(".chat");
const chatForm = chat.querySelector(".chat__form");
const chatInput = chat.querySelector(".chat__input");
const chatMessages = chat.querySelector(".chat__messages");
const userCountElement = document.getElementById('user-count');

// O user é um objeto que armazena o ID, nome e cor do usuário logado.
const user = { id: "", name: "", color: "" };

let websocket;

// Esta função atualiza a contagem de usuários online na interface.
const updateUserCount = (count) => {
    userCountElement.textContent = `👥 ${count}`;
    userCountElement.setAttribute('data-count', count); // Atualiza o texto do hover
};

// Essa função retorna o horário atual no formato hh:mm, usado para marcar as mensagens com a hora em que foram enviadas.
const getFormattedTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};

// O createMessageSelfElement serve para mensagens enviadas pelo próprio usuário.
const createMessageSelfElement = (content) => {
    const div = document.createElement("div");
    div.classList.add("message--self");

    const contentSpan = document.createElement("span");
    contentSpan.classList.add("message--content");
    contentSpan.innerHTML = content;

    const [truncatedContent, readMoreButton] = truncateMessage(content);
    contentSpan.innerHTML = truncatedContent;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("message--time");
    timeSpan.innerHTML = getFormattedTime();

    div.appendChild(contentSpan);
    div.appendChild(timeSpan);
    if (readMoreButton) {
        div.appendChild(readMoreButton)
    };

    return div;
};

// O createMessageOtherElement serve para mensagens de outros usuários, com o nome e cor.
const createMessageOtherElement = (content, sender, senderColor) => {
    const div = document.createElement("div");
    div.classList.add("message--other");

    const senderSpan = document.createElement("span");
    senderSpan.classList.add("message--sender");
    senderSpan.style.color = senderColor;
    senderSpan.innerHTML = sender;

    const contentSpan = document.createElement("span");
    contentSpan.classList.add("message--content");
    contentSpan.innerHTML = content;

    const [truncatedContent, readMoreButton] = truncateMessage(content);
    contentSpan.innerHTML = truncatedContent;

    const timeSpan = document.createElement("span");
    timeSpan.classList.add("message--time");
    timeSpan.innerHTML = getFormattedTime();

    div.appendChild(senderSpan);
    div.appendChild(contentSpan);
    div.appendChild(timeSpan);
    if (readMoreButton) {
        div.appendChild(readMoreButton)
    };

    return div;
};

// O createSystemMessageElement serve para mensagens geradas pelo sistema, como alertas.
const createSystemMessageElement = (content) => {
    const div = document.createElement("div");
    div.classList.add("message--system");
    div.innerHTML = content;
    return div;
};

// Essa função seleciona uma cor aleatória da lista de cores disponíveis e a retorna.
const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};

// Essa função faz a tela rolar automaticamente para o final da página.
const scrollScreen = () => {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
    });
};

// O processMessage processa as mensagens recebidas pelo WebSocket, diferenciando entre mensagens de sistema e mensagens de usuários.
const processMessage = ({ data }) => {
    const message = JSON.parse(data);

    if (message.systemMessage) {
        if (message.content.startsWith('👥')) {
            // Mensagem com contador de usuários
            const count = message.content.replace('👥 ', '');
            updateUserCount(count);
        } else {
            // Outras mensagens do sistema
            chatMessages.appendChild(createSystemMessageElement(message.content));
        }
    } else {
        const messageElement = message.userId === user.id
            ? createMessageSelfElement(message.content)
            : createMessageOtherElement(message.content, message.userName, message.userColor);

        chatMessages.appendChild(messageElement);
    }
    scrollScreen();
};

// O handleLogin é chamada quando o usuário envia o formulário de login, ou seja, quando usuário digita um Nome de Login e clica no botão de entrar.
const handleLogin = (event) => {
    event.preventDefault();

    user.id = crypto.randomUUID();
    user.name = loginInput.value;
    user.color = getRandomColor();

    if (rememberMeCheckbox.checked) {
        localStorage.setItem("username", user.name);
    } else {
        localStorage.removeItem("username");
    }

    login.style.display = "none";
    chat.style.display = "flex";

    websocket = new WebSocket("ws://localhost:8080");
    websocket.onmessage = processMessage;
    websocket.onopen = () => {
        const message = {
            userId: "", // Deixe em branco para indicar que é uma mensagem do sistema
            userName: "",
            userColor: "",
            content: `${user.name} entrou no Chat!`,
            systemMessage: true // Defina como true para identificar mensagem do sistema
        };
        websocket.send(JSON.stringify(message));
    };

    window.addEventListener("beforeunload", handleLogout);
};

// O handleLogout envia uma mensagem quando o usuário sai do chat.
const handleLogout = () => {
    const message = {
        userId: "", // Deixe em branco para indicar que é uma mensagem do sistema
        userName: "",
        userColor: "",
        content: `${user.name} saiu do Chat!`,
        systemMessage: true // Defina como true para identificar mensagem do sistema
    };
    websocket.send(JSON.stringify(message));
};

// O sendMessage envia a mensagem digitada pelo usuário para o WebSocket e a limpa do campo de entrada.
const sendMessage = (event) => {
    event.preventDefault();

    // Verifica se o campo de entrada não está vazio antes de enviar a mensagem
    const messageContent = chatInput.value.trim();
    if (messageContent === "") {
        return;
    }

    const message = {
        userId: user.id,
        userName: user.name,
        userColor: user.color,
        content: chatInput.value
    };

    websocket.send(JSON.stringify(message));
    chatInput.value = "";
};

// Esta função é usada para truncar mensagens longas e adicionar um botão "Leia Mais" para expandir o texto, caso a mensagem exceda um determinado limite de caracteres.
const truncateMessage = (content) => {
    const maxLength = 1000;
    if (content.length > maxLength) {
        const truncatedContent = content.slice(0, maxLength) + '... ';
        const readMoreButton = document.createElement('button');
        readMoreButton.innerText = 'Leia Mais';
        readMoreButton.classList.add('read-more-button');
        readMoreButton.onclick = (event) => {
            event.preventDefault();
            const messageElement = readMoreButton.closest('div'); // Encontra o balão de mensagem
            messageElement.querySelector('.message--content').innerHTML = content; // Atualiza o conteúdo
            messageElement.classList.add('message--expanded'); // Adiciona a classe para expandir
            readMoreButton.remove(); // Remove o botão "Leia Mais"
        };
        return [truncatedContent, readMoreButton];
    }
    return [content, null];
};

// Este bloco de código aguarda o carregamento completo do DOM (Document Object Model) antes de executar qualquer manipulação nos elementos da página.
document.addEventListener('DOMContentLoaded', () => {
    const loginSection = document.getElementById('login-section');
    const chatSection = document.getElementById('chat-section');
    const container = document.getElementById('container');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        loginSection.style.display = 'none';
        chatSection.style.display = 'flex';
        container.classList.remove('login-background');
        container.classList.add('chat-background');
    });
});

// Carregar o nome do usuário salvo, se existir.
document.addEventListener("DOMContentLoaded", () => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        loginInput.value = savedUsername;
        rememberMeCheckbox.checked = true;
    }
});


// Função para carregar o nome do usuário do Local Storage.
const loadUsername = () => {
    const rememberedUsername = localStorage.getItem("rememberedUsername");
    const rememberMe = localStorage.getItem("rememberMe") === "true";
    
    if (rememberedUsername && rememberMe) {
        loginInput.value = rememberedUsername;
        rememberMeCheckbox.checked = true;
    }
};

// Carregar o nome do usuário ao carregar a página.
document.addEventListener("DOMContentLoaded", () => {
    loadUsername();
});

// Salvar o nome do usuário ao submeter o formulário de login.
loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveUsername();
    handleLogin(event);
});


// Adiciona evento de tecla para enviar mensagem com Enter
chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage(event);
    }
});

// Adiciona ouvintes de eventos para o envio dos formulários de login e chat.
loginForm.addEventListener("submit", handleLogin);
chatForm.addEventListener("submit", sendMessage);
