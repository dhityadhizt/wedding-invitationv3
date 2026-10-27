import {data} from "../assets/data/data.js";
import {addClassElement, getQueryParameter, removeClassElement} from "../utils/helper.js";

export const welcome = () => {
    const welcomeElement = document.querySelector('.welcome');
    const homeElement = document.querySelector('.home');
    const navbarElement = document.querySelector('header nav');

    const [_, figureElement, weddingToElement, openWeddingButton] = welcomeElement.children;
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
        // Ambil semua elemen anak langsung di dalam .welcome kecuali background
        const contentElements = welcomeElement.querySelectorAll('h2, figure, p, button');

        // Fungsi helper untuk menerapkan rotasi 3D pada elemen konten
        const applyTransform = (x, y) => {
            contentElements.forEach(el => {
                el.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
            });
        };

        // Gyroscope untuk pengguna Smartphone/Mobile dengan penanganan izin iOS
        if (window.DeviceOrientationEvent) {
            const handleOrientation = (e) => {
                let tiltX = e.gamma; // Kiri-kanan (-90 hingga 90)
                let tiltY = e.beta;  // Depan-belakang (-180 hingga 180)
                
                if (tiltX !== null && tiltY !== null) {
                    let x = tiltX / 6; // Sesuaikan sensitivitas
                    let y = tiltY / 6;
                    applyTransform(x, y);
                }
            };

            // Untuk iOS 13+ yang memerlukan izin eksplisit dari pengguna
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                openWeddingButton.addEventListener('click', () => {
                    DeviceOrientationEvent.requestPermission().catch(() => {});
                }, { once: true });
                
                // Opsional: Bisa dipicu saat tombol buka atau interaksi pertama disentuh
                window.addEventListener('deviceorientation', handleOrientation, { once: true });
            }
            
            window.addEventListener('deviceorientation', handleOrientation);
        }

        // Fallback / Efek Mouse Movement untuk pengguna Desktop/Laptop
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
        figureElement.innerHTML = generateFigureContent(data.bride);
        generateParameterContent();
        addClassElement(welcomeElement, 'active');
        initGyroscopeEffect(); // Menjalankan fungsi 3D & Gyroscope saat welcome dimuat
    }

    initializeWelcome();
    initialAudio();
}
