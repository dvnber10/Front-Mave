import {  useQuery } from '@tanstack/react-query'
import { GetNotify, SendMensage, GetDailySuggestion } from '../querys/Notify.query'

export function GetNotifyAdd(id) {
    return useQuery({
        queryKey:["getNotify"],
        queryFn: async() => GetNotify(id)
    })
}
export function setMenssage() {
    return useQuery({
        queryKey: ["sendMenssage"],
        queryFn: async()=> SendMensage()
    })
}
export function GetDailySuggestionData(id) {
    return useQuery({
        queryKey: ["dailySuggestion", id],
        queryFn: async()=> await GetDailySuggestion(id)
    })
}