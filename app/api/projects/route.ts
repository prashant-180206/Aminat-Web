import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const projects = await Project.find({ ownerId: session.user.id }).lean();
  if (!projects) {
    return NextResponse.json({ projects: [] });
  }
  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, description } = await request.json();
  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  await connectDB();
  const project = await Project.create({
    name,
    description,
    ownerId: session.user.id,
    scenes: [],
  });

  return NextResponse.json({ project }, { status: 201 });
}
