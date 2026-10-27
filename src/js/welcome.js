import {data} from "../assets/data/data.js";
import {addClassElement, getQueryParameter, removeClassElement} from "../utils/helper.js";

export const welcome = () => {
    const welcomeElement = document.querySelector('.welcome');
    const homeElement = document.querySelector('.home');
    const navbarElement = document.querySelector('header nav');

    // Menyesuaikan struktur anak elemen setelah penambahan ornament atas & bawah:
    // [0] = ornament atas, [1] = h2 (The Wedding Of), [2] = figure, [3] = p (weddingToElement), [4] = button (openWeddingButton), [5] = ornament bawah
    const [ornamentTop, h2Element, figureElement, weddingToElement, openWeddingButton, ornamentBottom] = welcomeElement.children;
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

        if (params) {
            weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>${params}</span>`;
            name.value = params;
        } else {
            weddingToElement.innerHTML = `Kepada Yth Bapak/Ibu/Saudara/i<br><span>You are invited</span>`;
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
        // Ambil elemen konten utama di dalam .welcome untuk diberi efek 3D
        const contentElements = welcomeElement.querySelectorAll('img.ornament, h2, figure, p, button');

        const applyTransform = (x, y) => {
            contentElements.forEach(el => {
                el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
            });
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

            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
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

    const initializeWelcome = () => {
        // Otomatis menyisipkan ornamen bar.png di awal (atas) dan akhir (bawah) elemen anak .welcome jika belum ada di HTML
        if (!welcomeElement.querySelector('.ornament-top')) {
            ornamentTop.outerHTML = `<img src="./assets/images/bar.png" alt="Ornament" class="ornament ornament-top">`;
            ornamentBottom.outerHTML = `<img src="./assets/images/bar.png" alt="Ornament" class="ornament ornament-bottom">`;
        }

        figureElement.innerHTML = generateFigureContent(data.bride);
        generateParameterContent();
        addClassElement(welcomeElement, 'active');
        initGyroscopeEffect(); 
    }

    initializeWelcome();
    initialAudio();
}
