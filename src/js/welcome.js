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

    // --- Integrasi Efek 3D Gyroscope & Mouse Parallax ---
    const initGyroscopeEffect = () => {
        // Gyroscope untuk pengguna Smartphone/Mobile
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => {
                let tiltX = e.gamma; // Kiri-kanan (-90 hingga 90)
                let tiltY = e.beta;  // Depan-belakang (-180 hingga 180)
                
                if (tiltX !== null && tiltY !== null) {
                    let x = tiltX / 5;
                    let y = tiltY / 5;
                    welcomeElement.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
                }
            });
        }

        // Fallback / Efek Mouse Movement untuk pengguna Desktop/Laptop
        welcomeElement.addEventListener('mousemove', (e) => {
            let x = (window.innerWidth / 2 - e.clientX) / 30;
            let y = (window.innerHeight / 2 - e.clientY) / 30;
            welcomeElement.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${-y}deg)`;
        });

        welcomeElement.addEventListener('mouseleave', () => {
            welcomeElement.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg)`;
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
