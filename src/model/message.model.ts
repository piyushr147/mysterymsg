import mongoose,{Schema,Document} from "mongoose";

export interface IMessage extends Document{
    content: string,
    createdAt: Date,
}

const MessageSchema:Schema<IMessage> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    }
})

const MessageModel = mongoose.models.Message || mongoose.model<IMessage>("Message",MessageSchema)
export { MessageModel }