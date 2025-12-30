import { connectDB } from "@/app/lib/utils";
import gameModel from "@/app/models/gamesSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { gamename, version, status, link, gameimage, imageId, creator, features, uploader} =
      await req.json();
    if (!gamename || !version || !link || !gameimage || !imageId || !creator ||!features || !uploader)
      return NextResponse.json(
        { success: false, message: "Invalid params" },
        { status: 400 }
      );
    await connectDB();
    const game = await gameModel.findOneAndUpdate(
      { gamename },
      { gamename, version, status, link, gameimage, imageId, creator, features, uploader},
      { upsert: true, new: true }
    );
    return NextResponse.json({
      success: true,
      message: "Uploaded successfully",
    });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
