document.getElementById('userMessage').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage(); // Envia a mensagem quando o Enter é pressionado
    }
});

let currentStep = "greeting"; // Mantém o controle do passo atual da conversa
let clientInfo = {}; // Armazena as informações do cliente
const pisoPrecoPorMetro = 142; // Preço do piso por metro quadrado

// Função para iniciar a conversa
function startConversation() {
    const botDiv = document.createElement('div');
    botDiv.classList.add('message', 'botMessage');
    botDiv.innerHTML = "Olá! Seja bem-vindo ao nosso assistente virtual KAI Bot. Qual é o seu nome?";
    chatbox.appendChild(botDiv);
    currentStep = "clientName"; // Define o próximo passo para coletar o nome
    chatbox.scrollTop = chatbox.scrollHeight;
}

function showTypingAnimation() {
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('message', 'botMessage');
    typingDiv.setAttribute('id', 'typing');
    typingDiv.textContent = "KAI Bot está digitando...";
    chatbox.appendChild(typingDiv);
    chatbox.scrollTop = chatbox.scrollHeight;
}

function removeTypingAnimation() {
    const typingDiv = document.getElementById('typing');
    if (typingDiv) {
        typingDiv.remove();
    }
}

function sendMessage() {
    const userMessage = document.getElementById('userMessage').value;

    if (userMessage.trim() === "") {
        return;
    }

    // Mostra a mensagem do usuário no chatbox
    const userDiv = document.createElement('div');
    userDiv.classList.add('message', 'userMessage');
    userDiv.textContent = userMessage;
    chatbox.appendChild(userDiv);

    // Limpa o campo de input
    document.getElementById('userMessage').value = "";

    // Exibe a animação de digitação do bot
    showTypingAnimation();

    // Atrasar a resposta do bot por 1 segundo
    setTimeout(() => {
        // Remove a animação de digitação antes de mostrar a resposta
        removeTypingAnimation();

        // Respostas do chatbot com base no estado atual
        const botResponse = getBotResponse(userMessage);
        const botDiv = document.createElement('div');
        botDiv.classList.add('message', 'botMessage');
        botDiv.innerHTML = botResponse; // Use innerHTML para aceitar tags HTML
        chatbox.appendChild(botDiv);

        // Mantém o scroll sempre no final
        chatbox.scrollTop = chatbox.scrollHeight;
    }, 1000); // 1 segundo de atraso para simular que o bot está digitando
}

function getBotResponse(message) {
    message = message.toLowerCase(); // Faz o tratamento da mensagem em minúsculas para facilitar as comparações

    if (currentStep === "clientName") {
        clientInfo.name = message;
        currentStep = "clientCep";
        return `Ótimo, ${clientInfo.name}! Seus dados estão protegidos pela LGPD. Agora, por favor, informe seu CEP para facilitar no cálculo do frete.`;
    }

    if (currentStep === "clientCep") {
        const cepPattern = /^[0-9]{5}-?[0-9]{3}$/; // Expressão regular para validar o formato de CEP (com ou sem hífen)
    
        if (cepPattern.test(message)) {
            clientInfo.cep = message;
            currentStep = "clientProduct";
            return "Obrigado! O que você está procurando comprar? Pisos, tapetes, capachos ou outros produtos?";
        } else {
            // Se o CEP não for válido, pede ao cliente para inserir um CEP válido
            return "O CEP que você digitou é inválido. Por favor, insira um CEP no formato 00000-000 ou 00000000.";
        }
    }

    if (currentStep === "clientProduct") {
        clientInfo.product = message;
        currentStep = "clientRoom";
        return "Entendido! Qual cômodo você quer reformar?";
    }

    if (currentStep === "clientRoom") {
        clientInfo.room = message;
        currentStep = "clientMetragem";
        return "E qual a metragem do espaço (em metros quadrados)? Se não souber, tudo bem, apenas nos avise.";
    }

    if (currentStep === "clientMetragem") {
        clientInfo.metragem = message;

        // Verifica se a mensagem contém "não sei" ou é um número válido
        if (message.toLowerCase().includes("não sei") || message.toLowerCase().includes("nao sei")) {
            currentStep = "askMoreHelp";
            return `Sem problemas! Enquanto você verifica a metragem, dê uma olhada na nossa seção de pisos e acompanhe as promoções: <a href="https://loja.kapazi.com.br/pisos---gramas/pisos?initialMap=c&initialQuery=pisos---gramas&map=category-1,category-2" target="_blank">Seção de Pisos</a>. Há algo mais que possamos ajudar você? (Digite 'sim' ou 'não')`;
        } else if (!isNaN(message) && parseFloat(message) > 0) {
            const metragem = parseFloat(clientInfo.metragem);
            currentStep = "clientConditions"; // Novo passo para perguntas sobre o piso atual
            return `Perfeito! Agora, o seu piso atual está nivelado ou você já fez a preparação do contrapiso? Isso é importante para determinar se será necessário um ajuste adicional.`;
        } else {
            // Se a entrada não for um número válido ou "não sei", pede para inserir um valor válido
            return "Por favor, insira uma metragem válida em metros quadrados ou digite 'não sei' caso você não saiba.";
        }
    }

    if (currentStep === "clientConditions") {
        clientInfo.conditions = message;
        currentStep = "clientBudget";
        return `Ótimo! Você tem um orçamento aproximado para o projeto? Isso nos ajudará a selecionar as melhores opções dentro do seu limite.`;
    }

    if (currentStep === "clientBudget") {
        clientInfo.budget = message;
        currentStep = "clientAssistance";
        return `Entendido! Você vai precisar de assistência para instalar o piso? Podemos oferecer suporte adicional se necessário.`;
    }

    if (currentStep === "clientAssistance") {
        clientInfo.assistance = message;

        // Verifica se o cliente precisa de instalador
        if (message.toLowerCase().includes("não") || message.toLowerCase().includes("nao")) {
            const suggestionMessage = `Sem problemas! Recomendamos que você procure por um instalador em plataformas como o GetNinjas. Lembrando que a Kapazi não possui vínculo com os profissionais dessas plataformas e essa é apenas uma sugestão para facilitar a sua busca.`;
            
            const botDivSuggestion = document.createElement('div');
            botDivSuggestion.classList.add('message', 'botMessage');
            botDivSuggestion.innerHTML = suggestionMessage;
            chatbox.appendChild(botDivSuggestion);
        }

        currentStep = "offerBudget"; // Continua para a parte do orçamento

        // Mensagem final com orçamento fictício e informações sobre assistência
        const metragem = parseFloat(clientInfo.metragem);
        const total = metragem * pisoPrecoPorMetro;

        // Primeira mensagem com o orçamento
        const botDivBudget = document.createElement('div');
        botDivBudget.classList.add('message', 'botMessage');
        botDivBudget.innerHTML = `Perfeito! Com base na metragem informada (${clientInfo.metragem}m²), o valor do piso vinílico escolhido seria aproximadamente R$ ${total.toFixed(2)}. Você pode continuar sua compra através do nosso site: <a href="https://loja.kapazi.com.br/" target="_blank">https://loja.kapazi.com.br/</a>.`;
        chatbox.appendChild(botDivBudget);

        // Segunda mensagem explicativa sobre o orçamento
        setTimeout(() => {
            const botDivFollowUp = document.createElement('div');
            botDivFollowUp.classList.add('message', 'botMessage');
            botDivFollowUp.innerHTML = `Esse é um orçamento aproximado. Verifique se o nível do seu piso está correto e se precisa de um contrapiso. Se precisar de ajuda, entre em contato conosco via <a href="https://web.whatsapp.com/send?phone=+554121060955&text=Ol%C3%A1%2C+gostaria+de+maiores+informa%C3%A7%C3%B5es+sobre+os+produtos+da+Kapazi" target="_blank">Whatsapp Kapazi</a>.`;
            chatbox.appendChild(botDivFollowUp);
            chatbox.scrollTop = chatbox.scrollHeight; // Mantém o scroll sempre no final
        }, 2000);

        currentStep = "askMoreHelp"; // Ajusta para perguntar se precisa de mais ajuda após orçamento
        chatbox.scrollTop = chatbox.scrollHeight; // Mantém o scroll sempre no final
        return ''; // Não há mais mensagens do usuário necessárias até aqui
    }

    // Pergunta se o cliente precisa de mais ajuda após "não sei" na metragem ou ao encerrar o atendimento
    if (currentStep === "askMoreHelp") {
        if (message.toLowerCase().includes("não") || message.toLowerCase().includes("nao")) {
            currentStep = "greeting"; // Redefine o passo para saudação inicial
            return `Obrigado por usar nosso assistente virtual! Volte sempre que precisar.`;
        } else if (message.toLowerCase().includes("sim")) {
            currentStep = "clientCep"; // Reinicia a partir do CEP
            return `Ótimo! Vamos reiniciar o atendimento. Por favor, informe seu CEP para facilitar no cálculo do frete.`;
        } else {
            return "Por favor, responda com 'sim' ou 'não'. Há algo mais que possamos ajudar?";
        }
    }

    return "Desculpe, não entendi. Pode repetir?";
}

// Inicia a conversa
startConversation();
