import { connectDB } from "@/app/lib/utils";
import gameModel from "@/app/models/gamesSchema";
import { NextRequest, NextResponse } from "next/server";
import "@/app/models/userSchema";



export async function GET(req:NextRequest){
    try {
        await connectDB();
        const games = await gameModel.find({}).sort({createdAt: -1}).populate("uploader", "userName profile");
        return NextResponse.json({success: true, games});
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json({success: false, message: err}, {status: 500});
    }
}