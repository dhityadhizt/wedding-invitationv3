import {data} from "../assets/data/data.js";

export const comentarService = {
    getComentar: async function () {
        try {
            const response = await fetch(data.api);
            return await response.json();
        } catch (error) {
            return {error: error && error.message};
        }
    },

    addComentar: async function ({id, name, status, message, date, color}) {
        const comentar = {
            id: id,
            name: name,
            status: status,
            message: message,
            date: date,
            color: color,
        };

        try {
            // Hapus mode: 'no-cors' agar response JSON dari Apps Script bisa terbaca,
            // dan gunakan header text/plain untuk melewati preflight CORS Google.
            const response = await fetch(data.api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(comentar),
            });

            return await response.json();
        } catch (error) {
            console.error('Post error:', error);
            return {error: error.message};
        }
    },
};
