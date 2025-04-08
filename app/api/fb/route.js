import { NextResponse } from "next/server";
import { getFbVideoInfo } from "fb-downloader-scrapper";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const fbUrl = searchParams.get("url");

  if (!fbUrl) {
    return NextResponse.json(
      { error: "Missing Facebook URL parameter" },
      { status: 400 }
    );
  }

  try {
    const result = await getFbVideoInfo(fbUrl);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
