import api from "./api";
import { URL } from "./Auth.query";
import Cookies from "universal-cookie";

const cook = new Cookies()

export let IdUser = cook.get(`id`)

export async function GetInitialQuestions(id) {
    return await api.get(`${URL}/Question/GetInitialEvaluation/${id}`)
}

export async function SetInitialQuestions(data){
    console.log(data)
    return await api.post(`${URL}/Question/SetInitialEvaluation/${IdUser}`,
    {
        option: data
    })
}
export async function SetHabitQuestions(data) {
    return await api.post(`${URL}/Question/SetHabitScore/${IdUser}`,
        {
            score: data
        }
    )
}
export async function SetHabbitScore(data) {
    
    return await api.post(`${URL}/Mood/SetMood/${IdUser}`,
    {
        score: data
    }
    )    
}
export async function GetHabbitQuestions(id) {
    return await api.get(`${URL}/Question/GetHabitQuestions/${id}`)
}