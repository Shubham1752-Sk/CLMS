import { auth } from "@/auth";
import { NextResponse } from "next/server";

// Define the GET method for this API route
export async function GET() {
  try {
    const session = await auth(); // Fetch session using your auth logic
    return NextResponse.json({ session }); // Return session data in JSON format
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}
