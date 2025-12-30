import { connectDB } from "@/app/lib/utils";
import userModel from "@/app/models/userSchema";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, password, profile, profileId} = await req.json();
    if (!username || !password)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 400 }
      );
    await connectDB();
    const users = await userModel.findOne({userName:username});
    if (users)
      return NextResponse.json(
        { success: false, message: "Username already exist" },
        { status: 400 }
      );
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!profile) {
      const newUser = new userModel({ userName:username, password:hashedPassword });
      await newUser.save();
      return NextResponse.json({
        success: true,
        message: "Registered successfully",
      });
    } else {
      const newUser = new userModel({ userName:username, password:hashedPassword, profile, profileId });
      await newUser.save();
      return NextResponse.json({
        success: true,
        message: "Registered successfully",
      });
    }
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
