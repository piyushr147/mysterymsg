import { IMessage } from "@/model/message.model"

export interface ApiResponse{
    success: boolean,
    message: string,
    isAcceptingMessages?: boolean,
    messages?: Array<IMessage>
}