import { NextResponse } from "next/server";
import Tiktok from "@tobyg74/tiktok-api-dl";
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const tiktokUrl = searchParams.get("url");

  if (!tiktokUrl) {
    return NextResponse.json(
      { error: "Missing TikTok URL parameter" },
      { status: 400 }
    );
  }

  try {
    const result = await Tiktok.Downloader(tiktokUrl, {
      version: "v3", // Using the latest version
      showOriginalResponse: false, // Set to true if you want the original API response
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
