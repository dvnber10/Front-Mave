import api from "./api";
import Cookies from "universal-cookie";
import { URL } from "./Auth.query";

const cook = new Cookies()

let idUser = cook.get(`id`)
export let role
export let username
export async function GetUserInfo(id) {
    const result = await api.get(`${URL}/User/GetUserInfo/${id}`)
    role = result.data.RoleId
    username = result.data.UserName
    return result;
}
export async function GetAllUsers(id) {
    return await api.get(`${URL}/User/GetAllUsers/${id}`)
}
export async function GetPsychologists() {
    return await api.get(`${URL}/User/GetPsychologists`)
}
export async function GetMyPatients(psychologistId) {
    return await api.get(`${URL}/User/MyPatients/${psychologistId}`)
}
export async function SetPsychologist(patientId, psychologistId) {
    return await api.put(`${URL}/User/SetPsychologist/${patientId}`, {
        psychologistId
    })
}
export async function GetPsyProfile(userId) {
    return await api.get(`${URL}/Psychologist/profile/${userId}`)
}
export async function SavePsyDescription(userId, description) {
    return await api.put(`${URL}/Psychologist/profile/${userId}`, {
        description
    })
}
export async function UploadCredential(userId, file) {
    const fd = new FormData();
    fd.append("file", file);
    return await api.post(`${URL}/Psychologist/credential/${userId}`, fd)
}
export async function VerifyPsy(userId, verified) {
    return await api.put(`${URL}/Psychologist/verify/${userId}`, {
        verified
    })
}
export async function ActUser(data) {
    return await api.put(`${URL}/User/UpdateUser/${data.Id}`, {
        idRole: data.rol
    })

}
export async function BlockUser(data) {
    return await api.put(`${URL}/User/BlockUser/${data.userId}`, {
        blocked: data.blocked
    })
}
export async function GetPendingPsy() {
    return await api.get(`${URL}/User/PendingPsychologists`)
}
export async function UpdateProfile(data) {
    return await api.put(`${URL}/User/UpdateProfile/${data.userId}`, {
        userName: data.name,
        email: data.email,
        phone: data.phone
    })
}
export async function ChangePassword(data) {
    return await api.put(`${URL}/User/ChangePassword/${data.userId}`, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
    })
}