// sever side verify tokens  for all the api request


import { NextRequest, NextResponse } from "next/server";
import Jwt, { JwtPayload } from "jsonwebtoken";

interface MyJwtPayload extends JwtPayload {
  userName:string;
  userId:string;
  userEmail:string;
}

export function withAuth(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const accessToken = request.cookies.get("accessToken")?.value ;
    const refreshToken = request.cookies.get("refreshToken")?.value ;

    try {
      if (accessToken) {
        const decoded = await Jwt.verify(
          accessToken,
          process.env.TOKEN_SECRET!
        );
        console.log(decoded, "decoded");

        return await handler(request);
        // return NextResponse.json({message:"Unauthorize no token"},{status:401})
      }

      if (refreshToken) {
        const decoded = await Jwt.verify(
          refreshToken,
          process.env.TOKEN_SECRET!
        ) as MyJwtPayload;
        console.log(decoded, "decoded");
   
        if (decoded) {
          const { userName, userId, userEmail } = decoded;
          let body = {
            userName,
            userId,
            userEmail,
          };
          const newAccessToken = await Jwt.sign(
            body,
            process.env.TOKEN_SECRET!,
            { expiresIn: "1m" }
          );
          const response = await handler(request);
          response.cookies.set("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/",
            maxAge: 60,
          });
          return response;
        }
      }
      return NextResponse.json(
        { message: "UnAuthorized user" },
        { status: 401 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "UnAuthorized user" },
        { status: 401 }
      );
    }
  };
}
