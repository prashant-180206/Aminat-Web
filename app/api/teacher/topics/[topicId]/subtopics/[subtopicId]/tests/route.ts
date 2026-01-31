import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Test from "@/lib/models/Test";

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
    const tests = await Test.find({ topicId, subtopicId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(tests);
  } catch (error) {
    console.error(
      "GET /api/teacher/topics/[topicId]/subtopics/[subtopicId]/tests error:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to fetch tests" },
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
    const { title, description, duration, questions, questionsData } = body;

    if (!title || !description || !duration || !questions) {
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

    const test = await Test.create({
      id,
      title,
      description,
      duration,
      questions,
      questionsData: questionsData || [],
      topicId,
      subtopicId,
      createdBy: session.user.id,
      published: false,
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    console.error(
      "POST /api/teacher/topics/[topicId]/subtopics/[subtopicId]/tests error:",
      error,
    );
    return NextResponse.json(
      { error: "Failed to create test" },
      { status: 500 },
    );
  }
}
