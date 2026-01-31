import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Subtopic from "@/lib/models/Subtopic";
import Tutorial from "@/lib/models/Tutorial";
import Test from "@/lib/models/Test";

// GET single published subtopic with tutorials and tests
export async function GET(
  request: Request,
  { params }: { params: Promise<{ topicId: string; subtopicId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId, subtopicId } = await params;
    await dbConnect();

    const subtopic = await Subtopic.findOne({
      id: subtopicId,
      topicId,
      published: true,
    });

    if (!subtopic) {
      return NextResponse.json(
        { error: "Subtopic not found" },
        { status: 404 },
      );
    }

    const [tutorials, tests] = await Promise.all([
      Tutorial.find({
        subtopicId,
        published: true,
      }).sort({ createdAt: 1 }),
      Test.find({
        subtopicId,
        published: true,
      }).sort({ createdAt: 1 }),
    ]);

    return NextResponse.json({
      ...subtopic.toObject(),
      tutorials,
      tests: tests || [],
    });
  } catch (error) {
    console.error("GET /api/learn/topics/[topicId]/[subtopicId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subtopic" },
      { status: 500 },
    );
  }
}
