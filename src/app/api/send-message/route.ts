import dbConnect from "@/lib/dbConnect";
import { IMessage } from "@/model/message.model";
import UserModel, { IUser } from "@/model/user.model";

export async function POST(request: Request){
    await dbConnect()
    const {username,content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        
        if(!user){
            return Response.json({
                success: false,
                message: "No user exists with this username!"
            },
            {
                status: 400
            })
        }
        else{
            const myMessage = {content, createdAt: new Date()}
            user.messages.push(myMessage as IMessage)
            const updatedUser = await user.save()

            if(!updatedUser){
                return Response.json({
                    success: false,
                    message: "Unable to send the message to destination"
                },
                {
                    status: 400
                })
            }
            else{
                return Response.json({
                    success: true,
                    message: "Successfully delivered the message to the destination!"
                },
                {
                    status: 200
                })
            }
        }
    } catch (error) {
        console.log("send-messages: ",error)
        return Response.json({
            success: false,
            message: "Unable to send message to the destination!"
        },
        {
            status: 500
        })
    }
} 