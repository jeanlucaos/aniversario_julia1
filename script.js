// --- CONFIGURAÇÕES GERAIS ---
const ACCEPTED_PASSWORDS = ["jean", "jeanluca", "jean luca"];

const introContent = document.getElementById('intro-content');
const introContainer = document.getElementById('intro-container');
const music = document.getElementById('bg-music');

// Função auxiliar 'Promessa' para pausar o código por X milissegundos
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- 1. VERIFICAÇÃO DE SENHA ---
function verificarSenha() {
    const input = document.getElementById('password-input').value.toLowerCase().trim();
    const errorMessage = document.getElementById('error-message');

    if (ACCEPTED_PASSWORDS.includes(input)) {
        errorMessage.classList.add('hidden');
        document.querySelector('.hello-container').classList.add('hidden');
        
        // TRUQUE DE ÁUDIO PARA MOBILE:
        // Navegadores bloqueiam áudio automático. Começamos ele mudo no clique
        // e depois aumentamos o volume.
        music.volume = 0; 
        music.play().catch(e => console.log("Aguardando interação para áudio..."));

        iniciarContagem();
    } else {
        errorMessage.classList.remove('hidden');
    }
}

// --- 2. CONTAGEM REGRESSIVA (3 a 1) ---
async function iniciarContagem() {
    const countdownContainer = document.getElementById('countdown-container');
    const countdownNumber = document.getElementById('countdown-number');

    countdownContainer.classList.remove('hidden');

    for (let i = 3; i > 0; i--) {
        countdownNumber.textContent = i;
        await esperar(1000); // 1 segundo
    }

    // Fim da contagem: Solta o som!
    music.currentTime = 0; // Reinicia música
    music.volume = 0.5;    // Define volume audível
    
    countdownContainer.classList.add('hidden');
    iniciarIntro();
}

// --- 3. SEQUÊNCIA DE HISTÓRIA (Textos, Vídeo e Imagens) ---
async function iniciarIntro() {
    introContainer.classList.remove('hidden');

    // --- PARTE 1: Títulos ---
    introContent.innerHTML = "<h2>✨ Os 27 da Jú ✨</h2>";
    // Pequeno delay para o navegador processar antes do fade-in
    await esperar(100); 
    introContent.classList.add('visible'); 
    await esperar(3000); 
    introContent.classList.remove('visible'); 
    await esperar(1000); // Tempo de fade-out

    // --- PARTE 2: Texto Inicial ---
    introContent.innerHTML = "<p>Essa história começa em Maresias, litoral de São Paulo, na comemoração dos 26, em que Júlia agradece mais um ano de vida e pede muitas bençãos para o ano que vinha aí...</p>";
    introContent.classList.add('visible'); 
    await esperar(7000); // Texto longo, mais tempo de leitura
    introContent.classList.remove('visible'); 
    await esperar(1000);

    // --- PARTE 3: O Vídeo ---
    introContent.innerHTML = `
        <video id="video1" playsinline autoplay>
            <source src="imagens/ia_ju1.mp4" type="video/mp4">
            Seu navegador não suporta vídeos.
        </video>
    `;
    introContent.classList.add('visible');
    
    // Espera o vídeo acabar
    const videoElement = document.getElementById('video1');
    await new Promise(resolve => {
        // Se terminar normalmente
        videoElement.onended = () => resolve();
        // Segurança: Se travar, avança em 15s
        setTimeout(resolve, 15000); 
    });

    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 4: Aprendizados (Texto Apenas) ---
    introContent.innerHTML = "<p>Esse ano foi de muitos aprendizados, desafios e conquistas. Todos eles você enfrentou e se saiu muito bem meu amor! ❤️</p>";
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 5: Duolingo (Texto + Imagem slide2.webp) ---
    introContent.innerHTML = `
        <p>Você atingiu o seu objetivo no Duolingo, o que não é para qualquer um! 🦉💚</p>
        <img src="imagens/slide2.webp" alt="Conquista Duolingo">
    `;
    introContent.classList.add('visible');
    await esperar(6000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 6: Mãe (Texto + Imagem slide1.jpg) ---
    introContent.innerHTML = `
        <p>Você enfrentou brigas e provações com a sua mãe, e saiu mais forte e madura delas. 💪🌹</p>
        <img src="imagens/slide1.jpg" alt="Com a mãe">
    `;
    introContent.classList.add('visible');
    
    // O código para aqui (última imagem fica na tela).
    // Se quiser ir para o "game" depois, basta adicionar lógica aqui.
}