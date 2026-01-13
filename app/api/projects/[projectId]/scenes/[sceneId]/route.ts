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
  { params }: { params: Promise<{ projectId: string; sceneId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as SessionUser)?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { projectId, sceneId } = await params;
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(sceneId)
  ) {
    return NextResponse.json({ message: "Invalid ids" }, { status: 400 });
  }

  await connectDB();
  const project = await Project.findOne({ _id: projectId, ownerId: userId });
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const scene = await Scene.findOne({ _id: sceneId, projectId }).lean();
  if (!scene) {
    return NextResponse.json({ message: "Scene not found" }, { status: 404 });
  }

  return NextResponse.json({ scene });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; sceneId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as SessionUser)?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { projectId, sceneId } = await params;
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(sceneId)
  ) {
    return NextResponse.json({ message: "Invalid ids" }, { status: 400 });
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

  const scene = await Scene.findOneAndUpdate(
    { _id: sceneId, projectId },
    { title, data, thumbnail, version, updatedAt: new Date() },
    { new: true }
  ).lean();

  if (!scene) {
    return NextResponse.json({ message: "Scene not found" }, { status: 404 });
  }

  return NextResponse.json({ scene });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ projectId: string; sceneId: string }> }
) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as SessionUser)?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { projectId, sceneId } = await params;
  if (
    !mongoose.Types.ObjectId.isValid(projectId) ||
    !mongoose.Types.ObjectId.isValid(sceneId)
  ) {
    return NextResponse.json({ message: "Invalid ids" }, { status: 400 });
  }

  await connectDB();
  const project = await Project.findOne({ _id: projectId, ownerId: userId });
  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  const scene = await Scene.findOneAndDelete({ _id: sceneId, projectId });
  if (!scene) {
    return NextResponse.json({ message: "Scene not found" }, { status: 404 });
  }

  // Remove scene from project
  project.scenes = project.scenes.filter((id) => id.toString() !== sceneId);
  await project.save();

  return NextResponse.json({ message: "Scene deleted successfully" });
}
