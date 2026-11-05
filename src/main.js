import { home } from "./js/home.js";
import { bride } from "./js/bride.js";
import { time } from "./js/time.js";
import { galeri } from "./js/galeri.js";
import { wishas } from "./js/wishas.js";
import { navbar } from "./js/navbar.js";
import { welcome } from "./js/welcome.js";

document.addEventListener('DOMContentLoaded', () => {
    AOS.init();

    // 1. Tangkap parameter '?to=' dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipientName = urlParams.get('to');

    if (recipientName) {
        // Tampilkan nama tamu pada elemen sambutan
        const guestElement = document.getElementById("guest-name");
        if (guestElement) {
            guestElement.textContent = recipientName;
        }

        // Isi otomatis input nama pada form RSVP
        const nameInput = document.getElementById("name");
        if (nameInput) {
            nameInput.value = recipientName;
        }
    }

    welcome();
    navbar();
    home();
    bride();
    time();
    galeri();
    wishas();
});
