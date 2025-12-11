// Configurações
const CORRECT_PASSWORD = "jean luca"; 
const introContent = document.getElementById('intro-content');
const introContainer = document.getElementById('intro-container');

// --- FUNÇÃO DE VERIFICAÇÃO DE SENHA ---
function verificarSenha() {
    const input = document.getElementById('password-input').value;
    const errorMessage = document.getElementById('error-message');

    // Converte o que foi digitado para minúsculo e compara
    if (input.toLowerCase() === CORRECT_PASSWORD) {
        errorMessage.classList.add('hidden');
        document.querySelector('.hello-container').classList.add('hidden');
        iniciarIntro(); // Começa a sequência especial
    } else {
        errorMessage.classList.remove('hidden');
    }
}

// --- SEQUÊNCIA DE INTRODUÇÃO (Textos -> Vídeo) ---
// Função auxiliar para esperar um tempo (em milissegundos)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function iniciarIntro() {
    // 1. Mostra o container da intro
    introContainer.classList.remove('hidden');

    // --- PARTE 1: "Os 27 da Jú" ---
    introContent.innerHTML = "<h2>✨ Os 27 da Jú ✨</h2>";
    // Pequeno delay para o navegador renderizar antes do fade-in
    await esperar(100); 
    introContent.classList.add('visible'); // Fade IN
    
    await esperar(3000); // Fica na tela por 3 segundos
    
    introContent.classList.remove('visible'); // Fade OUT
    await esperar(1000); // Espera o fade out terminar

    // --- PARTE 2: Texto Longo ---
    introContent.innerHTML = "<p>Essa história começa em Maresias, litoral de São Paulo, na comemoração dos 26, em que Júlia agradece mais um ano de vida e pede muitas bençãos para o ano que vinha aí...</p>";
    introContent.classList.add('visible'); // Fade IN
    
    await esperar(6000); // Fica na tela por 6 segundos (tempo para ler)
    
    introContent.classList.remove('visible'); // Fade OUT
    await esperar(1000);

    // --- PARTE 3: O Vídeo ---
    // Inserimos a tag de vídeo HTML
    introContent.innerHTML = `
        <video controls autoplay>
            <source src="imagens/ia_ju1.mp4" type="video/mp4">
            Seu navegador não suporta vídeos.
        </video>
    `;
    introContent.classList.add('visible'); // Fade IN do vídeo
    
    // O vídeo deve começar automaticamente devido ao atributo 'autoplay'.
    // A partir daqui, o código para (aguardando suas próximas instruções sobre o que fazer depois do vídeo).
}

// (O código antigo dos slides foi removido temporariamente para focar nessa intro, 
// mas podemos trazê-lo de volta depois que o vídeo terminar, se você quiser!)