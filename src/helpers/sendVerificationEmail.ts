import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string): Promise<ApiResponse> {
    try {
        const response = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification code',
            react: VerificationEmail({username,otp: verifyCode}),
        });

        console.log(response)
        if(response.error){
            return {
                success: false,
                message: "Resend email verification failed"
            }
        }
        return {
            success: true,
            message: "Successfully sent verification code to your email, kindly verify yourself!"
        }
    } catch (error) {
        console.log("Error in sending verification email", error)
        return {
            success: false,
            message: "Resend email verification failed"
        }
    }
}