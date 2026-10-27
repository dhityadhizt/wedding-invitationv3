import {data} from "../assets/data/data.js";
import {addClassElement, getQueryParameter, removeClassElement} from "../utils/helper.js";

export const welcome = () => {
    const welcomeElement = document.querySelector('.welcome');
    const homeElement = document.querySelector('.home');
    const navbarElement = document.querySelector('header nav');

    // Buat/ambil wrapper konten 3D di dalam .welcome secara aman
    let welcomeContainer = document.getElementById('welcome3D');
    if (!welcomeContainer) {
        welcomeContainer = document.createElement('div');
        welcomeContainer.id = 'welcome3D';
        welcomeContainer.className = 'welcome-content';
        // Pindahkan isi welcomeElement ke dalam wrapper
        while (welcomeElement.firstChild) {
            welcomeContainer.appendChild(welcomeElement.firstChild);
        }
        welcomeElement.appendChild(welcomeContainer);
    }

    // Ambil elemen spesifik dari dalam wrapper konten
    const ornamentTop = welcomeContainer.querySelector('.welcome-ornament.top') || document.createElement('img');
    const ornamentBottom = welcomeContainer.querySelector('.welcome-ornament.bottom') || document.createElement('img');
    const h2Element = welcomeContainer.querySelector('h2');
    const figureElement = welcomeContainer.querySelector('figure');
    const weddingToElement = welcomeContainer.querySelector('p');
    const openWeddingButton = welcomeContainer.querySelector('button');

    const [audioMusic, audioButton] = document.querySelector('.audio').children;
    const [iconButton] = audioButton.children;

    const generateFigureContent = (bride) => {
        const {L: {name: brideLName}, P: {name: bridePName}, couple: coupleImage} = bride;
        return `
            <img src="${coupleImage}" alt="couple animation">
            <figcaption>
                ${brideLName.split(' ')[0]} & ${bridePName.split(' ')[0]}
            </figcaption>`;
    };

    const generateParameterContent = () => {
        const name = document.querySelector('#name');
        const params = getQueryParameter('to');

        if (weddingToElement) {
            if (params) {
                weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>${params}</span>`;
                if (name) name.value = params;
            } else {
                weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>You are invited</span>`;
            }
        }
    }

    const initialAudio = () => {
        let isPlaying = false;

        audioMusic.innerHTML = `<source src=${data.audio} type="audio/mp3"/>`;

        audioButton.addEventListener('click', () => {
            if (isPlaying) {
                addClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-play-circle');
                addClassElement(iconButton, 'bx-pause-circle');
                audioMusic.play();
            } else {
                removeClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-pause-circle');
                addClassElement(iconButton, 'bx-play-circle');
                audioMusic.pause();
            }
            isPlaying = !isPlaying;
        });
    };

    // --- Integrasi Efek 3D Gyroscope & Mouse Parallax (Background tetap diam) ---
    const initGyroscopeEffect = () => {
        const applyTransform = (x, y) => {
            if (welcomeContainer) {
                welcomeContainer.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
            }
        };

        // Gyroscope untuk Smartphone/Mobile dengan penanganan izin iOS
        if (window.DeviceOrientationEvent) {
            const handleOrientation = (e) => {
                let tiltX = e.gamma; 
                let tiltY = e.beta;  
                
                if (tiltX !== null && tiltY !== null) {
                    let x = tiltX / 6; 
                    let y = tiltY / 6;
                    applyTransform(x, y);
                }
            };

            if (openWeddingButton && typeof DeviceOrientationEvent.requestPermission === 'function') {
                openWeddingButton.addEventListener('click', () => {
                    DeviceOrientationEvent.requestPermission().catch(() => {});
                }, { once: true });
            }
            
            window.addEventListener('deviceorientation', handleOrientation);
        }

        // Fallback / Efek Mouse Movement untuk Desktop/Laptop
        welcomeElement.addEventListener('mousemove', (e) => {
            let x = (window.innerWidth / 2 - e.clientX) / 40;
            let y = (window.innerHeight / 2 - e.clientY) / 40;
            applyTransform(x, y);
        });

        welcomeElement.addEventListener('mouseleave', () => {
            applyTransform(0, 0);
        });
    };

    if (openWeddingButton) {
        openWeddingButton.addEventListener('click', () => {
            addClassElement(document.body, 'active');
            addClassElement(welcomeElement, 'hide');

            setTimeout(() => {
                addClassElement(homeElement, 'active');
                addClassElement(navbarElement, 'active');
                addClassElement(audioButton, 'show');
                removeClassElement(iconButton, 'bx-play-circle');
                addClassElement(iconButton, 'bx-pause-circle');
                audioMusic.play();
            }, 1500);

            setTimeout(() => {
                addClassElement(audioButton, 'active');
            }, 3000);
        });
    }

    const initializeWelcome = () => {
        // Otomatis menyisipkan ornamen bar.png jika belum ada di dalam container
        if (!welcomeContainer.querySelector('.welcome-ornament.top')) {
            ornamentTop.src = "./src/assets/images/bar.png";
            ornamentTop.alt = "Ornament Top";
            ornamentTop.className = "welcome-ornament top";
            welcomeContainer.prepend(ornamentTop);
        }

        if (!welcomeContainer.querySelector('.welcome-ornament.bottom')) {
            ornamentBottom.src = "./src/assets/images/bar.png";
            ornamentBottom.alt = "Ornament Bottom";
            ornamentBottom.className = "welcome-ornament bottom";
            welcomeContainer.appendChild(ornamentBottom);
        }

        if (figureElement) {
            figureElement.innerHTML = generateFigureContent(data.bride);
        }
        
        generateParameterContent();
        addClassElement(welcomeElement, 'active');
        initGyroscopeEffect(); 
    }

    initializeWelcome();
    initialAudio();
}
