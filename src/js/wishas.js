import {
    formattedDate,
    formattedName,
    generateRandomColor,
    generateRandomId,
    getCurrentDateTime,
    renderElement
} from "../utils/helper.js";
import {data} from "../assets/data/data.js";
import {comentarService} from "../services/comentarService.js";

export const wishas = () => {
    const wishasContainer = document.querySelector('.wishas');
    
    // 1. Ambil form secara spesifik agar tidak terpengaruh pergeseran struktur HTML
    const form = wishasContainer.querySelector('form');
    const buttonForm = form ? form.querySelector('button[type="submit"]') : null;

    // 2. Ambil elemen-elemen komentar menggunakan querySelector spesifik (Kelas/Atribut)
    const peopleComentar = wishasContainer.querySelector('.wishas-count') || wishasContainer.querySelector('div:nth-of-type(3) p, div:nth-of-type(2) p');
    const containerComentar = wishasContainer.querySelector('ul[aria-label="list comentar"]');
    const pageNumber = wishasContainer.querySelector('.page-number');
    const prevButton = wishasContainer.querySelector('.button-grup button:first-child');
    const nextButton = wishasContainer.querySelector('.button-grup button:last-child');

    const listItemBank = (data) => (
        ` <figure data-aos="zoom-in" data-aos-duration="1000">
                <img src=${data.icon} alt="bank icon animation">
                <figcaption>No. Rekening ${data.rekening.slice(0, 4)}xxxx <br>A.n ${data.name}</figcaption>
                <button data-rekening=${data.rekening} aria-label="copy rekening">Salin No. Rekening</button>
           </figure>`
    );

    const initialBank = () => {
        // Cari container bank secara aman
        const containerBank = wishasContainer.querySelector('div:first-of-type div') || wishasContainer.children[0].querySelector('div:last-child');

        if (containerBank && data.bank) {
            renderElement(data.bank, containerBank, listItemBank);

            containerBank.querySelectorAll('button').forEach((button) => {
                button.addEventListener('click', async (e) => {
                    const rekening = e.target.dataset.rekening;
                    try {
                        await navigator.clipboard.writeText(rekening);
                        button.textContent = 'Berhasil menyalin';
                    } catch (error) {
                        console.log(`Error : ${error.message}`);
                    } finally {
                        setTimeout(() => {
                            button.textContent = 'Salin No. Rekening';
                        }, 2000);
                    }
                });
            });
        }
    };

    const listItemComentar = (data) => {
        const name = formattedName(data.name);
        const newDate = formattedDate(data.date);
        let date = "";

        if (newDate.days < 1) {
            if (newDate.hours < 1) {
                date = `${newDate.minutes} menit yang lalu`;
            } else {
                date = `${newDate.hours} jam, ${newDate.minutes} menit yang lalu`;
            }
        } else {
            date = `${newDate.days} hari, ${newDate.hours} jam yang lalu`;
        }

        return ` <li data-aos="zoom-in" data-aos-duration="1000">
                     <div style="background-color: ${data.color}">${data.name.charAt(0).toUpperCase()}</div>
                     <div>
                         <h4>${name}</h4>
                         <p>${date} <br>${data.status}</p>
                         <p>${data.message}</p>
                     </div>
                 </li>`;
    };

    let lengthComentar = 0;
    let currentPage = 1;
    let itemsPerPage = 4;
    let startIndex = 0;
    let endIndex = itemsPerPage;

    const initialComentar = async () => {
        if (!containerComentar) return;
        containerComentar.innerHTML = `<h1 style="font-size: 1rem; margin: auto">Loading...</h1>`;
        if (pageNumber) pageNumber.textContent = '..';

        try {
            const response = await comentarService.getComentar();
            const {comentar} = response || {};

            if (!comentar) {
                containerComentar.innerHTML = `<h1 style="font-size: 1rem; margin: auto">Gagal memuat komentar</h1>`;
                return;
            }

            lengthComentar = comentar.length;
            const reversedComentar = [...comentar].reverse();

            if (peopleComentar) {
                peopleComentar.textContent = comentar.length > 0 
                    ? `${comentar.length} Orang telah mengucapkan` 
                    : `Belum ada yang mengucapkan`;
            }

            if (pageNumber) pageNumber.textContent = currentPage.toString();
            renderElement(reversedComentar.slice(startIndex, endIndex), containerComentar, listItemComentar);
        } catch (error) {
            console.log(`Error : ${error.message}`);
            if (containerComentar) {
                containerComentar.innerHTML = `<h1 style="font-size: 1rem; margin: auto">Terjadi kesalahan</h1>`;
            }
        }
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Mencegah reload dan parameter GET di URL
            
            if (buttonForm) buttonForm.textContent = 'Loading...';

            const comentar = {
                id: generateRandomId(),
                name: e.target.name.value,
                status: e.target.status.value === 'y' ? 'Hadir' : 'Tidak Hadir',
                message: e.target.message.value,
                date: getCurrentDateTime(),
                color: generateRandomColor(),
            };

            try {
                // Kirim data ke Google Sheets
                await comentarService.addComentar(comentar);
                
                // Reset halaman ke awal & muat ulang daftar komentar terbaru
                currentPage = 1;
                startIndex = 0;
                endIndex = itemsPerPage;
                await initialComentar();
                
                form.reset();
            } catch (error) {
                console.error(`Error : ${error.message}`);
            } finally {
                if (buttonForm) buttonForm.textContent = 'Kirim';
            }
        });
    }

    const updatePageContent = async () => {
        if (!containerComentar) return;
        containerComentar.innerHTML = '<h1 style="font-size: 1rem; margin: auto">Loading...</h1>';
        if (pageNumber) pageNumber.textContent = '..';
        if (prevButton) prevButton.disabled = true;
        if (nextButton) nextButton.disabled = true;

        try {
            const response = await comentarService.getComentar();
            const {comentar} = response || {};
            if (!comentar) return;

            const reversedComentar = [...comentar].reverse();

            renderElement(reversedComentar.slice(startIndex, endIndex), containerComentar, listItemComentar);
            if (pageNumber) pageNumber.textContent = currentPage.toString();
        } catch (error) {
            console.log(error);
        } finally {
            if (prevButton) prevButton.disabled = false;
            if (nextButton) nextButton.disabled = false;
        }
    };

    if (nextButton) {
        nextButton.addEventListener('click', async () => {
            if (endIndex < lengthComentar) {
                currentPage++;
                startIndex = (currentPage - 1) * itemsPerPage;
                endIndex = startIndex + itemsPerPage;
                await updatePageContent();
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', async () => {
            if (currentPage > 1) {
                currentPage--;
                startIndex = (currentPage - 1) * itemsPerPage;
                endIndex = startIndex + itemsPerPage;
                await updatePageContent();
            }
        });
    }

    initialComentar();
    initialBank();
};
