import { connectDB } from "@/app/lib/utils";
import gameModel from "@/app/models/gamesSchema";
import { NextResponse } from "next/server";



export async function POST(req:Request){
    try {
        const { id, status } = await req.json();
        if(!id) return NextResponse.json({success: false, message: "Invalid params"}, {status: 400});
        await connectDB();
        const game = await gameModel.findByIdAndUpdate(id,
            {status: status},
            {new: true}
        );
        return NextResponse.json({success: true, message: `Status changed into ${status}`});
    } catch (error) {
        const err = error instanceof Error ? error.message : "Server Error";
        return NextResponse.json({success: false, message: err}, {status: 500})
    }
}