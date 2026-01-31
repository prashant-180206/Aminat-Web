import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/lib/models/Tutorial";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ topicId: string; subtopicId: string }> },
) {
  try {
    const { topicId, subtopicId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const tutorials = await Tutorial.find({ topicId, subtopicId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(tutorials);
  } catch (error) {
    console.error(
      "GET /api/teacher/topics/[topicId]/subtopics/[subtopicId]/tutorials error:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch tutorials" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ topicId: string; subtopicId: string }> },
) {
  try {
    const { topicId, subtopicId } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, duration, level, hasScene, steps } = body;

    if (!title || !description || !duration || !level) {
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

    const tutorial = await Tutorial.create({
      id,
      title,
      description,
      duration,
      level,
      hasScene: hasScene || false,
      steps: steps || [],
      topicId,
      subtopicId,
      createdBy: session.user.id,
      published: false,
    });

    return NextResponse.json(tutorial, { status: 201 });
  } catch (error) {
    console.error(
      "POST /api/teacher/topics/[topicId]/subtopics/[subtopicId]/tutorials error:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to create tutorial" },
      { status: 500 },
    );
  }
}
