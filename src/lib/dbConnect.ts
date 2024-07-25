import mongoose from "mongoose";
import { exit } from "process";

type connectionObj = {
    isConnected?: number,
}

const connection: connectionObj = {}

export default async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }
    else{
        try {
            const db = await mongoose.connect(process.env.MONGODB_URI || '', {})
            connection.isConnected = db.connections[0].readyState
        } catch (error) {
            console.log("Error in connecting to database: ",error)
            process.exit(1)
        }
    }
}