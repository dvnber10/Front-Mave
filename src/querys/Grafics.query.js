import api from "./api";
import { URL } from "./Auth.query";
import Cookies from "universal-cookie";

const cook = new Cookies()

export let IdUser = cook.get(`id`)

export async function GetDataGraficsIni(id) {
    const result = await api.get(`${URL}/Question/GetInitialGraphic/${id}`)
    return result;
}
export async function GetDataGraficsMood(id) {
    const result = await api.get(`${URL}/Mood/GetMoodGraphic/${id}`)
    return result;
}
export async function GetReport(id) {
    return await api.get(`${URL}/Report/GetInitialReport/${id}`)
}
export async function GetPhq4History(id) {
    return await api.get(`${URL}/Mood/phq4-history/${id}`)
}
export async function GetClinicalReport(id) {
    return await api.get(`${URL}/Report/clinical/${id}`)
}
export async function GetKpis() {
    return await api.get(`${URL}/Report/kpis`)
}
export async function GetActivityLog(take = 50) {
    return await api.get(`${URL}/Report/activity-log?take=${take}`)
}
export async function GetMoodAnalysis(id) {
    return await api.get(`${URL}/Mood/analysis/${id}`)
}
export async function GetActivityTime(id) {
    return await api.get(`${URL}/Report/activity-time/${id}`)
}