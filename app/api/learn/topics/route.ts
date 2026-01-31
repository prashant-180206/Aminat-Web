import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Topic from "@/lib/models/Topic";
import Subtopic from "@/lib/models/Subtopic";

// GET all published topics for students
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get all published topics
    const topics = await Topic.find({ published: true }).sort({ createdAt: 1 });

    // Debug: Log all topics to see what's in DB
    const allTopics = await Topic.find({});
    console.log("All topics in DB:", allTopics.length);
    console.log("Published topics:", topics.length);
    console.log(
      "Topics data:",
      allTopics.map((t) => ({
        id: t.id,
        title: t.title,
        published: t.published,
      })),
    );

    // Get all published subtopics for these topics
    const topicIds = topics.map((t) => t.id);
    const subtopics = await Subtopic.find({
      topicId: { $in: topicIds },
      published: true,
    }).sort({ createdAt: 1 });

    // Group subtopics by topic
    const topicsWithSubtopics = topics.map((topic) => ({
      ...topic.toObject(),
      subtopics: subtopics.filter((s) => s.topicId === topic.id),
    }));

    return NextResponse.json(topicsWithSubtopics);
  } catch (error) {
    console.error("GET /api/learn/topics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 },
    );
  }
}
