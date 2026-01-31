import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Topic from "@/lib/models/Topic";
import Subtopic from "@/lib/models/Subtopic";
import Tutorial from "@/lib/models/Tutorial";
import Test from "@/lib/models/Test";

// GET single topic with all its data
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

    const topic = await Topic.findOne({ id: topicId });
    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // Fetch all related subtopics
    const subtopics = await Subtopic.find({ topicId }).sort({ createdAt: 1 });

    return NextResponse.json({ topic, subtopics });
  } catch (error) {
    console.error("GET /api/teacher/topics/[topicId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 },
    );
  }
}

// UPDATE topic
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId } = await params;
    const body = await request.json();
    const { title, description, published } = body;

    await dbConnect();

    const topic = await Topic.findOneAndUpdate(
      { id: topicId },
      { title, description, published },
      { new: true, runValidators: true },
    );

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("PATCH /api/teacher/topics/[topicId] error:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 },
    );
  }
}

// DELETE topic and all related data
export async function DELETE(
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

    // Delete all related data
    await Promise.all([
      Topic.deleteOne({ id: topicId }),
      Subtopic.deleteMany({ topicId }),
      Tutorial.deleteMany({ topicId }),
      Test.deleteMany({ topicId }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/teacher/topics/[topicId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 },
    );
  }
}
