import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/mongodb";
import Project from "@/lib/models/Project";
import Scene from "@/lib/models/Scene";
import mongoose from "mongoose";

type SessionUser = { id?: string } | null | undefined;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as SessionUser)?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return NextResponse.json(
      { message: "Invalid project id" },
      { status: 400 }
    );
  }

  await connectDB();
  const project = await Project.findOne({ _id: projectId, ownerId: userId });
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const scenes = await Scene.find({ projectId }).lean();
  return NextResponse.json({ scenes });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as SessionUser)?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  if (!mongoose.Types.ObjectId.isValid(projectId)) {
    return NextResponse.json(
      { message: "Invalid project id" },
      { status: 400 }
    );
  }

  const { title, data, thumbnail, version } = await request.json();

  if (!title || !data) {
    return NextResponse.json(
      { message: "Title and data are required" },
      { status: 400 }
    );
  }

  await connectDB();
  const project = await Project.findOne({ _id: projectId, ownerId: userId });
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const scene = await Scene.create({
    projectId,
    title,
    data,
    thumbnail,
    version,
    createdBy: userId,
  });

  project.scenes.push(scene._id);
  await project.save();

  return NextResponse.json({ scene }, { status: 201 });
}
