import { connectDB } from "@/app/lib/utils";
import userModel from "@/app/models/userSchema";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try {
        const { id } = await req.json();
        if(!id) return NextResponse.json({success: false, message: "Invalid params"}, {status: 400});
        await connectDB();
        const user = await userModel.findById(id).select("-password").select("-profileId");
        return NextResponse.json({success: true, user});
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json({success: false, message: err}, {status: 500});
    }
}