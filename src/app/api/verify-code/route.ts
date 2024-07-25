import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const userExists = await UserModel.findOne({ username, verifyCode: code });

    if (!userExists) {
        return Response.json(
            {
              success: false,
              message: "User does not exists with this username",
            },
            { status: 500 }
          );
    }
    else{
        if(userExists.verifyCode !== code){
            return Response.json(
                {
                  success: false,
                  message: "User's verification code didn't match, kindly enter the latest code sent to you on email!",
                },
                { status: 500 }
              );
        }
        else if(userExists.verifyCode === code){
            const currentTime = new Date()
            const verificationCodeExpiryTime = new Date(userExists.verifyCodeExpiry)

            if(currentTime > verificationCodeExpiryTime){
                return Response.json(
                    {
                      success: false,
                      message: "User's verification code has been expired, kindly sign-up and retry again!",
                    },
                    { status: 500 }
                  );
            }
        }
        else{
            return Response.json(
                {
                  success: true,
                  message: "Congratulations!!, you are a verified user now",
                },
                { status: 200 }
              );
        }
    }
  } catch (error) {
    console.log("verify-code: ",error);
    return Response.json(
      {
        success: false,
        message: "Code verification failed",
      },
      { status: 500 }
    );
  }
}
