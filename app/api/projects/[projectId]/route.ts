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
  const project = await Project.findOne({
    _id: projectId,
    ownerId: userId,
  }).populate("scenes");

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function PUT(
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

  const { name, description } = await request.json();
  if (!name) {
    return NextResponse.json({ message: "Name is required" }, { status: 400 });
  }

  await connectDB();
  const project = await Project.findOneAndUpdate(
    { _id: projectId, ownerId: userId },
    { name, description, updatedAt: new Date() },
    { new: true }
  );

  if (!project) {
    return NextResponse.json({ message: "Project not found" }, { status: 404 });
  }

  return NextResponse.json({ project });
}

export async function DELETE(
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

  // Delete all scenes in the project
  await Scene.deleteMany({ projectId });

  // Delete the project
  await Project.findByIdAndDelete(projectId);

  return NextResponse.json({ message: "Project deleted successfully" });
}
