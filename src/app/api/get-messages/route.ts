import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";
import { IMessage } from "@/model/message.model";

export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "User's session is null, probably because user is not authenticated or logged out!"
        },
        {
            status: 400
        })
    }

    try {
        const userData: User = session.user
        const userId = new mongoose.Types.ObjectId(userData._id)

        const user = await UserModel.aggregate([
            {   $match: { _id: userId} },
            {   $unwind: "$messages"   },
            {   $sort: { "messages.createdAt": -1}    },
            {   $group: { _id: "$_id", messages: {$push: '$messages'}}  }
        ])

        console.log("data of user from get-message aggreation pipeline",user)
        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "User not found!"
            },
            {
                status: 500
            })
        }
        else{
            return Response.json({
                success: true,
                message: "Successfully fetched user's messages",
                messages: user[0].messages
            },
            {
                status: 200
            })
        }
    } catch (error) {
        console.log("get-messages: ",error)
        return Response.json({
            success: false,
            message: "Unable to fetch user's messages!"
        },
        {
            status: 500
        })
    }
}