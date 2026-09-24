import { useMutation, useQuery } from "@tanstack/react-query";
import { ActUser, GetAllUsers, GetUserInfo, GetPsychologists, GetMyPatients, SetPsychologist, UpdateProfile, ChangePassword, GetPsyProfile, SavePsyDescription, UploadCredential, VerifyPsy, BlockUser, GetPendingPsy } from "../querys/User.query";

export function GetUser(id) {
    return useQuery({
        queryKey: [`keyUsers`, id],
        queryFn: async() => await GetUserInfo(id)
    })
}
export function GetAllUsersFromAdmin(id) {
    return useQuery({
        queryKey: [`KeyUsersAll`],
        queryFn: async () => await GetAllUsers(id)
    })
}
export function GetPsychologistsList() {
    return useQuery({
        queryKey: [`KeyPsychologists`],
        queryFn: async () => await GetPsychologists()
    })
}
export function GetMyPatientsData(psychologistId) {
    return useQuery({
        queryKey: [`KeyMyPatients`, psychologistId],
        queryFn: async () => await GetMyPatients(psychologistId)
    })
}
export function setPsychologist() {
    return useMutation({
        mutationFn: async (data) => await SetPsychologist(data.patientId, data.psychologistId)
    })
}
export function updateUser() {
    return useMutation({
        mutationFn: async (data) => await ActUser(data)
    })
}
export function blockUser() {
    return useMutation({
        mutationFn: async (data) => await BlockUser(data)
    })
}
export function GetPendingPsyData() {
    return useQuery({
        queryKey: [`KeyPendingPsy`],
        queryFn: async () => await GetPendingPsy()
    })
}
export function updateProfile() {
    return useMutation({
        mutationFn: async (data) => await UpdateProfile(data)
    })
}
export function changePassword() {
    return useMutation({
        mutationFn: async (data) => await ChangePassword(data)
    })
}
export function GetPsyProfileData(userId) {
    return useQuery({
        queryKey: [`KeyPsyProfile`, userId],
        queryFn: async () => await GetPsyProfile(userId)
    })
}
export function savePsyDescription() {
    return useMutation({
        mutationFn: async (data) => await SavePsyDescription(data.userId, data.description)
    })
}
export function uploadCredential() {
    return useMutation({
        mutationFn: async (data) => await UploadCredential(data.userId, data.file)
    })
}
export function verifyPsy() {
    return useMutation({
        mutationFn: async (data) => await VerifyPsy(data.userId, data.verified)
    })
}