import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { dbConnect } from "@/dbconnect/page";
import jwt from "jsonwebtoken";
dbConnect();

export async function POST(request: NextRequest) {
  try {
    const reqbody = await request.json();
    const { email, googleid } = reqbody;
    if (!email || !googleid) {
      return NextResponse.json(
        { message: "Required data is missing" },
        { status: 400 }
      );
    }
    const existinguser = await User.findOne({ email, googleid });
    if (!existinguser) {
      return NextResponse.json(
        { message: "User Need To Register" },
        { status: 400 }
      );
    }
    let payload = {
      userId: existinguser._id,
      userName: existinguser.name,
      userEmail: existinguser.email,
      userImg:existinguser.googleimg
    };
    const accessToken = jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, process.env.TOKEN_SECRET!, {
      expiresIn: "2m",
    });

    const response = NextResponse.json(
      { message: "Loggedin Successfully" },
      { status: 200 }
    );
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 60,
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
      maxAge: 120,
    });

    return response;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
