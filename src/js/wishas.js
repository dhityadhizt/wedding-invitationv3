export const wishas = () => {
    const wishasContainer = document.querySelector('.wishas');
    const form = wishasContainer.querySelector('form'); // Seleksi form secara langsung
    const peopleComentar = wishasContainer.querySelector('.wishas > div:nth-child(4) p') || wishasContainer.querySelectorAll('.wishas > div')[2]?.querySelector('p'); // Menyesuaikan container teks info
    
    // Perbaikan aman untuk mengambil container komentar & pagination
    const containerComentar = wishasContainer.querySelector('ul[aria-label="list comentar"]');
    const buttonForm = form.querySelector('button[type="submit"]');
    const pageNumber = wishasContainer.querySelector('.page-number');
    const prevButton = wishasContainer.querySelectorAll('.button-grup button')[0];
    const nextButton = wishasContainer.querySelectorAll('.button-grup button')[1];

    let lengthComentar = 0;
    let currentPage = 1;
    const itemsPerPage = 4;

    const listItemBank = (data) => (
        ` <figure data-aos="zoom-in" data-aos-duration="1000">
                <img src=${data.icon} alt="bank icon animation">
                <figcaption>No. Rekening ${data.rekening.slice(0, 4)}xxxx <br>A.n ${data.name}</figcaption>
                <button data-rekening=${data.rekening} aria-label="copy rekening">Salin No. Rekening</button>
           </figure>`
    );

    const initialBank = () => {
        const wishasBank = wishasContainer.children[1];
        if (!wishasBank) return;
        const containerBank = wishasBank.querySelector('div:nth-child(3)') || wishasBank.lastElementChild;

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

    const updatePageContent = async () => {
        if (!containerComentar) return;
        containerComentar.innerHTML = '<h1 style="font-size: 1rem; margin: auto">Loading...</h1>';
        if (pageNumber) pageNumber.textContent = '..';
        if (prevButton) prevButton.disabled = true;
        if (nextButton) nextButton.disabled = true;

        try {
            const response = await comentarService.getComentar();
            if (response.error) throw new Error(response.error);

            const {comentar} = response;
            lengthComentar = comentar.length;

            const reversedComentar = [...comentar].reverse();
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;

            renderElement(reversedComentar.slice(startIndex, endIndex), containerComentar, listItemComentar);
            if (pageNumber) pageNumber.textContent = currentPage.toString();

            if (prevButton) prevButton.disabled = currentPage === 1;
            if (nextButton) nextButton.disabled = endIndex >= lengthComentar;
        } catch (error) {
            console.log(error);
            containerComentar.innerHTML = '<h1 style="font-size: 1rem; margin: auto; color: red;">Gagal memuat komentar</h1>';
        } finally {
            if (prevButton && currentPage > 1) prevButton.disabled = false;
            const maxPage = Math.ceil(lengthComentar / itemsPerPage);
            if (nextButton && currentPage < maxPage) nextButton.disabled = false;
        }
    };

    const initialComentar = async () => {
        if (containerComentar) containerComentar.innerHTML = `<h1 style="font-size: 1rem; margin: auto">Loading...</h1>`;
        
        try {
            const response = await comentarService.getComentar();
            if (response.error) throw new Error(response.error);

            const {comentar} = response;
            lengthComentar = comentar.length;

            if (peopleComentar) {
                if (lengthComentar > 0) {
                    peopleComentar.textContent = `${lengthComentar} Orang telah mengucapkan`;
                } else {
                    peopleComentar.textContent = `Belum ada yang mengucapkan`;
                }
            }

            currentPage = 1;
            await updatePageContent();
        } catch (error) {
            console.error(error);
            if (peopleComentar) peopleComentar.textContent = `Gagal memuat data`;
            if (containerComentar) containerComentar.innerHTML = '';
        }
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // <-- PENTING: Mencegah reload halaman dan parameter nempel di URL
            
            if (buttonForm) {
                buttonForm.textContent = 'Loading...';
                buttonForm.disabled = true;
            }

            const comentar = {
                id: generateRandomId(),
                name: form.name.value,
                status: form.status.value === 'y' ? 'Hadir' : 'Tidak Hadir',
                message: form.message.value,
                date: getCurrentDateTime(),
                color: generateRandomColor(),
            };

            try {
                const response = await comentarService.addComentar(comentar);
                if (response && response.error) throw new Error(response.error);

                form.reset();
                currentPage = 1;
                await initialComentar(); // Refresh list komentar secara asynchronous
            } catch (error) {
                alert(`Error : ${error.message}`);
            } finally {
                if (buttonForm) {
                    buttonForm.textContent = 'Kirim';
                    buttonForm.disabled = false;
                }
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', async () => {
            const maxPage = Math.ceil(lengthComentar / itemsPerPage);
            if (currentPage < maxPage) {
                currentPage++;
                await updatePageContent();
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', async () => {
            if (currentPage > 1) {
                currentPage--;
                await updatePageContent();
            }
        });
    }

    initialComentar();
    initialBank();
};
