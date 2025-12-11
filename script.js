const presentationSlides = [
    { 
        id: 1, 
        image: "imagens/slide1.jpg", 
        options: [
            { text: "Ir para Slide 2", nextSlide: 2 },
            { text: "Recomeçar Apresentação", nextSlide: 1 }
        ] 
    },
    // ... (Mantenha o resto dos seus slides 2 a 7 aqui) ...
    { 
        id: 2, 
        image: "imagens/slide2.jpg", 
        options: [
            { text: "Opção A (Vai para Slide 3)", nextSlide: 3 },
            { text: "Opção B (Vai para Slide 4)", nextSlide: 4 } 
        ] 
    },
    { 
        id: 3, 
        image: "imagens/slide3.jpg", 
        options: [
            { text: "Continuar no Slide 5", nextSlide: 5 }
        ] 
    },
    { 
        id: 4, 
        image: "imagens/slide4.jpg", 
        options: [
            { text: "Voltar para o Slide 3", nextSlide: 3 },
            { text: "Seguir para o Slide 5", nextSlide: 5 } 
        ] 
    },
    { 
        id: 5, 
        image: "imagens/slide5.jpg", 
        options: [
            { text: "Avançar para o Slide 6", nextSlide: 6 }
        ] 
    },
    { 
        id: 6, 
        image: "imagens/slide6.jpg", 
        options: [
            { text: "Ir para o Slide 7 (Final)", nextSlide: 7 },
            { text: "Voltar para o Slide 1", nextSlide: 1 }
        ] 
    },
    { 
        id: 7, 
        image: "imagens/slide7.jpg", 
        options: [
            { text: "🎉 Fim da Apresentação! Recomeçar.", nextSlide: 1 }
        ] 
    }
];

let currentSlideIndex = 0; 
const CORRECT_PASSWORD = "1234"; // << Sua senha

// --- FUNÇÃO DE SENHA ---
function verificarSenha() {
    const input = document.getElementById('password-input').value;
    const errorMessage = document.getElementById('error-message');

    if (input === CORRECT_PASSWORD) {
        errorMessage.classList.add('hidden'); // Esconde erro
        iniciarApresentacao(); // Inicia a apresentação
    } else {
        errorMessage.classList.remove('hidden'); // Mostra erro
    }
}

// --- FUNÇÃO DE INÍCIO DA APRESENTAÇÃO ---
function iniciarApresentacao() {
    document.querySelector('.hello-container').classList.add('hidden');
    document.getElementById('presentation-container').classList.remove('hidden');
    showSlide(1); // Exibe o Slide 1
}

// --- FUNÇÃO PRINCIPAL DE EXIBIÇÃO DE SLIDE (COM FADE) ---
function showSlide(slideNumber) {
    const slide = presentationSlides[slideNumber - 1]; 
    const slideImage = document.getElementById('slide-image');

    if (!slide) {
        console.error("Slide não encontrado:", slideNumber);
        return;
    }

    currentSlideIndex = slideNumber - 1;

    // 1. Remove a classe 'fade-in' (Faz a imagem desaparecer)
    slideImage.classList.remove('fade-in');

    // Usamos setTimeout para dar tempo do fade-out acontecer antes de mudar a imagem
    setTimeout(() => {
        // 2. Atualiza o conteúdo da imagem
        slideImage.src = slide.image;
        document.getElementById('current-slide').textContent = slide.id;

        // 3. Adiciona a classe 'fade-in' (Faz a nova imagem aparecer suavemente)
        slideImage.classList.add('fade-in');

        // 4. Atualiza os botões
        const controlsDiv = document.getElementById('controls');
        controlsDiv.innerHTML = '<h2>O que você deseja fazer agora?</h2>'; 

        slide.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option.text;
            button.onclick = () => showSlide(option.nextSlide);
            controlsDiv.appendChild(button);
        });
        
    }, 500); // 500ms é o tempo da transição definido no CSS
}