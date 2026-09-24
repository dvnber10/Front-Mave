import api from "./api";

export const URL = import.meta.env.VITE_URL

// Registra segundos de una actividad del catálogo (para reportes)
export async function LogActivity(data) {
    return await api.post(`${URL}/activities/log`, {
        userId: data.userId,
        action: data.action,
        seconds: data.seconds
    })
}
