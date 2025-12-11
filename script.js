// --- CONFIGURAÇÕES ---
// Lista de senhas aceitas (tudo minúsculo para facilitar a verificação)
const ACCEPTED_PASSWORDS = ["jean", "jeanluca", "jean luca"];

const introContent = document.getElementById('intro-content');
const introContainer = document.getElementById('intro-container');
const music = document.getElementById('bg-music');

// Função auxiliar de tempo (delay)
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- 1. VERIFICAÇÃO DE SENHA ---
function verificarSenha() {
    const input = document.getElementById('password-input').value.toLowerCase().trim();
    const errorMessage = document.getElementById('error-message');

    // Verifica se o que foi digitado está na lista de senhas aceitas
    if (ACCEPTED_PASSWORDS.includes(input)) {
        errorMessage.classList.add('hidden');
        document.querySelector('.hello-container').classList.add('hidden');
        
        // Tenta iniciar a música imediatamente após o clique (hack para mobile)
        playMusic();
        
        // Inicia a contagem regressiva
        iniciarContagem();
    } else {
        errorMessage.classList.remove('hidden');
    }
}

function playMusic() {
    // Tenta dar play. Se o navegador bloquear, capturamos o erro (mas no clique geralmente funciona)
    music.volume = 0.5; // 50% do volume
    music.play().catch(e => console.log("Erro ao tocar música:", e));
}

// --- 2. CONTAGEM REGRESSIVA (5 SEGUNDOS) ---
async function iniciarContagem() {
    const countdownContainer = document.getElementById('countdown-container');
    const countdownNumber = document.getElementById('countdown-number');

    countdownContainer.classList.remove('hidden');

    for (let i = 5; i > 0; i--) {
        countdownNumber.textContent = i;
        await esperar(1000); // Espera 1 segundo
    }

    // Some com a contagem e inicia a intro
    countdownContainer.classList.add('hidden');
    iniciarIntro();
}

// --- 3. SEQUÊNCIA DE TEXTOS E VÍDEO ---
async function iniciarIntro() {
    introContainer.classList.remove('hidden');

    // --- PARTE 1: "Os 27 da Jú" ---
    introContent.innerHTML = "<h2>✨ Os 27 da Jú ✨</h2>";
    await esperar(100); 
    introContent.classList.add('visible'); 
    await esperar(3000); // Lê por 3s
    introContent.classList.remove('visible'); 
    await esperar(1000); 

    // --- PARTE 2: Texto da História ---
    introContent.innerHTML = "<p>Essa história começa em Maresias, litoral de São Paulo, na comemoração dos 26, em que Júlia agradece mais um ano de vida e pede muitas bençãos para o ano que vinha aí...</p>";
    introContent.classList.add('visible'); 
    await esperar(6000); // Lê por 6s
    introContent.classList.remove('visible'); 
    await esperar(1000);

    // --- PARTE 3: O Vídeo 1 (Maresias) ---
    // playsinline: essencial para mobile não abrir fullscreen
    introContent.innerHTML = `
        <video id="video1" playsinline autoplay>
            <source src="imagens/ia_ju1.mp4" type="video/mp4">
            Seu navegador não suporta vídeos.
        </video>
    `;
    introContent.classList.add('visible');
    
    // Esperamos o vídeo terminar para continuar
    const videoElement = document.getElementById('video1');
    
    // Promessa que resolve quando o vídeo termina
    await new Promise(resolve => {
        videoElement.onended = () => resolve();
        // Fallback de segurança: se o vídeo não carregar ou der erro, avança após 15s
        setTimeout(resolve, 15000); 
    });

    // Fade out do vídeo
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 4: Novo Texto (Aprendizados) ---
    introContent.innerHTML = "<p>Esse ano foi de muitos aprendizados, desafios e conquistas. Todos eles você enfrentou e se saiu muito bem meu amor! ❤️</p>";
    introContent.classList.add('visible');
    
    // O código para aqui por enquanto com esse texto na tela.
}