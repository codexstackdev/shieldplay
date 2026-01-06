import { connectDB } from "@/app/lib/utils";
import gameModel from "@/app/models/gamesSchema";
import { NextResponse } from "next/server";



export async function POST(req: Request){
    const { id, status } = await req.json();
    try {
        if(!id || !status) return NextResponse.json({success: false, message: "Invalid params"}, {status: 400});
        await connectDB();
        const games = await gameModel.findByIdAndUpdate(id, 
            {status: status},
            {new: true}
        );
        return NextResponse.json({success: true, message: "Status changed successfully"});
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json({success: false, message: err}, {status: 500});
    }
}