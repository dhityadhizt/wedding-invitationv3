import { comentarService } from "./comentarService.js";

export function wishas() {
    const form = document.querySelector(".wishas form");
    
    // Jika form tidak ditemukan di HTML, hentikan fungsi agar tidak error
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        // --- 1. WAJIB: Cegah halaman reload/refresh bawaan browser ---
        e.preventDefault();

        const nameInput = document.getElementById("name");
        const statusInput = document.getElementById("status");
        const messageInput = document.getElementById("message");
        const submitBtn = form.querySelector("button[type='submit']");

        // Validasi input kosong
        if (!nameInput.value || !statusInput.value || !messageInput.value) {
            alert("Mohon lengkapi semua kolom ucapan dan kehadiran!");
            return;
        }

        const payload = {
            id: 'id_' + Date.now(),
            name: nameInput.value,
            status: statusInput.value,
            message: messageInput.value,
            date: new Date().toLocaleDateString('id-ID', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            }),
            color: '#333333'
        };

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Mengirim...";

            // Kirim data ke Google Apps Script
            await comentarService.addComentar(payload);

            alert("Terima kasih! Ucapan & kehadiran berhasil dikirim.");
            form.reset();

            // Kembalikan nama tamu ke form jika ada parameter URL ?to=...
            const urlParams = new URLSearchParams(window.location.search);
            const recipientName = urlParams.get('to');
            if (recipientName && nameInput) {
                nameInput.value = recipientName;
            }

        } catch (error) {
            console.error("Gagal mengirim:", error);
            alert("Gagal mengirim data. Periksa koneksi atau URL Apps Script Anda.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = "Kirim";
        }
    });
}
