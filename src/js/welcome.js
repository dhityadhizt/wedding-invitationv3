import {data} from "../assets/data/data.js";
import {addClassElement, getQueryParameter, removeClassElement} from "../utils/helper.js";

export const welcome = () => {
    const welcomeElement = document.querySelector('.welcome');
    const homeElement = document.querySelector('.home');
    const navbarElement = document.querySelector('header nav');

    let welcomeContainer = document.getElementById('welcome3D');
    if (!welcomeContainer) {
        welcomeContainer = document.createElement('div');
        welcomeContainer.id = 'welcome3D';
        welcomeContainer.className = 'welcome-content';
        while (welcomeElement.firstChild) {
            welcomeContainer.appendChild(welcomeElement.firstChild);
        }
        welcomeElement.appendChild(welcomeContainer);
    }

    const ornamentTop = welcomeContainer.querySelector('.welcome-ornament.top') || document.createElement('img');
    const ornamentBottom = welcomeContainer.querySelector('.welcome-ornament.bottom') || document.createElement('img');
    const h2Element = welcomeContainer.querySelector('h2');
    const figureElement = welcomeContainer.querySelector('figure');
    const weddingToElement = welcomeContainer.querySelector('p');
    const openWeddingButton = welcomeContainer.querySelector('button');

    const audioElements = document.querySelector('.audio');
    const audioMusic = audioElements ? audioElements.querySelector('audio') || audioElements.children[0] : null;
    const audioButton = audioElements ? audioElements.querySelector('button') || audioElements.children[1] : null;
    const iconButton = audioButton ? audioButton.querySelector('i') || audioButton.children[0] : null;

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
    };

    const initialAudio = () => {
        if (!audioMusic || !audioButton || !iconButton) return;
        let isPlaying = false;
        audioMusic.innerHTML = `<source src="${data.audio}" type="audio/mp3"/>`;

        audioButton.addEventListener('click', () => {
            if (isPlaying) {
                addClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-play-circle');
                addClassElement(iconButton, 'bx-pause-circle');
                audioMusic.play().catch(() => {});
            } else {
                removeClassElement(audioButton, 'active');
                removeClassElement(iconButton, 'bx-pause-circle');
                addClassElement(iconButton, 'bx-play-circle');
                audioMusic.pause();
            }
            isPlaying = !isPlaying;
        });
    };

    if (openWeddingButton) {
        openWeddingButton.addEventListener('click', () => {
            addClassElement(document.body, 'active');
            addClassElement(welcomeElement, 'hide');

            setTimeout(() => {
                addClassElement(homeElement, 'active');
                addClassElement(navbarElement, 'active');
                if (audioButton) addClassElement(audioButton, 'show');
                if (iconButton) {
                    removeClassElement(iconButton, 'bx-play-circle');
                    addClassElement(iconButton, 'bx-pause-circle');
                }
                if (audioMusic) audioMusic.play().catch(() => {});
            }, 1500);

            setTimeout(() => {
                if (audioButton) addClassElement(audioButton, 'active');
            }, 3000);
        });
    }

    const initializeWelcome = () => {
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
    };

    initializeWelcome();
    initialAudio();
};
