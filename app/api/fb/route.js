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
    const decoded = decodeHtmlEntities(result.title);
    return NextResponse.json({ ...result, title: decoded });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function decodeHtmlEntities(htmlEntities) {
  const decoded = htmlEntities.replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
    String.fromCodePoint(parseInt(hex, 16))
  );
  return decoded;
}
