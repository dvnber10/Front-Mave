import api from "./api";
import Cookies from "universal-cookie";
import { URL } from "./Auth.query";

const cook = new Cookies()
export let IdUser = cook.get(`id`)

export async function GetNotify(id) {
    return await api.post(`${URL}/Question/PositiveReinforcement/${id}`)
}
export async function SendMensage() {
    return await api.post(`${URL}/Notify/SendMesssages`)
}
export async function GetDailySuggestion(id) {
    return await api.get(`${URL}/Notify/daily-suggestion/${id}`)
}