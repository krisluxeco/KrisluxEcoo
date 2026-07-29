import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.LINKEDIN_ACCESS_TOKEN;
  const orgId = process.env.LINKEDIN_ORGANIZATION_ID;

  // Graceful fallback if keys are missing
  if (!token || !orgId) {
    return NextResponse.json({
      success: false,
      error: "LinkedIn API keys not configured in .env.local",
      data: {
        followers: 0,
        views: 0,
      }
    });
  }

  try {
    // LinkedIn API for Organization Follower Statistics
    const followersUrl = `https://api.linkedin.com/rest/networkSizes/urn:li:organization:${orgId}?edgeType=CompanyFollowedByMember`;
    
    // Page Statistics (for views)
    const statsUrl = `https://api.linkedin.com/rest/organizationPageStatistics?q=organization&organization=urn:li:organization:${orgId}`;

    // Note: LinkedIn requires specific version headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      'LinkedIn-Version': '202401', // Use current API version
      'X-Restli-Protocol-Version': '2.0.0'
    };

    // We will attempt to fetch followers
    const followersRes = await fetch(followersUrl, { headers });
    const followersData = await followersRes.json();

    if (followersData.status && followersData.status !== 200) {
      console.error("LinkedIn API Error:", followersData);
      return NextResponse.json({
        success: false,
        error: followersData.message || "Failed to fetch LinkedIn data",
        data: { followers: 0, views: 0 }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        followers: followersData?.firstDegreeSize || 0,
        views: 0, // Placeholder until page stats API fully granted
      }
    });

  } catch (error) {
    console.error("Failed to fetch LinkedIn data:", error);
    return NextResponse.json({
      success: false,
      error: "Internal Server Error",
      data: { followers: 0, views: 0 }
    }, { status: 500 });
  }
}
