import { connectDB } from "@/app/lib/utils";
import userModel from "@/app/models/userSchema";
import { NextResponse } from "next/server";



export async function POST(req:Request){
    const { id, role } = await req.json();
    try {
        if(!id || !role) return NextResponse.json({success: false, message: "Invalid params"}, {status: 400});
        if(id === "695282db7390e96c6251430b") return NextResponse.json({success: false, message: "You can't change the role of the developer"}, {status: 401});
        await connectDB();
        const user = await userModel.findByIdAndUpdate(id, 
            {role: role},
            {new: true}
        );
        return NextResponse.json({success: true, message: "Role changed successfully"})
    } catch (error) {
        const err = error instanceof Error ? error.message : 'Server Error';
        return NextResponse.json({success: false, message: err}, {status: 500});
    }
}