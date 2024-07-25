import dbConnect from "@/lib/dbConnect";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/user.model";

export async function POST(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "User's session is null, probably because user is not authenticated or logged out!"
        },
        {
            status: 401
        })
    }
    else{
        try {
            const isAcceptingMessages = await request.json()
            const userData: User = session.user
            const user = await UserModel.findByIdAndUpdate({_id: userData._id},
                                                            {isAcceptingMessages},
                                                            {new: true})
            if(!user){
                return Response.json({
                    success: false,
                    message: "Error in getting user details, user might not exist"
                },
                {
                    status: 400
                })
            }
            else{
                return Response.json({
                    success: true,
                    message: "Successfully changed user's message accepting status!"
                },
                {
                    status: 200
                })
            }
        } catch (error) {
            console.log("accept-messsage: ",error)
            return Response.json({
                success: false,
                message: "Error in changing user's accepting status!"
            },
            {
                status: 500
            })
        }
    }
}

export async function GET(request: Request){
    await dbConnect()
    const session = await getServerSession(authOptions)

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "User's session is null, probably because user is not authenticated or logged out!"
        },
        {
            status: 401
        })
    }

    try {
        const userData: User = session.user
        const user = await UserModel.findById({_id: userData._id})

        if(!user){
            return Response.json({
                success: false,
                message: "User not found!"
            },
            {
                status: 401
            })
        }
        else{
            return Response.json({
                success: true,
                message: "User accepting messaaes status fetched successfully!",
                isAcceptingMessages: user.isAcceptingMessages
            },
            {
                status: 200
            }) 
        }
    } catch (error) {
        console.log("accept-messsage: ",error)
        return Response.json({
            success: false,
            message: "Error in getting user Accepting messages status"
        },
        {
            status: 500
        })
    }
}
