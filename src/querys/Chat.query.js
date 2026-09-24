import api from "./api";
import { URL } from "./Auth.query";

export async function GetConversations(userId) {
    return await api.get(`${URL}/Chat/conversations/${userId}`)
}
export async function GetHistory(userId, otherId) {
    return await api.get(`${URL}/Chat/messages/${userId}/${otherId}`)
}
export async function SendChat(data) {
    return await api.post(`${URL}/Chat/send`, {
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text
    })
}
