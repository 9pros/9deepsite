import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

/**
 * Syncs Stack Auth user to MongoDB
 * This ensures we have a local copy of user data in MongoDB
 */
export async function POST(request: NextRequest) {
  try {
    // Get the current user from Stack Auth
    const user = await stackServerApp.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find or create user in MongoDB
    const dbUser = await User.findOneAndUpdate(
      { stack_user_id: user.id },
      {
        stack_user_id: user.id,
        email: user.primaryEmail || '',
        display_name: user.displayName || user.primaryEmail?.split('@')[0],
        profile_image_url: user.profileImageUrl,
        last_login: new Date(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      ok: true,
      user: {
        id: dbUser.stack_user_id,
        email: dbUser.email,
        displayName: dbUser.display_name,
        profileImageUrl: dbUser.profile_image_url,
      },
    });
  } catch (error: any) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to sync user" },
      { status: 500 }
    );
  }
}
