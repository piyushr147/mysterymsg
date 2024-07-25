import {z} from "zod"

// this is to identify user in database 
export const signInSchema = z.object({
  // this identifier can be username , email 
  identifier : z.string(),
  password : z.string()
})