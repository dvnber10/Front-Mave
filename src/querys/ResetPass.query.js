import api from "./api"
import { URL } from "./Auth.query"


// reset password desde mail
export async function ResetPass(data) {
    return await api.post(`${URL}/User/PasswordRecovery`, {
        data: data.email
    })
}

//Recibe la nueva contreseña y la cambia
export async function CambioPass(data) {
    return await api.put(`${URL}/User/PasswordReset/${data.id}`,
        {
            data: data.data.pass
        },
        {
            headers: {
                Authorization: `Bearer ${data.token}`
            }

        })
}