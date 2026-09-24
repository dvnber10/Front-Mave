import api from "./api";

export const URL = import.meta.env.VITE_URL

// Inicio de session 
export async function InicioUser(data) {
    return await api.post(`${URL}/User/LogIn`, {
        email: data.mail,
        pass: data.password
    })
}


// crea un nuevo usuario
export async function NuevoUser(data) {
    return await api.post(`${URL}/User/SigIn`, {
        userName: data.name,
        email: data.email,
        phone: data.telefono,
        password: data.pass
    })
}