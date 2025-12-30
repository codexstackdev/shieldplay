import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: Request) {
  try {
    const url = req.url.includes("?url=") ? new URL(req.url).searchParams.get("url") : null;
    if (!url) return NextResponse.json({ success: false, message: "No file URL provided" }, { status: 400 });

    const response = await axios.get(url, {
      responseType: "arraybuffer",
      maxRedirects: 5,
    });

    return new NextResponse(response.data, {
      headers: {
        "Content-Type": response.headers["content-type"] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${url.split("/").pop()}"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: "Failed to download file" }, { status: 500 });
  }
}
