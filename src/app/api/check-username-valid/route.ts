import z from "zod";
import UserModel from "@/model/user.model";
import { usernameValidation } from "@/schemas/signUpSchema";
import dbConnect from "@/lib/dbConnect";

const UsernameSchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      username: searchParams.get("username"),
    };
    const result = UsernameSchema.safeParse(queryParams);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors[0];

      return Response.json(
        {
          success: false,
          message: usernameErrors,
        },
        { status: 200 }
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    console.log(username,existingVerifiedUser)
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username is already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is valid",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("check-username-valid: ",error);
    return Response.json(
      {
        success: false,
        message: "username validation failed",
      },
      { status: 500 }
    );
  }
}
