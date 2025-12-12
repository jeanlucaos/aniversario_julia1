// --- CONFIGURAÇÕES GERAIS ---
const ACCEPTED_PASSWORDS = ["jean", "jeanluca", "jean luca"];

const introContent = document.getElementById('intro-content');
const introContainer = document.getElementById('intro-container');
const music = document.getElementById('bg-music');

let wakeLock = null; // Variável global para controlar o Wake Lock (mantém a tela ligada)

// Função auxiliar 'Promessa' para pausas
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Função para Pré-Carregar Imagem ---
const carregarImagem = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        // Resolve a promessa ao carregar ou se houver erro (para não travar o fluxo)
        img.onload = resolve; 
        img.onerror = resolve; 
    });
};

// Função para esperar o vídeo ou uma duração máxima
function esperarVideoTerminar(idVideo, maxDuration = 20000) {
    return new Promise(resolve => {
        const videoElement = document.getElementById(idVideo);
        if(!videoElement) { 
            setTimeout(resolve, maxDuration); // Fallback se não encontrar o elemento
            return; 
        }
        
        // Timeout para garantir que a apresentação não trave caso o evento 'onended' falhe
        const timeout = setTimeout(() => {
            if (videoElement.paused === false) {
                 videoElement.pause(); 
            }
            resolve();
        }, maxDuration);

        // Resolve a promessa quando o vídeo terminar
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
        
        // Tenta adquirir o Wake Lock (MANTÉM A TELA ACESA)
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen')
                .then((lock) => {
                    wakeLock = lock;
                    console.log("Screen Wake Lock Ativo!");
                })
                .catch((err) => {
                    console.log("Falha ao adquirir Wake Lock:", err);
                });
        }

        mostrarAvisoVolume(); 
    } else {
        // MUDANÇA SOLICITADA: Nova mensagem de erro
        errorMessage.textContent = 'Tá maluca é?👀 Tenta de novo!'; 
        errorMessage.classList.remove('hidden');
    }
}

// --- 2. AVISO DE VOLUME (Aumente o Volume!!) ---
async function mostrarAvisoVolume() {
    const volumeContainer = document.getElementById('volume-warning-container');
    const fadeElement = volumeContainer.querySelector('.fade-element');

    volumeContainer.classList.remove('hidden');
    fadeElement.classList.add('visible'); 

    // Ouve o clique para prosseguir
    await new Promise(resolve => {
        volumeContainer.addEventListener('click', () => {
            fadeElement.classList.remove('visible'); 
            
            // NOVO: A música só toca APÓS o clique
            music.volume = 0.5; 
            music.play().catch(e => console.log("Erro no autoplay de áudio:", e));

            // Espera a animação de fade-out (1 segundo)
            setTimeout(() => {
                volumeContainer.classList.add('hidden');
                resolve();
            }, 1000); 
        }, { once: true });
    });
    
    iniciarContagem();
}

// --- 3. CONTAGEM REGRESSIVA (3 a 1) ---
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

// --- 4. FUNÇÃO PARA EXIBIR MÍDIA CUSTOMIZADA (Texto + Imagem/Vídeo) ---
async function exibirMidiaCustomizada({ type, src, text, duration }) {
    const fullSrc = `imagens/casal/${src}`;
    
    // 1. Pré-carregamento para carregar texto e mídia juntos
    if (type === 'image') {
        await carregarImagem(fullSrc);
    } 
    
    // 2. Montar o HTML
    let contentHTML = '';
    if (text) {
        // Estilo para o texto em destaque
        contentHTML += `<p style="font-size: 1.5em; font-weight: bold; color: #007bff; margin-bottom: 20px;">${text}</p>`;
    }
    
    if (type === 'image') {
        contentHTML += `<img src="${fullSrc}" style="max-height: 60vh; border: 2px solid #fff;">`;
    } else if (type === 'video') {
        // Vídeo mutado conforme a requisição implícita para não sobrepor o áudio de fundo
        contentHTML += `<video id="video-seq" playsinline autoplay muted><source src="${fullSrc}" type="video/mp4"></video>`;
    }

    // 3. Exibir o conteúdo (Fade IN)
    introContent.innerHTML = contentHTML;
    introContent.classList.add('visible'); 

    // 4. Esperar a duração
    if (type === 'image') {
        await esperar(duration);
    } else if (type === 'video') {
        // Vídeo: espera o onended ou a duração máxima
        await esperarVideoTerminar('video-seq', duration); 
    }
    
    // 5. Fade OUT
    introContent.classList.remove('visible'); 
    await esperar(1000); // Espera a animação do CSS terminar
}


// --- 5. SEQUÊNCIA DA HISTÓRIA ---
async function iniciarIntro() {
    introContainer.classList.remove('hidden');

    // PARTE 1: Títulos
    introContent.innerHTML = "<h2>✨ Os 27 da Jú ✨</h2>";
    await esperar(100); 
    introContent.classList.add('visible'); 
    await esperar(3000); 
    introContent.classList.remove('visible'); 
    await esperar(1000); 

    // PARTE 2: Maresias
    introContent.innerHTML = "<p>Essa história começa em Maresias, litoral de São Paulo, na comemoração dos 26, em que Júlia agradece mais um ano de vida e pede muitas bençãos para o ano que vinha aí...</p>";
    introContent.classList.add('visible'); 
    await esperar(6000); 
    introContent.classList.remove('visible'); 
    await esperar(1000); 

    introContent.innerHTML = `<video id="video1" playsinline autoplay><source src="imagens/ia_ju1.mp4" type="video/mp4"></video>`;
    introContent.classList.add('visible');
    await esperarVideoTerminar('video1');
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 3: Aprendizados
    introContent.innerHTML = "<p>Esse ano foi de muitos aprendizados, desafios e conquistas. Todos eles você enfrentou e se saiu muito bem meu amor! ❤️</p>";
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 4: Duolingo (IMAGEM COM PRÉ-CARREGAMENTO)
    await carregarImagem("imagens/slide2.jpg"); // PRÉ-CARREGA A IMAGEM
    introContent.innerHTML = `<p>Você atingiu o seu objetivo no Duolingo, o que não é para qualquer um! 🦉💚</p><img src="imagens/slide2.jpg" alt="Conquista Duolingo">`;
    introContent.classList.add('visible'); 
    await esperar(5000); 
    introContent.classList.remove('visible'); 
    await esperar(1000);

    // PARTE 5: Mãe (IMAGEM COM PRÉ-CARREGAMENTO)
    await carregarImagem("imagens/slide1.jpg"); // PRÉ-CARREGA A IMAGEM
    introContent.innerHTML = `<p>Você enfrentou brigas e provações com a sua mãe, e saiu mais forte e madura delas. 💪🌹</p><img src="imagens/slide1.jpg" alt="Com a mãe">`;
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 6: Medicina
    introContent.innerHTML = `<p>Você vem realizando seu sonho na medicina, estudando, aprendendo e se tornando cada vez mais a grande médica que você vai ser! 🩺👩‍⚕️</p>`;
    introContent.classList.add('visible');
    await esperar(5000);
    introContent.classList.remove('visible');
    await esperar(1000);

    introContent.innerHTML = `<video id="video2" playsinline autoplay><source src="imagens/ia_medica.mp4" type="video/mp4"></video>`;
    introContent.classList.add('visible');
    await esperarVideoTerminar('video2');
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 7: Amor
    introContent.innerHTML = `<p>Aproveitando e dançando a vida com o seu grande amor! 💃🕺❤️</p>`;
    introContent.classList.add('visible');
    await esperar(4000);
    introContent.classList.remove('visible');
    await esperar(1000);

    introContent.innerHTML = `<video id="video3" playsinline autoplay><source src="imagens/ia_juntos.mp4" type="video/mp4"></video>`;
    introContent.classList.add('visible');
    await esperarVideoTerminar('video3');
    introContent.classList.remove('visible');
    await esperar(1000);

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

    // --- PARTE 11: NOVA SEQUÊNCIA DE FOTOS CUSTOMIZADA ---

    const customPhotoSequence = [
        // Fotos normais (2 segundos)
        { type: 'image', src: '1.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '2.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '4.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '11.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '12.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '17.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '29.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '32.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '36.jpeg', text: null, duration: 2000 },

        // Fotos com texto (4 segundos)
        { type: 'image', src: '39.jpeg', text: 'Minha parceira de rolê', duration: 4000 },
        { type: 'image', src: '35.jpeg', text: 'Seja na noite', duration: 4000 },
        
        // Fotos normais (2 segundos)
        { type: 'image', src: '34.jpeg', text: null, duration: 2000 },
        { type: 'image', src: '15.jpeg', text: null, duration: 2000 },
        
        // Fotos com texto (4 segundos)
        { type: 'image', src: '40.jpeg', text: 'Seja no parque...', duration: 4000 },
        { type: 'image', src: '25.jpeg', text: '... na praia.', duration: 4000 },
        
        // Vídeo (20 segundos max, ou até terminar)
        { type: 'video', src: 'carnaval.mp4', text: 'ou até mesmo no carnaval', duration: 20000 }, 
        
        // Mais fotos com texto
        { type: 'image', src: '31.jpeg', text: 'Rolê chique também.', duration: 4000 },
        
        // Fotos normais (2 segundos)
        { type: 'image', src: '33.jpeg', text: null, duration: 2000 },
        
        // Fotos com texto (4 segundos)
        { type: 'image', src: '9.jpeg', text: 'Ou nem tanto', duration: 4000 }
    ];
    
    for (const item of customPhotoSequence) {
        await exibirMidiaCustomizada(item);
    }

    // --- FINALIZAÇÃO (Pausa após a última foto) ---
    introContent.innerHTML = `<p style="font-size: 1.8em; font-weight: bold; color: #ff4d4d;">❤️ Feliz Aniversário, meu amor! ❤️</p>`;
    introContent.classList.add('visible'); 
    await esperar(5000); 

    // NOVO: Liberar o Wake Lock (Permite que a tela apague novamente)
    if (wakeLock) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
                console.log("Screen Wake Lock Liberado.");
            });
    }
}