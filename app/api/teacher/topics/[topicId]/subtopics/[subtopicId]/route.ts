import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Subtopic from "@/lib/models/Subtopic";
import Tutorial from "@/lib/models/Tutorial";
import Test from "@/lib/models/Test";

// GET single subtopic with all its data
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

    const subtopic = await Subtopic.findOne({ id: subtopicId, topicId });
    if (!subtopic) {
      return NextResponse.json(
        { error: "Subtopic not found" },
        { status: 404 },
      );
    }

    // Fetch all related tutorials and tests
    const [tutorials, tests] = await Promise.all([
      Tutorial.find({ subtopicId }).sort({ createdAt: 1 }),
      Test.find({ subtopicId }).sort({ createdAt: 1 }),
    ]);

    return NextResponse.json({ subtopic, tutorials, tests });
  } catch (error) {
    console.error(
      "GET /api/teacher/topics/[topicId]/subtopics/[subtopicId] error:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch subtopic" },
      { status: 500 },
    );
  }
}

// UPDATE subtopic
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ topicId: string; subtopicId: string }> },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId, subtopicId } = await params;
    const body = await request.json();
    const { title, description, published } = body;

    await dbConnect();

    const subtopic = await Subtopic.findOneAndUpdate(
      { id: subtopicId, topicId },
      { title, description, published },
      { new: true, runValidators: true },
    );

    if (!subtopic) {
      return NextResponse.json(
        { error: "Subtopic not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(subtopic);
  } catch (error) {
    console.error(
      "PATCH /api/teacher/topics/[topicId]/subtopics/[subtopicId] error:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to update subtopic" },
      { status: 500 },
    );
  }
}

// DELETE subtopic and all related data
export async function DELETE(
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

    // Delete all related data
    await Promise.all([
      Subtopic.deleteOne({ id: subtopicId, topicId }),
      Tutorial.deleteMany({ subtopicId }),
      Test.deleteMany({ subtopicId }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(
      "DELETE /api/teacher/topics/[topicId]/subtopics/[subtopicId] error:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to delete subtopic" },
      { status: 500 },
    );
  }
}
