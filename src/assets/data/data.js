export const data = {
    bride: {
        L: {
            id: 1,
            name: 'Aditya Putera Prakosa',
            child: 'Putra Pertama',
            father: 'Ahdiat U.P.',
            mother: 'Ratna T.W.',
            image: './src/assets/images/cowo.png'
        },
        P: {
            id: 2,
            name: 'Diva Farenta Setia W.',
            child: 'Putri Pertama',
            father: 'Agus',
            mother: 'Gesti',
            image: './src/assets/images/cewe.png'
        },
        couple: './src/assets/images/couple.png'
    },
    time: {
        marriage: {
            year: '2027',
            month: 'Mei',
            date: '30',
            day: 'Minggu',
            hours: {
                start: '08.00',
                finish: 'Selesai'
            },
            address: 'Grobogan, Purwodadi', // <-- Alamat Khusus Akad & Resepsi
            map: 'https://maps.app.goo.gl/rKz1hYi5S4eSR8zN9?g_st=ic' // <-- Link Google Maps Akad
        },
        reception: {
            year: '2027',
            month: 'Juni',
            date: '06',
            day: 'Minggu',
            hours: {
                start: '11.00',
                finish: 'Selesai'
            },
            address: 'Bantul, Yogyakarta', // <-- Alamat Khusus Tasyakuran
            map: 'https://maps.app.goo.gl/j26VbCMfVoD6oGV2A?g_st=ic' // <-- Link Google Maps Tasyakuran
        }
    },
    link: {
        calendar: 'https://calendar.app.google/3MUoiXyQHaUS3zq58'
    },
    galeri: [
        { id: 1, image: './src/assets/images/1.png' },
        { id: 2, image: './src/assets/images/2.png' },
        { id: 3, image: './src/assets/images/3.png' },
        { id: 4, image: './src/assets/images/4.png' },
        { id: 5, image: './src/assets/images/5.png' }
    ],
    bank: [
        {
            id: 1,
            name: 'Aditya Putera Prakosa',
            icon: './src/assets/images/seabank.png',
            rekening: '00000000'
        },
        {
            id: 2,
            name: 'Diva Farenta Setia Wardani ',
            icon: './src/assets/images/spay.png',
            rekening: '1111111111'
        }
    ],
    audio: './src/assets/audio/wedding.mp3',
    api: 'https://script.google.com/macros/s/AKfycbyt5L4dWtets2Dwn8ywUjuHNijTa_tuMosdwVRIspTiBQxTYNmuTsJXJW3rPaCmcYD1FA/exec',
    navbar: [
        { id: 1, teks: 'Home', icon: 'bx bxs-home-heart', path: '#home' },
        { id: 2, teks: 'Mempelai', icon: 'bx bxs-group', path: '#bride' },
        { id: 3, teks: 'Tanggal', icon: 'bx bxs-calendar-check', path: '#time' },
        { id: 4, teks: 'Galeri', icon: 'bx bxs-photo-album', path: '#galeri' },
        { id: 5, teks: 'Ucapan', icon: 'bx bxs-message-rounded-dots', path: '#wishas' }
    ]
};
