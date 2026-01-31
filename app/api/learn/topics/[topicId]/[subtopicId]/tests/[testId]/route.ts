import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Test from "@/lib/models/Test";

// GET single published test
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ topicId: string; subtopicId: string; testId: string }>;
  },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { testId } = await params;
    await dbConnect();

    const test = await Test.findOne({
      id: testId,
      published: true,
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("GET /api/learn/tests/[testId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 },
    );
  }
}
