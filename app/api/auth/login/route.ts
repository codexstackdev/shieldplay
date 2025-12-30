import { connectDB } from "@/app/lib/utils";
import userModel from "@/app/models/userSchema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    if (!username || !password)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 500 }
      );
    await connectDB();
    const user = await userModel.findOne({ userName: username });
    if (!user)
      return NextResponse.json(
        { success: false, message: "User doesn't exist" },
        { status: 400 }
      );
    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword)
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully",
    });
    const token = jwt.sign({ user: user._id }, process.env.SECRET_KEY, { expiresIn: "2D"});
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24,
    });
    return response;
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
