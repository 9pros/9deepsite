import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Simple mock authentication - no external service required
  const body = await req.json();
  // const { code } = body;

  // Return mock user data without requiring actual authentication
  const mockUser = {
    id: "local-user",
    name: "Local User",
    fullname: "Local User",
    email: "user@local",
    emailVerified: true,
    avatarUrl: "/api/placeholder/32/32",
    websiteUrl: "",
    canPay: false,
    isPro: false,
    orgs: [],
  };

  return NextResponse.json(
    {
      access_token: "local-token",
      expires_in: 3600,
      user: mockUser,
    },
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
