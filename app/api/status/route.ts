import { NextResponse } from "next/server";



export async function GET(req:Request){
    return NextResponse.json({success: true, message: "KENSHIE ANO NA?"});
}