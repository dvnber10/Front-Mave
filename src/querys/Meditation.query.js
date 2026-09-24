import api from "./api";

export const URL = import.meta.env.VITE_URL

// Sonido aleatorio de Freesound vía backend MAVE (pista variada + libre de derechos)
export async function RandomSound() {
    return await api.get(`${URL}/meditation/random-sound`)
}

// Lista N pistas distintas para que el usuario escoja
export async function SoundsList(count = 10) {
    return await api.get(`${URL}/meditation/sounds?count=${count}`)
}

// Registra segundos de escucha (para reportes de actividad)
export async function LogTime(data) {
    return await api.post(`${URL}/meditation/log-time`, {
        userId: data.userId,
        soundId: data.soundId,
        seconds: data.seconds
    })
}
