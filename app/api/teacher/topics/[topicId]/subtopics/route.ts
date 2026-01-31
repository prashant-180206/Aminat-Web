import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Subtopic from "@/lib/models/Subtopic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const { topicId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const subtopics = await Subtopic.find({ topicId }).sort({ createdAt: -1 });
    return NextResponse.json(subtopics);
  } catch (error) {
    console.error("GET /api/teacher/topics/[topicId]/subtopics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch subtopics" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ topicId: string }> },
) {
  try {
    const { topicId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    await dbConnect();

    const id = title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    const subtopic = await Subtopic.create({
      id,
      title,
      description,
      topicId,
      createdBy: session.user.id,
      published: false,
    });

    return NextResponse.json(subtopic, { status: 201 });
  } catch (error) {
    console.error("POST /api/teacher/topics/[topicId]/subtopics error:", error);
    return NextResponse.json(
      { error: "Failed to create subtopic" },
      { status: 500 },
    );
  }
}
