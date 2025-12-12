// --- CONFIGURAÇÕES GERAIS ---
const ACCEPTED_PASSWORDS = ["jean", "jeanluca", "jean luca"];

const introContent = document.getElementById('intro-content');
const introContainer = document.getElementById('intro-container');
const music = document.getElementById('bg-music');

let wakeLock = null; // Controle do Wake Lock (tela ligada)

// Função auxiliar 'Promessa' para pausas
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Função para Pré-Carregar Imagem ---
const carregarImagem = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve; 
        img.onerror = resolve; 
    });
};

// --- Função Especial: Carregar Texto e Vídeo Juntos ---
// Garante que o container só apareça quando o vídeo estiver pronto para tocar
async function exibirTextoEVideo(texto, videoSrc, videoId) {
    // 1. Monta o HTML (ainda invisível)
    // preload="auto" ajuda a carregar mais rápido
    introContent.innerHTML = `
        <p>${texto}</p>
        <video id="${videoId}" playsinline preload="auto">
            <source src="imagens/${videoSrc}" type="video/mp4">
        </video>
    `;

    const videoElement = document.getElementById(videoId);

    // 2. Espera o vídeo estar pronto (canplay) ou um timeout de segurança
    await new Promise(resolve => {
        // Se já estiver pronto, resolve direto
        if (videoElement.readyState >= 3) {
            resolve();
            return;
        }
        
        // Se demorar mais que 5s, exibe assim mesmo para não travar
        const timeout = setTimeout(resolve, 5000);

        videoElement.oncanplay = () => {
            clearTimeout(timeout);
            resolve();
        };
        // Força o carregamento
        videoElement.load();
    });

    // 3. Exibe tudo junto e dá play
    introContent.classList.add('visible');
    try {
        await videoElement.play();
    } catch (e) {
        console.log("Autoplay bloqueado ou erro:", e);
    }

    // 4. Espera o vídeo terminar
    await esperarVideoTerminar(videoId);

    // 5. Some com tudo
    introContent.classList.remove('visible');
    await esperar(1000); 
}

function esperarVideoTerminar(idVideo, maxDuration = 20000) {
    return new Promise(resolve => {
        const videoElement = document.getElementById(idVideo);
        if(!videoElement) { 
            setTimeout(resolve, maxDuration); 
            return; 
        }
        
        const timeout = setTimeout(() => {
            if (videoElement.paused === false) videoElement.pause(); 
            resolve();
        }, maxDuration);

        videoElement.onended = () => {
             clearTimeout(timeout);
             resolve();
        };
    });
}

// --- 1. VERIFICAÇÃO DE SENHA ---
function verificarSenha() {
    const input = document.getElementById('password-input').value.toLowerCase().trim();
    const errorMessage = document.getElementById('error-message');

    if (ACCEPTED_PASSWORDS.includes(input)) {
        errorMessage.classList.add('hidden');
        document.querySelector('.hello-container').classList.add('hidden');
        
        // Tenta manter a tela ligada
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen')
                .then((lock) => { wakeLock = lock; })
                .catch((err) => console.log("Erro Wake Lock:", err));
        }

        mostrarAvisoVolume(); 
    } else {
        errorMessage.textContent = 'Tá maluca é?👀 Tenta de novo!'; 
        errorMessage.classList.remove('hidden');
    }
}

// --- 2. AVISO DE VOLUME ---
async function mostrarAvisoVolume() {
    const volumeContainer = document.getElementById('volume-warning-container');
    const fadeElement = volumeContainer.querySelector('.fade-element');

    volumeContainer.classList.remove('hidden');
    fadeElement.classList.add('visible'); 

    await new Promise(resolve => {
        volumeContainer.addEventListener('click', () => {
            fadeElement.classList.remove('visible'); 
            
            music.volume = 0.5; 
            music.play().catch(e => console.log("Erro áudio:", e));

            setTimeout(() => {
                volumeContainer.classList.add('hidden');
                resolve();
            }, 1000); 
        }, { once: true });
    });
    
    iniciarContagem();
}

// --- 3. CONTAGEM REGRESSIVA ---
async function iniciarContagem() {
    const countdownContainer = document.getElementById('countdown-container');
    const countdownNumber = document.getElementById('countdown-number');

    countdownContainer.classList.remove('hidden');

    for (let i = 3; i > 0; i--) {
        countdownNumber.textContent = i;
        await esperar(1000); 
    }

    countdownContainer.classList.add('hidden');
    iniciarIntro();
}

// --- 4. FUNÇÃO PARA EXIBIR MÍDIA CUSTOMIZADA (FOTOS/VIDEOS FINAIS) ---
async function exibirMidiaCustomizada({ type, src, text, duration }) {
    const fullSrc = `imagens/casal/${src}`;
    
    if (type === 'image') await carregarImagem(fullSrc);
    
    let contentHTML = '';
    if (text) {
        contentHTML += `<p style="font-size: 1.5em; font-weight: bold; color: #007bff; margin-bottom: 20px;">${text}</p>`;
    }
    
    if (type === 'image') {
        contentHTML += `<img src="${fullSrc}" style="max-height: 60vh; border: 2px solid #fff;">`;
    } else if (type === 'video') {
        contentHTML += `<video id="video-seq" playsinline autoplay muted><source src="${fullSrc}" type="video/mp4"></video>`;
    }

    introContent.innerHTML = contentHTML;
    introContent.classList.add('visible'); 

    if (type === 'image') {
        await esperar(duration);
    } else if (type === 'video') {
        await esperarVideoTerminar('video-seq', duration); 
    }
    
    introContent.classList.remove('visible'); 
    await esperar(1000); 
}

// --- 5. SEQUÊNCIA DA HISTÓRIA (FLUXO PRINCIPAL) ---
async function iniciarIntro() {
    introContainer.classList.remove('hidden');

    // PARTE 1: Títulos
    introContent.innerHTML = "<h2>✨ Os 27 da Jú ✨</h2>";
    await esperar(100); 
    introContent.classList.add('visible'); 
    await esperar(3000); 
    introContent.classList.remove('visible'); 
    await esperar(1000); 

    // PARTE 2: Maresias (TEXTO + VÍDEO JUNTOS)
    await exibirTextoEVideo(
        "Essa história começa em Maresias, litoral de São Paulo, na comemoração dos 26, em que Júlia agradece mais um ano de vida e pede muitas bençãos para o ano que vinha aí...",
        "ia_ju1.mp4",
        "video1"
    );

    // PARTE 3: Aprendizados
    introContent.innerHTML = "<p>Esse ano foi de muitos aprendizados, desafios e conquistas. Todos eles você enfrentou e se saiu muito bem meu amor! ❤️</p>";
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 4: Duolingo
    await carregarImagem("imagens/slide2.jpg");
    introContent.innerHTML = `<p>Você atingiu o seu objetivo no Duolingo, o que não é para qualquer um! 🦉💚</p><img src="imagens/slide2.jpg" alt="Conquista Duolingo">`;
    introContent.classList.add('visible'); 
    await esperar(5000); 
    introContent.classList.remove('visible'); 
    await esperar(1000);

    // PARTE 5: Mãe
    await carregarImagem("imagens/slide1.jpg");
    introContent.innerHTML = `<p>Você enfrentou brigas e provações com a sua mãe, e saiu mais forte e madura delas. 💪🌹</p><img src="imagens/slide1.jpg" alt="Com a mãe">`;
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 6: Medicina (TEXTO + VÍDEO JUNTOS)
    await exibirTextoEVideo(
        "Você vem realizando seu sonho na medicina, estudando, aprendendo e se tornando cada vez mais a grande médica que você vai ser! 🩺👩‍⚕️",
        "ia_medica.mp4",
        "video2"
    );

    // PARTE 7: Amor (TEXTO + VÍDEO JUNTOS)
    await exibirTextoEVideo(
        "Aproveitando e dançando com o amor da sua vida! 💃🕺❤️",
        "ia_juntos.mp4",
        "video3"
    );

    // PARTE 8: Palhaça 
    await carregarImagem("imagens/palhaca.png"); 
    introContent.innerHTML = `<p>Engraçado né? Não é só você que sabe ser palhaça 🤡😂</p><img src="imagens/palhaca.png" alt="Palhaça">`;
    introContent.classList.add('visible');
    await esperar(6000);
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 9: Texto Sério
    introContent.innerHTML = `<p style="font-size: 1.2em; font-weight: bold;">Mas agora é sério meu amor, hoje é o seu aniversário mas o maior presente que alguém recebeu fui eu, de ter o privilégio de ter você na minha vida! 🎁❤️✨</p>`;
    introContent.classList.add('visible');
    await esperar(7000);
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 10: Cazalsão da Porra
    introContent.innerHTML = `<p style="font-size: 1.3em; font-weight: bold; color: #ff4d4d;">Você é o presente na minha vida que me permite ser um cazalsão da porra!! 🔥💏</p>`;
    introContent.classList.add('visible');
    await esperar(5000);
    introContent.classList.remove('visible');
    await esperar(1000); 

    // --- PARTE 11: SEQUÊNCIA CUSTOMIZADA DE FOTOS ---
    const customPhotoSequence = [
        { type: 'image', src: '1.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '2.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '4.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '11.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '12.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '17.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '29.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '32.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '36.jpeg', text: null, duration: 2000 },

        { type: 'image', src: '39.jpeg', text: 'Minha parceira de rolê', duration: 4000 },
        { type: 'image', src: '35.jpeg', text: 'Seja na noite', duration: 4000 },
        
        { type: 'image', src: '34.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '15.jpeg', text: null, duration: 2000 },
        
        { type: 'image', src: '40.jpeg', text: 'Seja no parque...', duration: 4000 },
        { type: 'image', src: '25.jpeg', text: '... na praia.', duration: 4000 },
        
        { type: 'video', src: 'carnaval.mp4', text: 'ou até mesmo no carnaval', duration: 20000 }, 
        
        { type: 'image', src: '31.jpeg', text: 'Rolê chique também.', duration: 4000 },
        { type: 'image', src: '33.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '9.jpeg', text: 'Ou nem tanto', duration: 4000 }
    ];
    
    for (const item of customPhotoSequence) {
        await exibirMidiaCustomizada(item);
    }

    // --- FINALIZAÇÃO ---
    introContent.innerHTML = `<p style="font-size: 1.8em; font-weight: bold; color: #ff4d4d;">❤️ Feliz Aniversário, meu amor! ❤️</p>`;
    introContent.classList.add('visible'); 
    await esperar(5000); 

    if (wakeLock) {
        wakeLock.release().then(() => wakeLock = null);
    }
}