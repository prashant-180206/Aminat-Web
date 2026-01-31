import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Topic from "@/lib/models/Topic";
import Subtopic from "@/lib/models/Subtopic";

// GET single published topic with subtopics
export async function GET(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId } = await params;
    await dbConnect();

    const topic = await Topic.findOne({ id: topicId, published: true });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const subtopics = await Subtopic.find({
      topicId,
      published: true,
    }).sort({ createdAt: 1 });

    return NextResponse.json({
      ...topic.toObject(),
      subtopics,
    });
  } catch (error) {
    console.error("GET /api/learn/topics/[topicId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 },
    );
  }
}
