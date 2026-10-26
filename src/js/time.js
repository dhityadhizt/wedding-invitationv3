import { data } from "../assets/data/data.js";

export const time = () => {
    const timeContainer = document.querySelector('.time');
    if (!timeContainer) return;

    const [marriageDiv, receptionDiv] = timeContainer.querySelectorAll('div div');

    // Sembunyikan/hapus tombol "Lihat google maps" lama dan paragraf alamat di bawahnya
    const oldMapLink = timeContainer.querySelector('a[role="link"]');
    const oldAddressParagraph = timeContainer.querySelector('a[role="link"] + p');
    
    if (oldMapLink) oldMapLink.style.display = 'none';
    if (oldAddressParagraph) oldAddressParagraph.style.display = 'none';

    // Helper function untuk merender kartu acara lengkap dengan Alamat & Maps
    const createTimeListItem = (title, details) => {
        if (!details) return '';
        
        return `
            <h3>${title}</h3>
            <p>${details.day}, ${details.date} ${details.month} ${details.year} <br> 
            Pukul ${details.hours.start} WIB sd ${details.hours.finish}</p>
            <p style="margin-top: 0.6rem; font-size: 0.95rem; line-height: 1.4; color: #4a5568;">${details.address || ''}</p>
            ${details.map ? `
                <a href="${details.map}" target="_blank" rel="noopener noreferrer" style="
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    margin-top: 0.8rem;
                    padding: 0.45rem 1.1rem;
                    background-color: #ffffff;
                    color: #2d3748;
                    border: 1px solid #cbd5e0;
                    border-radius: 20px;
                    text-decoration: none;
                    font-size: 0.85rem;
                    font-weight: 500;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    transition: all 0.3s ease;
                    width: fit-content;
                ">
                    <i class="bx bxs-map-alt" style="font-size: 1.1rem; color: #e53e3e;"></i>
                    <span>Petunjuk Lokasi</span>
                </a>
            ` : ''}
        `;
    };

    if (marriageDiv) {
        marriageDiv.innerHTML = createTimeListItem('Akad & Resepsi', data.time?.marriage);
    }
    
    if (receptionDiv) {
        receptionDiv.innerHTML = createTimeListItem('Tasyakuran', data.time?.reception);
    }
};
