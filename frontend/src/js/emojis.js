// A função document.addEventListener('DOMContentLoaded', () => { ... }) garante que o código JavaScript seja executado apenas após o carregamento completo do DOM, o que significa que todos os elementos da página estão disponíveis para manipulação.
document.addEventListener('DOMContentLoaded', () => {
    // São todos os Elementos coletados no Index.html.
    const emojiButton = document.querySelector('.emoji-button'); 
    const emojiPicker = document.querySelector('.emoji-picker');
    const emojiContent = document.getElementById('emoji-content');
    const chatInput = document.querySelector('.chat__input');
    const emojiTabs = document.querySelectorAll('.emoji-tab');
    const chatForm = document.querySelector(".chat__form");

    // Define o limite máximo de emojis que podem ser salvos na aba de recentes.
    const MAX_RECENT_EMOJIS = 1000;
    // Um array que armazena os emojis usados recentemente.
    let recentEmojis = [];
    // Controla qual categoria de emojis está atualmente selecionada e exibida.
    let currentCategory = 'recent';


    // Um objeto que armazena listas de emojis categorizados em diferentes tipos;
    const emojis = {
        recent: [''],
        smileys: ['😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '😊', '🙂', '🤗', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😯', '😪', '😫', '🥱', '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '🙁', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😨', '😩', '🤯', '😬', '😰', '😱', '🥵', '🥶', '😳', '🤪', '😵', '🥴', '😠', '😡', '🤬', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '😇', '🥳', '🥺', '🤠', '🤡', '🤥', '🤫', '🤭', '🧐', '🤓', '😈', '👿', '👹', '👺', '💀', '☠️', '👻', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐱‍👤', '🐱‍🏍', '🐱‍💻', '🐱‍🐉', '🐱‍👓', '🐱‍🚀', '🤳', '💪', '🦵', '🦶', '👂', '🦻', '👃', '🤏', '👈', '👉', '☝', '👆', '👇', '✌', '🤞', '🖖', '🤘', '🤙', '🖐', '✋', '👌', '👍', '👎', '✊', '👊', '🤛', '🤜', '🤚', '👋', '🤟', '✍', '👏', '👐', '🙌', '🤲', '🙏', '🤝', '💅', '🗣️', '👤', '👥', '👁️', '👀', '🦴', '🦷', '👅', '👄', '🧠', '🦾', '🦿', '👣', '💑', '👩‍❤️‍👩', '👨‍❤️‍👨', '💏', '👩‍❤️‍💋‍👩', '👨‍❤️‍💋‍👨', '👩', '👨', '🧑', '👧', '👦', '🧒', '👶', '👵', '👴', '🧓', '👩‍🦰', '👨‍🦰', '👩‍🦱', '👨‍🦱', '👩‍🦲', '👨‍🦲', '👩‍🦳', '👨‍🦳', '👱‍♀️', '👱‍♂️', '👸', '🤴', '👳‍♀️', '👳‍♂️', '👲', '🧔', '👼', '🤶', '🎅', '👮‍♀️', '👮‍♂️', '🕵️‍♀️', '🕵️‍♂️', '💂‍♀️', '💂‍♂️', '👷‍♀️', '👷‍♂️', '👩‍⚕️', '👨‍⚕️', '👩‍🎓', '👨‍🎓', '👩‍🏫', '👨‍🏫', '👩‍⚖️', '👨‍⚖️', '👩‍🌾', '👨‍🌾', '👩‍🍳', '👨‍🍳', '👩‍🔧', '👨‍🔧', '👩‍🏭', '👨‍🏭', '👩‍💼', '👨‍💼', '👩‍🔬', '👨‍🔬', '👩‍💻', '👨‍💻', '👩‍🎤', '👨‍🎤', '👩‍🎨', '👨‍🎨', '👩‍✈️', '👨‍✈️', '👩‍🚀', '👨‍🚀', '👩‍🚒', '👨‍🚒', '🧕', '👰', '🤵', '🤱', '🤰', '🦸‍♀️', '🦸‍♂️', '🦹‍♀️', '🦹‍♂️', '🧙‍♀️', '🧙‍♂️', '🧚‍♀️', '🧚‍♂️', '🧛‍♀️', '🧛‍♂️', '🧜‍♀️', '🧜‍♂️', '🧝‍♀️', '🧝‍♂️', '🧟‍♀️', '🧟‍♂️', '🙍‍♀️', '🙍‍♂️', '🙎‍♀️', '🙎‍♂️', '🙅‍♀️', '🙅‍♂️', '🙆‍♀️', '🙆‍♂️', '🧏‍♀️', '🧏‍♂️', '💁‍♀️', '💁‍♂️', '🙋‍♀️', '🙋‍♂️', '🙇‍♀️', '🙇‍♂️', '🤦‍♀️', '🤦‍♂️', '🤷‍♀️', '🤷‍♂️', '💆‍♀️', '💆‍♂️', '💇‍♀️', '💇‍♂️', '🧖‍♀️', '🧖‍♂️', '👩‍🦽', '👨‍🦽', '👩‍🦼', '👨‍🦼', '👩‍🦯', '👨‍🦯', '🧎‍♀️', '🧎‍♂️', '🧍‍♀️', '🧍‍♂️', '🚶‍♀️', '🚶‍♂️', '🏃‍♀️', '🏃‍♂️', '💃', '🕺', '🛀', '🛌', '🕴', '🧵', '🧶', '🛒', '👓', '🕶️', '🦺', '🥽', '🥼', '🧥', '👔', '👕', '👖', '🩳', '🧣', '🧤', '🧦', '👗', '🥻', '👘', '👚', '🩲', '🩱', '👙', '👛', '👜', '👝', '🛍️', '🎒', '👞', '👟', '🥾', '🩰', '👑', '🥿', '👠', '👡', '👢', '🩰', '👑', '🧢', '⛑️', '👒', '🎩', '🎓'],
        animais: ['🙈', '🙉', '🙊', '🐵', '🐶', '🐺', '🐱', '🦁', '🐯', '🦒', '🦊', '🦝', '🐮', '🐷', '🐗', '🐭', '🐹', '🐰', '🐻', '🐨', '🐼', '🐸', '🦓', '🐴', '🦄', '🐔', '🐲', '🐽', '🐾', '🐒', '🦍', '🦧', '🦮', '🐕‍🦺', '🐩', '🐕', '🐈', '🐅', '🐆', '🐎', '🦌', '🦏', '🦛', '🐂', '🐃', '🐄', '🐖', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦘', '🦥', '🦨', '🦡', '🐘', '🐁', '🐀', '🦔', '🐇', '🐿️', '🦎', '🐊', '🐢', '🐍', '🐉', '🦕', '🦖', '🦦', '🦈', '🐬', '🐳', '🐋', '🐟', '🐠', '🐡', '🦐', '🦑', '🐙', '🦞', '🦀', '🐚', '🦆', '🐓', '🦃', '🦅', '🕊️', '🦢', '🦜', '🦩', '🦚', '🦉', '🐦', '🐧', '🐥', '🐤', '🐣', '🦇', '🦋', '🐌', '🐛', '🦟', '🦗', '🐜', '🐝', '🐞', '🦂', '🕷️', '🕸️', '🦠'],
        comidas: ['🍕', '🍔', '🍟', '🌭', '🍿', '🧂', '🥓', '🥚', '🍳', '🧇', '🥞', '🧈', '🍞', '🥐', '🥨', '🥯', '🥖', '🧀', '🥗', '🥙', '🥪', '🌮', '🌯', '🥫', '🍖', '🍗', '🥩', '🍠', '🥟', '🥠', '🥡', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🦪', '🍣', '🍤', '🍥', '🥮', '🍢', '🧆', '🥘', '🍲', '🍝', '🥣', '🥧', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🍫', '🍬', '🍭', '🍡', '🍮', '🍯', '🍼', '🥛', '🧃', '☕', '🍵', '🧉', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🧊', '🥤', '🥢', '🍽️', '🍴', '🥄', '🏺', '🥝', '🥥', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🍅', '🍆', '🌽', '🌶️', '🍄', '🥑', '🥒', '🥬', '🥦', '🥔', '🧄', '🧅', '🥕', '🌰', '🥜'],
        atividades: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛷', '⛸️', '🥌', '🎿', '🏂', '🪂', '🏋️‍♀️', '🏋️‍♂️', '🤺', '⛷️', '🤼‍♂️', '🤼‍♀️', '🤹‍♀️', '🤹‍♂️', '🧗‍♀️', '🧗‍♂️', '🏇', '🏂', '🏌️‍♀️', '🏌️‍♂️', '🏄‍♀️', '🏄‍♂️', '🚣‍♀️', '🚣‍♂️', '🏊‍♀️', '🏊‍♂️', '🤽‍♀️', '🤽‍♂️', '🤾‍♀️', '🤾‍♂️', '⛹️‍♀️', '⛹️‍♂️', '🏋️‍♀️', '🏋️‍♂️', '🚴‍♀️', '🚴‍♂️', '🚵‍♀️', '🚵‍♂️', '🤸‍♀️', '🤸‍♂️', '🤼‍♀️', '🤼‍♂️', '🤸‍♀️', '🤸', '🤸‍♂️', '⛹️‍♀️', '⛹️', '⛹️‍♂️', '🤺', '🤾‍♀️', '🤾', '🤾‍♂️', '🏌️‍♀️', '🏌️', '🏌️‍♂️', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎪', '🎟️', '🎭', '🩰', '🎨', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳'],
        viagens: ['🚗', '🚓', '🚕', '🛺', '🚙', '🚌', '🚐', '🚎', '🚑', '🚒', '🚚', '🚛', '🚜', '🚘', '🚔', '🚖', '🚍', '🦽', '🦼', '🛹', '🚲', '🛴', '🛵', '🏍️', '🏎️', '🚄', '🚅', '🚈', '🚝', '🚞', '🚃', '🚋', '🚆', '🚉', '🚊', '🚇', '🚟', '🚠', '🚡', '🚂', '🛩️', '🪂', '✈️', '🛫', '🛬', '💺', '🚁', '🚀', '🛸', '🛰️', '⛵', '🚤', '🛥️', '⛴️', '🛳️', '🚢', '⚓', '🚏', '⛽', '🚨', '🚥', '🚦', '🚧', '🏁', '🏳‍🌈', '🏳️', '🏴', '🏴‍☠️', '🚩', '🌌', '🪐', '🌍', '🌎', '🌏', '🗺️', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🛤️', '🏕️', '🏞️', '🛣️', '🏖️', '🏜️', '🏝️', '🏟️', '🏛️', '🏗️', '🏘️', '🏙️', '🏚️', '🏠', '🏡', '⛪', '🕋', '🕌', '🛕', '🕍', '⛩️', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🌉', '🗽', '🗾', '🎌', '⛲', '⛺', '🌁', '🌃', '🌄', '🌅', '🌆', '🌇'],
        objetos: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🪒', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🚪', '🪑', '🛋️', '🛏️', '🛌', '🧸', '🖼️', '🛍️', '🛒', '🎁', '🎈', '🎏', '🎀', '🎊', '🎉', '🎎', '🎐', '🧧', '✉️', '📩', '📨', '📧', '💌', '📥', '📤', '📦', '🏷️', '📪', '📫', '📬', '📭', '📮', '📯', '📜', '📃', '📄', '📑', '🧾', '📊', '📈', '📉', '🗒️', '🗓️', '📆', '📅', '🗑️', '📇', '🗃️', '🗳️', '🗄️', '📋', '📁', '📂', '🗂️', '🗞️', '📰', '📓', '📔', '📒', '📕', '📗', '📘', '📙', '📚', '📖', '🔖', '🧷', '🔗', '📎', '🖇️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🖊️', '🖋️', '✒️', '🖌️', '🖍️', '📝', '✏️', '🔍', '🔎', '🔏', '🔐', '🔒', '🔓'],
        simbolos: ['㊗️', '🈴', '🈵', '🈹', '🈲', '🅰', '🅱', '🆎', '🆑', '🅾', '🆘', '❌', '⭕', '🛑', '⛔', '📛', '🚫', '💯', '💢', '♨️', '🚷', '🚯', '🚳', '🚱', '🔞', '📵', '🚭', '❗', '❕', '❓', '❔', '‼', '⁉️', '🔅', '🔆', '〽️', '⚠️', '🚸', '🔱', '⚜️', '🔰', '♻️', '✅', '🈯', '💹', '❇️', '✳️', '❎', '🌐', '💠', 'Ⓜ️', '🌀', '💤', '🏧', '🚾', '♿', '🅿', '🈳', '🈂️', '🛂', '🛃', '🛄', '🛅', '🚹', '🚺', '🚼', '⚧', '🚻', '🚮', '🎦', '📶', '🈁', '🔣', 'ℹ️', '🔤', '🔡', '🔠', '🆖', '🆗', '🆙', '🆒', '🆕', '🆓', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔢', '#️⃣', '*️⃣', '⏏️', '▶️', '⏸', '⏯', '⏹', '⏺', '⏭', '⏮', '⏩', '⏪', '⏫', '⏬', '◀️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗', '↘️', '↙', '↖️', '↕', '↔', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔁', '🔂', '🔄', '🔃', '🎵', '🎶', '➕', '➖', '➗', '✖️', '♾', '💲', '💱', '™', '©', '®', '👁‍🗨', '🔚', '🔙', '🔛', '🔝', '🔜', '〰️', '➰', '➿', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '🔳', '🔲', '▪️', '▫️', '◾️', '◽️', '◼️', '◻️', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '⬛', '⬜', '🟫', '🔈', '🔇', '🔉', '🔊', '🔔', '🔕', '📣', '📢', '💬', '💭', '🗯', '♠', '♣', '♥', '♦️', '🃏', '🎴', '🀄', '🕐', '🕑', '🕒', '🕓', '🕔', '🕕', '🕖', '🕗', '🕘', '🕙', '🕚', '🕛', '🕜', '🕝', '🕞', '🕟', '🕠', '🕡', '🕣', '🕤', '🕥', '🕦'],
        bandeiras: ['🏳‍🌈', '🏳️', '🏴', '🏴‍☠️', '🚩', '🏁'],
    };

    // O loadRecentEmojis serve pra recuperar a lista de emojis recentes do armazenamento local do navegador.  
    const loadRecentEmojis = () => {
        const recentEmojis = JSON.parse(localStorage.getItem('recentEmojis')) || [];
        emojis.recent = recentEmojis;
    };


    // Uma função que carrega os emojis recentemente usados do localStorage e os coloca na categoria recentes e  atualiza a interface com os emojis de uma categoria específica e permite que o usuário clique para adicionar um emoji ao campo de entrada de chat.
    function updateEmojiContent(category) {
        emojiContent.innerHTML = '';
        emojis[category].forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = emoji;
            emojiSpan.classList.add('emoji');
            emojiSpan.addEventListener('click', (event) => {
                event.stopPropagation();
                addToRecentEmojis(emoji);
                chatInput.value += emoji;
            });
            emojiContent.appendChild(emojiSpan);
        });
    }


    // A função addToRecentEmojis gerencia a lista de emojis recentes ao Remover qualquer emoji duplicado, ao Adicionar o emoji mais recente no início da lista, a Limitar o tamanho da lista de recentes para um valor máximo e Atualizar a visualização se a categoria atual for recent.
    function addToRecentEmojis(emoji) {
        // Remove o emoji se ele já estiver nos recentes
        recentEmojis = recentEmojis.filter(e => e !== emoji);
        // Adiciona o emoji no início do array
        recentEmojis.unshift(emoji);
        // Limita o número de emojis recentes
        if (recentEmojis.length > MAX_RECENT_EMOJIS) {
            recentEmojis.pop();
        }
        emojis.recent = [...recentEmojis]; // Atualiza a categoria recente
        if (currentCategory === 'recent') {
            updateEmojiContent('recent'); // Atualiza a visualização de emojis recentes
        }
    }

    // Inicializa o picker com a primeira categoria
    loadRecentEmojis();

    // Alterna a visibilidade do emoji picker
    emojiButton.addEventListener('click', () => {
        event.stopPropagation();
        emojiPicker.style.display = emojiPicker.style.display === 'none' ? 'block' : 'none';
    });

    // Atualiza a categoria ao clicar nas abas
    emojiTabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault(); // Impede o envio do formulário ao clicar nas abas
            emojiTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentCategory = tab.dataset.category; // Atualiza a categoria atual
            updateEmojiContent(currentCategory);
        });
    });


    // Oculta o emoji picker quando clicar fora dele
    document.addEventListener('click', (event) => {
        if (!emojiPicker.contains(event.target) && !emojiButton.contains(event.target)) {
            emojiPicker.style.display = 'none';
        }
    });

    // Previne o envio do formulário ao pressionar Enter no campo de input
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            // Lógica para adicionar a mensagem ao chat
            console.log('Mensagem enviada:', message);
            chatInput.value = ''; // Limpa o campo de input
        }
    });
});