document.addEventListener('DOMContentLoaded', () => {
    // 1. GERENCIAMENTO DE ESTRELAS EM CAMADAS (Paralaxe 3D)
    const layers = {
        far: { element: document.getElementById('stars-far'), count: 100, size: [0.5, 1.2], speed: 0.01 },
        mid: { element: document.getElementById('stars-mid'), count: 70, size: [1.2, 2.0], speed: 0.03 },
        near: { element: document.getElementById('stars-near'), count: 40, size: [2.0, 3.5], speed: 0.06 }
    };

    function createStars() {
        for (const [layerName, layer] of Object.entries(layers)) {
            for (let i = 0; i < layer.count; i++) {
                const star = document.createElement('div');
                star.classList.add('star');
                
                // Variação de tamanho baseada na camada
                const size = Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0];
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                // Posição
                star.style.left = `${Math.random() * 100}%`;
                star.style.top = `${Math.random() * 100}%`;
                
                // Cores sutis para estrelas maiores
                if (layerName === 'near' && Math.random() > 0.7) {
                    star.style.backgroundColor = Math.random() > 0.5 ? '#dcedff' : '#ffe8e8';
                }

                // Animação de brilho aleatória
                if (Math.random() > 0.5) {
                    star.classList.add('twinkle');
                    star.style.animationDuration = `${Math.random() * 4 + 2}s`;
                    star.style.animationDelay = `${Math.random() * 5}s`;
                } else {
                    star.style.opacity = Math.random() * 0.7 + 0.3;
                }

                layer.element.appendChild(star);
            }
        }
    }
    createStars();

    // 2. ESTRELAS CADENTES
    const shootingStarsContainer = document.getElementById('shooting-stars');
    
    function createShootingStar() {
        const star = document.createElement('div');
        star.classList.add('shooting-star');
        
        // Posição inicial no topo/direita
        star.style.top = `${Math.random() * 30}%`;
        star.style.left = `${Math.random() * 50 + 50}%`;
        
        const duration = Math.random() * 1.5 + 1;
        star.style.animationDuration = `${duration}s`;
        
        shootingStarsContainer.appendChild(star);
        
        // Remove do DOM após a animação
        setTimeout(() => {
            star.remove();
        }, duration * 1000);

        // Define a próxima estrela aleatoriamente (entre 4 e 15 segundos)
        setTimeout(createShootingStar, Math.random() * 11000 + 4000);
    }
    // Inicia a primeira estrela cadente após 5 segundos
    setTimeout(createShootingStar, 5000);

    // 3. EFEITO PARALAXE ULTRA SUAVE COM LERP (Interpolação Linear)
    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    
    const moonWrapper = document.getElementById('moon-wrapper');
    const glassPanel = document.querySelector('.glass-panel');

    // Captura mouse
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Normaliza de -1 a 1
        mouseX = (e.clientX - centerX) / centerX;
        mouseY = (e.clientY - centerY) / centerY;
    });

    // Captura giroscópio (celulares)
    window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null) {
            let gamma = e.gamma; // Esquerda/Direita
            let beta = e.beta - 45; // Frente/Trás (ajustado para a posição de segurar o celular)
            
            // Limita os valores
            gamma = Math.max(-45, Math.min(45, gamma));
            beta = Math.max(-45, Math.min(45, beta));
            
            mouseX = gamma / 45;
            mouseY = beta / 45;
        }
    });

    // Loop de renderização (60fps)
    function render() {
        // Interpolação suave (Lerp)
        currentX += (mouseX - currentX) * 0.05;
        currentY += (mouseY - currentY) * 0.05;

        // Movimenta a Lua
        if (moonWrapper) {
            moonWrapper.style.transform = `translate(${currentX * -30}px, ${currentY * -30}px)`;
        }

        // Movimenta a Caixa de Texto suavemente em direção oposta
        if (glassPanel) {
            glassPanel.style.transform = `translate(${currentX * 15}px, ${currentY * 15}px) rotateX(${currentY * -2}deg) rotateY(${currentX * 2}deg)`;
        }

        // Movimenta as camadas de estrelas em profundidade
        layers.far.element.style.transform = `translate(${currentX * -10}px, ${currentY * -10}px)`;
        layers.mid.element.style.transform = `translate(${currentX * -30}px, ${currentY * -30}px)`;
        layers.near.element.style.transform = `translate(${currentX * -60}px, ${currentY * -60}px)`;

        requestAnimationFrame(render);
    }
    
    // Inicia o loop
    render();
});