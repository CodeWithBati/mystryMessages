import bcryptjs from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { sendVerificationEmails } from "@/helpers/sendVerificationEmails";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();

    const usernameExist = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (usernameExist) {
      return Response.json(
        {
          success: false,
          message: "Username is already taken",
        },
        { status: 400 }
      );
    }

    const emailExist = await UserModel.findOne({ email });
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (emailExist) {
      if (emailExist.isVerified) {
        return Response.json(
          {
            success: false,
            message: "This email already exist",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcryptjs.hash(password, 10);
        emailExist.password = hashedPassword;
        emailExist.verifyCode = verifyCode;
        emailExist.verifyCodeExpiry = new Date(Date.now() + 3600000);

        await emailExist.save();
      }
    } else {
      const hashedPassword = await bcryptjs.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    // send Verification Email
    const emailSend = await sendVerificationEmails(email, username, verifyCode);

    if (!emailSend.success) {
      return Response.json(
        {
          success: false,
          message: emailSend.message,
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering User ", error);
    return Response.json(
      {
        success: false,
        message: "Error registering User",
      },
      {
        status: 500,
      }
    );
  }
}
