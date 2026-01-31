import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Test from "@/lib/models/Test";

// GET single test
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

    const test = await Test.findOne({ id: testId });
    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("GET /api/teacher/tests/[testId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test" },
      { status: 500 },
    );
  }
}

// UPDATE test
export async function PATCH(
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
    const body = await request.json();

    await dbConnect();

    const test = await Test.findOneAndUpdate({ id: testId }, body, {
      new: true,
      runValidators: true,
    });

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error) {
    console.error("PATCH /api/teacher/tests/[testId] error:", error);
    return NextResponse.json(
      { error: "Failed to update test" },
      { status: 500 },
    );
  }
}

// DELETE test
export async function DELETE(
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

    await Test.deleteOne({ id: testId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/teacher/tests/[testId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete test" },
      { status: 500 },
    );
  }
}
