import { NextResponse } from "next/server";
import crypto from "crypto";

function base64Url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function extractMeetingNumber(zoomLink: string): string {
  let parsed: URL;
  try {
    parsed = new URL(zoomLink);
  } catch {
    return zoomLink.replace(/\D/g, "").slice(0, 13);
  }

  if (!/(^|\.)zoom\.us$/i.test(parsed.hostname)) return "";

  const pathMatch = parsed.pathname.match(/\/(?:j|wc\/join)\/(\d{9,13})/i);
  if (pathMatch) return pathMatch[1];

  const queryMeeting = parsed.searchParams.get("confno") || parsed.searchParams.get("meeting");
  return String(queryMeeting || "").replace(/\D/g, "").slice(0, 13);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { zoomUrl, meetingNumber: directMeetingNumber, role = 0 } = body;

    const clientId = process.env.ZOOM_MEETING_SDK_CLIENT_ID;
    const clientSecret = process.env.ZOOM_MEETING_SDK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Zoom Meeting SDK credentials are not configured on server." },
        { status: 500 }
      );
    }

    let mn = directMeetingNumber;
    if (!mn && zoomUrl) {
      mn = extractMeetingNumber(zoomUrl);
    }

    if (!mn) {
      return NextResponse.json(
        { error: "Invalid Zoom URL or Meeting Number." },
        { status: 400 }
      );
    }

    const iat = Math.floor(Date.now() / 1000) - 30;
    const exp = iat + 60 * 60 * 2;
    const header = { alg: "HS256", typ: "JWT" };
    const payload = {
      appKey: clientId,
      sdkKey: clientId,
      mn,
      role,
      iat,
      exp,
      tokenExp: exp,
    };

    const encodedHeader = base64Url(JSON.stringify(header));
    const encodedPayload = base64Url(JSON.stringify(payload));
    const unsignedToken = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto
      .createHmac("sha256", clientSecret)
      .update(unsignedToken)
      .digest("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

    return NextResponse.json({
      sdkKey: clientId,
      signature: `${unsignedToken}.${signature}`,
      meetingNumber: mn,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to generate Zoom SDK signature" },
      { status: 500 }
    );
  }
}
