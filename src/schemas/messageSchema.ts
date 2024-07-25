import {z} from "zod"

export const messageSchema = z.object({
	content: z.string()
            .min(10,{message: "Content must be of atleast 10 characters long"})
            .max(300,{message: "Content can't be more than 300 characters long"})
})