interface ZoomTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

/**
 * Get Server-to-Server OAuth Access Token from Zoom API
 */
export async function getZoomAccessToken(): Promise<string> {
  const accountId = process.env.ZOOM_ACCOUNT_ID;
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;

  if (!accountId || !clientId || !clientSecret) {
    throw new Error("Zoom credentials (ZOOM_ACCOUNT_ID, ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET) are missing from environment.");
  }

  // Check cache (refresh 60 seconds before expiration)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const url = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Zoom token fetch error:", errorText);
    throw new Error(`Failed to obtain Zoom access token: ${res.statusText}`);
  }

  const data = (await res.json()) as ZoomTokenResponse;
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };

  return data.access_token;
}

export interface CreateMeetingParams {
  topic: string;
  startTime: string; // ISO string e.g. "2026-08-07T10:00:00Z"
  durationMinutes: number;
  agenda?: string;
}

/**
 * Create a new Zoom Meeting
 */
export async function createZoomMeeting(params: CreateMeetingParams) {
  const token = await getZoomAccessToken();
  const userId = process.env.ZOOM_USER_ID || "me";

  const url = `https://api.zoom.us/v2/users/${encodeURIComponent(userId)}/meetings`;

  const payload = {
    topic: params.topic,
    type: 2, // Scheduled meeting
    start_time: params.startTime,
    duration: params.durationMinutes,
    timezone: "Asia/Colombo",
    agenda: params.agenda || "",
    settings: {
      host_video: true,
      participant_video: true,
      join_before_host: true,
      mute_upon_entry: true,
      waiting_room: false,
      auto_recording: "none",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Zoom meeting creation error:", errorText);
    throw new Error(`Failed to create Zoom meeting: ${errorText}`);
  }

  const data = (await res.json()) as any;
  return {
    meetingId: String(data.id),
    meetingUUID: data.uuid as string,
    joinUrl: data.join_url as string,
    startUrl: data.start_url as string,
    passcode: (data.password || "") as string,
    topic: data.topic as string,
    startTime: data.start_time as string,
    duration: data.duration as number,
  };
}

/**
 * Delete a Zoom Meeting
 */
export async function deleteZoomMeeting(meetingId: string) {
  const token = await getZoomAccessToken();
  const url = `https://api.zoom.us/v2/meetings/${encodeURIComponent(meetingId)}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 404) {
    const errorText = await res.text();
    console.error("Zoom meeting delete error:", errorText);
    throw new Error(`Failed to delete Zoom meeting: ${errorText}`);
  }

  return true;
}

export interface ZoomParticipant {
  id: string;
  name: string;
  user_email: string;
  join_time: string;
  leave_time: string;
  duration: number; // in seconds
}

/**
 * Get past meeting participants for automatic attendance calculation
 */
export async function getPastMeetingParticipants(meetingUUID: string): Promise<ZoomParticipant[]> {
  const token = await getZoomAccessToken();
  
  // Double-encode meetingUUID if it contains slashes or starts with /
  let safeUuid = encodeURIComponent(meetingUUID);
  if (meetingUUID.includes("/") || meetingUUID.startsWith("/")) {
    safeUuid = encodeURIComponent(safeUuid);
  }

  const url = `https://api.zoom.us/v2/past_meetings/${safeUuid}/participants?page_size=300`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Zoom past meeting participants fetch error:", errorText);
    throw new Error(`Failed to fetch past meeting participants: ${errorText}`);
  }

  const data = (await res.json()) as any;
  return (data.participants || []).map((p: any) => ({
    id: p.id || "",
    name: p.name || "",
    user_email: p.user_email || "",
    join_time: p.join_time || "",
    leave_time: p.leave_time || "",
    duration: p.duration || 0,
  }));
}
