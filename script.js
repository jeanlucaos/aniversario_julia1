// --- CONFIGURAÇÕES GERAIS ---
const ACCEPTED_PASSWORDS = ["jean", "jeanluca", "jean luca"];

const introContent = document.getElementById('intro-content');
const introContainer = document.getElementById('intro-container');
const music = document.getElementById('bg-music');

let wakeLock = null; // Variável global para controlar o Wake Lock (mantém a tela ligada)

// Função auxiliar 'Promessa' para pausas
const esperar = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// --- Função para Pré-Carregar Imagem ---
// Isso garante que a foto exista antes de tentarmos mostrá-la
const carregarImagem = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve; 
        img.onerror = resolve; // Segue mesmo se der erro (para não travar)
    });
};

// --- 1. VERIFICAÇÃO DE SENHA ---
function verificarSenha() {
    const input = document.getElementById('password-input').value.toLowerCase().trim();
    const errorMessage = document.getElementById('error-message');

    if (ACCEPTED_PASSWORDS.includes(input)) {
        errorMessage.classList.add('hidden');
        document.querySelector('.hello-container').classList.add('hidden');
        
        music.volume = 0.5; 
        music.play().catch(e => console.log("Erro no autoplay de áudio:", e));

        // Tenta adquirir o Wake Lock (MANTÉM A TELA ACESA)
        if ('wakeLock' in navigator) {
             // Chamada assíncrona para não bloquear a thread
            navigator.wakeLock.request('screen')
                .then((lock) => {
                    wakeLock = lock;
                    console.log("Screen Wake Lock Ativo!");
                })
                .catch((err) => {
                    console.log("Falha ao adquirir Wake Lock:", err);
                });
        }

        mostrarAvisoVolume(); // Chama o novo aviso de volume
    } else {
        // MUDANÇA SOLICITADA: Nova mensagem de erro
        errorMessage.textContent = 'Tá maluca é?👀 Tenta de novo!'; 
        errorMessage.classList.remove('hidden');
    }
}

// --- 2. NOVO AVISO DE VOLUME (Aumente o Volume!!) ---
async function mostrarAvisoVolume() {
    const volumeContainer = document.getElementById('volume-warning-container');
    const fadeElement = volumeContainer.querySelector('.fade-element');

    volumeContainer.classList.remove('hidden');
    fadeElement.classList.add('visible'); 

    // Ouve o clique em qualquer lugar do container para prosseguir
    await new Promise(resolve => {
        volumeContainer.addEventListener('click', () => {
            fadeElement.classList.remove('visible'); 
            // Espera a animação de fade-out (1 segundo)
            setTimeout(() => {
                volumeContainer.classList.add('hidden');
                resolve();
            }, 1000); 
        }, { once: true });
    });
    
    // Após o aviso de volume ser dispensado, inicia a contagem
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

// --- 4. SEQUÊNCIA DA HISTÓRIA ---
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

    // PARTE 4: Duolingo
    introContent.innerHTML = `<p>Você atingiu o seu objetivo no Duolingo, o que não é para qualquer um! 🦉💚</p><img src="imagens/slide2.jpg" alt="Conquista Duolingo">`;
    introContent.classList.add('visible');
    await esperar(5000); 
    introContent.classList.remove('visible');
    await esperar(1000);

    // PARTE 5: Mãe
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

    // PARTE 8: Palhaça (Com pré-carregamento da imagem para evitar atraso)
    await carregarImagem("imagens/palhaca.png"); // Pré-carrega a imagem

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

    // --- PARTE 10: Cazalsão da Porra ---
    introContent.innerHTML = `<p style="font-size: 1.3em; font-weight: bold; color: #ff4d4d;">Você é o presente na minha vida que me permite ser um cazalsão da porra!! 🔥💏</p>`;
    introContent.classList.add('visible');
    await esperar(5000);
    introContent.classList.remove('visible');
    await esperar(1000); // Pausa para transição suave

    // --- PARTE 11: Chuva de 50 Fotos (Com inserção de texto e tempo fixo para a foto 8) ---
    
    let tempoDeExibicao = 2000; 
    const tempoMinimo = 1200;   

    for (let i = 1; i <= 50; i++) {
        const src = `imagens/casal/${i}.jpeg`;
        let tempoAtual = (i === 50) ? 5000 : tempoDeExibicao; // Padrão ou Última foto (5s)

        // NOVO: Ponto de Inserção de Texto entre a foto 7 e a 8
        if (i === 8) {
            // A foto 7 já foi exibida e o fade-out foi completado (pela iteração anterior)
            
            // 1. Exibir o texto de transição
            introContent.innerHTML = `<p style="font-size: 1.5em; font-weight: bold; color: #007bff;">O seu sorriso ilumina a minha vida ✨</p>`;
            introContent.classList.add('visible'); 
            await esperar(3000); // Exibe o texto por 3 segundos
            introContent.classList.remove('visible');
            await esperar(1000); // Espera o fade-out

            // 2. Define o tempo fixo para a foto 8 (4 segundos)
            tempoAtual = 4000;
        }

        // 3. Pré-carrega a imagem ANTES de colocá-la na tela
        await carregarImagem(src);

        introContent.innerHTML = `<img src="${src}" style="max-height: 60vh; border: 2px solid #fff;">`;
        introContent.classList.add('visible'); // Fade IN
        
        // 4. Aguarda o tempo de exibição (tempo padrão, 5s para a última, ou 4s para a foto 8)
        await esperar(tempoAtual);
        
        // 5. Se não for a última, faz o Fade OUT
        if (i < 50) {
            introContent.classList.remove('visible');
            
            // 6. Espera a animação do CSS terminar (1000ms = 1s)
            await esperar(1000); 
            
            // 7. Aceleração suave (reduz apenas 5% do tempo a cada foto)
            tempoDeExibicao = Math.max(tempoMinimo, tempoDeExibicao * 0.95);
        }
    }
    
    // NOVO: Liberar o Wake Lock (Permite que a tela apague novamente)
    if (wakeLock) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
                console.log("Screen Wake Lock Liberado.");
            });
    }
}

function esperarVideoTerminar(idVideo) {
    return new Promise(resolve => {
        const videoElement = document.getElementById(idVideo);
        if(!videoElement) { resolve(); return; }
        videoElement.onended = () => resolve();
        setTimeout(resolve, 20000); 
    });
}