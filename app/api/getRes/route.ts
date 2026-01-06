import { connectDB } from "@/app/lib/utils";
import userModel from "@/app/models/userSchema";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import gameModel from "@/app/models/gamesSchema";




export async function GET(req:NextRequest){
    try {
        const token = req.cookies.get("token")?.value;
        if(!token) return NextResponse.json({success: false, message: "unauthorized"}, {status: 401});
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token, secret);
        if(payload.role !== "admin") return NextResponse.json({success: false, message: "unauthorized"}, {status: 401});
        await connectDB();
        const user = await userModel.find({}).sort({createdAt: -1}).select("-password").select("-profileid");
        const game = await gameModel.find({}).sort({createdAt: -1}).populate("uploader", "userName profile");
        return NextResponse.json({success: true, games:game, users:user});
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json({success: false, message: err}, {status: 500});
    }
}