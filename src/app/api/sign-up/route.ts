import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcrypt"


export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, email, password } = await request.json();
    const userExistsAndVerified = await UserModel.findOne({ username, isVerified: true,});

    if (userExistsAndVerified) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    // user already exist with this email
    if (existingUserByEmail) {
      if(existingUserByEmail.isVerified){
        return Response.json(
          {
            success: false,
            message: "User already exist with this email",
          },
          { status: 400}
        );
      }else{
        // saving user with new password and verifycode 
        const hasedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hasedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
        await existingUserByEmail.save()
      }
    } 
    // if email se bhi user exit nahi kar raha toh user is new
    else {
      const hasedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username: username,
        email: email,
        password: hasedPassword,
        verifyCode: verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
      // saving new document in database
    }
    // send verification email
    const emailResponse = await sendVerificationEmail( email, username, verifyCode);
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully, kindly verify the code sent to your mail",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("sign-up: ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}