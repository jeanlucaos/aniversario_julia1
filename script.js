// --- CONFIGURAÇÕES GERAIS ---
const ACCEPTED_PASSWORDS = ["jean", "jeanluca", "jean luca"];

const introContent = document.getElementById('intro-content');
const introContainer = document.getElementById('intro-container');
const music = document.getElementById('bg-music');

// Função auxiliar 'Promessa' para pausas
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- 1. VERIFICAÇÃO DE SENHA ---
function verificarSenha() {
    const input = document.getElementById('password-input').value.toLowerCase().trim();
    const errorMessage = document.getElementById('error-message');

    if (ACCEPTED_PASSWORDS.includes(input)) {
        errorMessage.classList.add('hidden');
        document.querySelector('.hello-container').classList.add('hidden');
        
        // MÚSICA COMEÇA AGORA (junto com a contagem)
        music.volume = 0.5; 
        music.play().catch(e => console.log("Erro no autoplay de áudio:", e));

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

    // Fim da contagem -> Vai para intro
    countdownContainer.classList.add('hidden');
    iniciarIntro();
}

// --- 3. SEQUÊNCIA DA HISTÓRIA ---
async function iniciarIntro() {
    introContainer.classList.remove('hidden');

    // --- PARTE 1: Títulos ---
    introContent.innerHTML = "<h2>✨ Os 27 da Jú ✨</h2>";
    await esperar(100); 
    introContent.classList.add('visible'); 
    await esperar(3000); 
    introContent.classList.remove('visible'); 
    await esperar(1000); 

    // --- PARTE 2: Texto Maresias ---
    introContent.innerHTML = "<p>Essa história começa em Maresias, litoral de São Paulo, na comemoração dos 26, em que Júlia agradece mais um ano de vida e pede muitas bençãos para o ano que vinha aí...</p>";
    introContent.classList.add('visible'); 
    await esperar(6000); 
    introContent.classList.remove('visible'); 
    await esperar(1000);

    // --- PARTE 3: Vídeo Maresias ---
    introContent.innerHTML = `
        <video id="video1" playsinline autoplay>
            <source src="imagens/ia_ju1.mp4" type="video/mp4">
        </video>
    `;
    introContent.classList.add('visible');
    await esperarVideoTerminar('video1');
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 4: Aprendizados ---
    introContent.innerHTML = "<p>Esse ano foi de muitos aprendizados, desafios e conquistas. Todos eles você enfrentou e se saiu muito bem meu amor! ❤️</p>";
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 5: Duolingo (Slide 2.jpg) ---
    introContent.innerHTML = `
        <p>Você atingiu o seu objetivo no Duolingo, o que não é para qualquer um! 🦉💚</p>
        <img src="imagens/slide2.jpg" alt="Conquista Duolingo">
    `;
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 6: Mãe (Slide 1.jpg) ---
    introContent.innerHTML = `
        <p>Você enfrentou brigas e provações com a sua mãe, e saiu mais forte e madura delas. 💪🌹</p>
        <img src="imagens/slide1.jpg" alt="Com a mãe">
    `;
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 7: Medicina ---
    introContent.innerHTML = `
        <p>Você vem realizando seu sonho na medicina, estudando, aprendendo e se tornando cada vez mais a grande médica que você vai ser! 🩺👩‍⚕️</p>
    `;
    introContent.classList.add('visible');
    await esperar(5000);
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 8: Vídeo Médica ---
    introContent.innerHTML = `
        <video id="video2" playsinline autoplay>
            <source src="imagens/ia_medica.mp4" type="video/mp4">
        </video>
    `;
    introContent.classList.add('visible');
    await esperarVideoTerminar('video2');
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 9: Amor/Dança ---
    introContent.innerHTML = `
        <p>Aproveitando e dançando a vida com o seu grande amor! 💃🕺❤️</p>
    `;
    introContent.classList.add('visible');
    await esperar(4000);
    introContent.classList.remove('visible');
    await esperar(1000);

    // --- PARTE 10: Vídeo Juntos (FIM DA INTRO) ---
    introContent.innerHTML = `
        <video id="video3" playsinline autoplay>
            <source src="imagens/ia_juntos.mp4" type="video/mp4">
        </video>
    `;
    introContent.classList.add('visible');
    
    // Deixamos este vídeo na tela ao final ou seguimos para outra coisa
    // Se quiser que pare aqui, basta não fazer mais nada.
}

// Função auxiliar para esperar vídeos
function esperarVideoTerminar(idVideo) {
    return new Promise(resolve => {
        const videoElement = document.getElementById(idVideo);
        if(!videoElement) { resolve(); return; }
        
        videoElement.onended = () => resolve();
        // Fallback de 20s caso o vídeo trave
        setTimeout(resolve, 20000); 
    });
}