import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Tutorial from "@/lib/models/Tutorial";

// GET single published tutorial
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

    const tutorial = await Tutorial.findOne({
      id: tutorialId,
      published: true,
    });

    if (!tutorial) {
      return NextResponse.json(
        { error: "Tutorial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(tutorial);
  } catch (error) {
    console.error("GET /api/learn/tutorials/[tutorialId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tutorial" },
      { status: 500 },
    );
  }
}
