import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const accountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

  // Graceful fallback if keys are missing
  if (!token || !accountId) {
    return NextResponse.json({
      success: false,
      error: "Instagram API keys not configured in .env.local",
      data: {
        followers: 0,
        reach: 0,
        engagements: 0,
      }
    });
  }

  try {
    // 1. Fetch Instagram Business Account metrics via Meta Graph API
    // This is the actual endpoint for IG User insights
    const url = `https://graph.facebook.com/v19.0/${accountId}?fields=followers_count,media_count&access_token=${token}`;
    
    // For reach/impressions, we need the /insights edge
    const insightsUrl = `https://graph.facebook.com/v19.0/${accountId}/insights?metric=impressions,reach,profile_views&period=day&access_token=${token}`;

    // In a real production app we would fetch both in parallel:
    // const [profileRes, insightsRes] = await Promise.all([ fetch(url), fetch(insightsUrl) ]);
    // const profile = await profileRes.json();
    // const insights = await insightsRes.json();
    
    // For safety during initial implementation, we'll try the basic profile fetch first
    const profileRes = await fetch(url);
    const profile = await profileRes.json();

    if (profile.error) {
      console.error("Meta Graph API Error:", profile.error);
      return NextResponse.json({
        success: false,
        error: profile.error.message,
        data: { followers: 0, reach: 0, engagements: 0 }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        followers: profile.followers_count || 0,
        reach: 0, // Placeholder until insights API is fully granted permissions
        engagements: 0,
      }
    });

  } catch (error) {
    console.error("Failed to fetch Instagram data:", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      data: { followers: 0, reach: 0, engagements: 0 }
    }, { status: 500 });
  }
}
