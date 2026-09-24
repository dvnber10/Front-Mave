import { useMutation, useQuery } from "@tanstack/react-query";
import { GetConversations, GetHistory, SendChat } from "../querys/Chat.query";

export function GetConversationsData(userId) {
    return useQuery({
        queryKey: [`KeyConversations`, userId],
        queryFn: async () => await GetConversations(userId),
        refetchInterval: 4000
    })
}
export function GetHistoryData(userId, otherId) {
    return useQuery({
        queryKey: [`KeyHistory`, userId, otherId],
        queryFn: async () => await GetHistory(userId, otherId),
        refetchInterval: 4000,
        enabled: !!otherId
    })
}
export function sendChat() {
    return useMutation({
        mutationFn: async (data) => await SendChat(data)
    })
}
