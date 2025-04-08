import { NextResponse } from "next/server";
import Tiktok from "@tobyg74/tiktok-api-dl";
import { getFbVideoInfo } from "fb-downloader-scrapper";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 }
    );
  }

  try {
    // Determine if it's a TikTok or Facebook URL
    const isTikTok = url.includes("tiktok.com");
    const isFacebook = url.includes("facebook.com") || url.includes("fb.watch");

    if (!isTikTok && !isFacebook) {
      return NextResponse.json(
        { error: "Invalid URL. Only TikTok and Facebook URLs are supported" },
        { status: 400 }
      );
    }

    if (isTikTok) {
      const result = await Tiktok.Downloader(url, {
        version: "v3",
        showOriginalResponse: false,
      });
      return NextResponse.json(result);
    } else {
      const result = await getFbVideoInfo(url);
      const decoded = decodeHtmlEntities(result.title);
      return NextResponse.json({ ...result, title: decoded });
    }
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
