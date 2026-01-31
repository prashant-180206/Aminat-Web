import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/lib/models/Tutorial";

// GET single tutorial
export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      topicId: string;
      subtopicId: string;
      tutorialId: string;
    }>;
  },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorialId } = await params;
    await dbConnect();

    const tutorial = await Tutorial.findOne({ id: tutorialId });
    if (!tutorial) {
      return NextResponse.json(
        { error: "Tutorial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("GET /api/teacher/tutorials/[tutorialId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutorial" },
      { status: 500 },
    );
  }
}

// UPDATE tutorial
export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      topicId: string;
      subtopicId: string;
      tutorialId: string;
    }>;
  },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorialId } = await params;
    const body = await request.json();

    await dbConnect();

    const tutorial = await Tutorial.findOneAndUpdate({ id: tutorialId }, body, {
      new: true,
      runValidators: true,
    });

    if (!tutorial) {
      return NextResponse.json(
        { error: "Tutorial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("PATCH /api/teacher/tutorials/[tutorialId] error:", error);
    return NextResponse.json(
      { error: "Failed to update tutorial" },
      { status: 500 },
    );
  }
}

// DELETE tutorial
export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      topicId: string;
      subtopicId: string;
      tutorialId: string;
    }>;
  },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { tutorialId } = await params;
    await dbConnect();

    await Tutorial.deleteOne({ id: tutorialId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/teacher/tutorials/[tutorialId] error:", error);
    return NextResponse.json(
      { error: "Failed to delete tutorial" },
      { status: 500 },
    );
  }
}
