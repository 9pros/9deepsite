import { User } from "@/types";
import { NextResponse } from "next/server";

// UserResponse = type User & { token: string };
type UserResponse = User & { token: string };

export const isAuthenticated = async (): // req: NextRequest
Promise<UserResponse | NextResponse<unknown> | undefined> => {
  // Simple bypass authentication - return a mock user
  // No external authentication required
  const mockUser: UserResponse = {
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
    token: "local-token",
  };

  return mockUser;
};
