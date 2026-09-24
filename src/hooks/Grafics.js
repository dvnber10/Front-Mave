import {  useQuery } from '@tanstack/react-query'
import { GetDataGraficsIni , GetDataGraficsMood, GetReport, GetActivityTime, GetPhq4History, GetClinicalReport, GetMoodAnalysis, GetKpis, GetActivityLog} from '../querys/Grafics.query'

export function GetGraficsIni(id) {
    return useQuery({
        queryKey: ['graficsIni'],
        queryFn: async()=> await GetDataGraficsIni(id)
    })
}
export function GetGraficsMood(id) {
    return useQuery({
        queryKey: ['graficsMood'],
        queryFn: async ()=> await GetDataGraficsMood(id),
    })
}
export function GetReportInitial(id) {
    return useQuery({
        queryKey:['Report', id],
        queryFn: async ()=> await GetReport(id)
    })
}
export function GetPhq4HistoryData(id) {
    return useQuery({
        queryKey:['Phq4History', id],
        queryFn: async ()=> await GetPhq4History(id)
    })
}
export function GetClinicalReportData(id) {
    return useQuery({
        queryKey:['ClinicalReport', id],
        queryFn: async ()=> await GetClinicalReport(id)
    })
}
export function GetKpisData() {
    return useQuery({
        queryKey:['Kpis'],
        queryFn: async ()=> await GetKpis()
    })
}
export function GetActivityLogData(take = 50) {
    return useQuery({
        queryKey:['ActivityLog', take],
        queryFn: async ()=> await GetActivityLog(take)
    })
}
export function GetMoodAnalysisData(id) {
    return useQuery({
        queryKey:['MoodAnalysis', id],
        queryFn: async ()=> await GetMoodAnalysis(id)
    })
}
export function GetActivityTimeData(id) {
    return useQuery({
        queryKey:['ActivityTime', id],
        queryFn: async ()=> await GetActivityTime(id)
    })
}