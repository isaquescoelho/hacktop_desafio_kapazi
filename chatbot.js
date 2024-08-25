// Adiciona o evento de pressionar 'Enter' no campo de input
document.getElementById('userMessage').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        sendMessage(); // Envia a mensagem quando o Enter é pressionado
    }
});

let currentStep = "greeting"; // Mantém o controle do passo atual da conversa
let clientInfo = {}; // Armazena as informações do cliente
const pisoPrecoPorMetro = 142; // Preço do piso por metro quadrado\


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

    // Respostas do chatbot com base no estado atual
    const botResponse = getBotResponse(userMessage);
    const botDiv = document.createElement('div');
    botDiv.classList.add('message', 'botMessage');
    botDiv.innerHTML = botResponse; // Use innerHTML para aceitar tags HTML
    chatbox.appendChild(botDiv);

    // Mantém o scroll sempre no final
    chatbox.scrollTop = chatbox.scrollHeight;
}

function getBotResponse(message) {
    message = message.toLowerCase(); // Faz o tratamento da mensagem em minúsculas para facilitar as comparações

    if (currentStep === "greeting") {
        currentStep = "userType"; // Muda o estado para a próxima pergunta
        return "Olá! Você é cliente, lojista ou instalador?";
    }

    if (currentStep === "userType") {
        if (message.includes("cliente")) {
            currentStep = "clientName";
            return "Perfeito! Informamos que seus dados estão protegidos pela LGPD. Por favor, qual é o seu nome?";
        } else if (message.includes("lojista")) {
            currentStep = "merchantQuestions";
            return "Ótimo! Como lojista, gostaria de saber mais sobre preços no atacado ou sobre como fazer um pedido em massa?";
        } else if (message.includes("instalador")) {
            currentStep = "installerQuestions";
            return "Excelente! Como instalador, você precisa de suporte técnico ou informações sobre produtos?";
        } else {
            return "Por favor, escolha uma das opções: cliente, lojista ou instalador.";
        }
    }

    // Fluxo de perguntas para o cliente
    if (currentStep === "clientName") {
        clientInfo.name = message;
        currentStep = "clientCep";
        return "Ótimo, " + clientInfo.name + "! Agora, por favor, informe seu CEP para facilitar no cálculo do frete.";
    }

    if (currentStep === "clientCep") {
        clientInfo.cep = message;
        currentStep = "clientProduct";
        return "Obrigado! O que você está procurando comprar? Pisos, tapetes, capachos ou outros produtos?";
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
        if (message.includes("não sei") || message.includes("nao sei")) {
            currentStep = "offerModels";
            return `Sem problemas! Para ajudar, temos vários modelos de pisos. Dê uma olhada: <a href="https://loja.kapazi.com.br/piso-vinilico-em-regua-ecokap-carvalho-caiado-kapazi/p" target="_blank">https://loja.kapazi.com.br/piso-vinilico-em-regua-ecokap-carvalho-caiado-kapazi/p</a>. Queremos garantir o piso perfeito para você!`;
        } else {
            const metragem = parseFloat(clientInfo.metragem);
            currentStep = "clientConditions"; // Novo passo para perguntas sobre o piso atual
            return `Perfeito! Agora, o seu piso atual está nivelado ou você já fez a preparação do contrapiso? Isso é importante para determinar se será necessário um ajuste adicional.`;
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
        return `Entendido! Você vai precisar de assistência para instalar o piso ou já tem um instalador? Podemos oferecer suporte adicional se necessário.`;
    }
    
    if (currentStep === "clientAssistance") {
        clientInfo.assistance = message;
    
        // Verifica se o cliente precisa de instalador
        if (message.toLowerCase().includes("não") || message.toLowerCase().includes("nao")) {
            // Sugerir plataforma de instalação
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
    
        chatbox.scrollTop = chatbox.scrollHeight; // Mantém o scroll sempre no final
        return ''; // Não há mais mensagens do usuário necessárias
    }
      
    return "Desculpe, não entendi. Pode repetir?";
}

function handleMerchantQuestions(message) {
    // Fluxo de perguntas para lojistas
    if (message.includes("atacado")) {
        return "Temos preços especiais para lojistas! Você pode se cadastrar no nosso portal de lojistas para mais informações.";
    } else if (message.includes("pedido em massa")) {
        return "Podemos ajudar com pedidos em massa! Quantas unidades você está pensando em pedir?";
    } else {
        return "Gostaria de saber mais sobre preços no atacado ou fazer um pedido em massa?";
    }
}

function handleInstallerQuestions(message) {
    // Fluxo de perguntas para instaladores
    if (message.includes("suporte técnico")) {
        return "Nosso suporte técnico está disponível para ajudar! Qual é o problema que você está enfrentando?";
    } else if (message.includes("informações sobre produtos")) {
        return "Nossos produtos são projetados para fácil instalação. Qual produto você gostaria de saber mais?";
    } else {
        return "Você precisa de suporte técnico ou mais informações sobre produtos?";
    }
}
