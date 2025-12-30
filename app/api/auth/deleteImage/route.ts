import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function DELETE(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const fileId = params.get("fileId");

  if (!fileId)
    return NextResponse.json(
      { success: false, message: "Invalid params" },
      { status: 400 }
    );

  try {
    const deleteData = await axios.delete(
      `https://api.imagekit.io/v1/files/${fileId}`,
      {
        auth: {
          username: process.env.PRIVATE_KEY as string,
          password: "Kenshiejee123*",
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    return NextResponse.json({ success: true, deleteData: "Image deleted successfully" });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Server Error";
    return NextResponse.json({ success: false, message: err }, { status: 500 });
  }
}
