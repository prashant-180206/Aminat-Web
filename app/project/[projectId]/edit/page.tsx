import { redirect } from "next/navigation";

export default async function Edit({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  redirect(`/project/${projectId}/edit/mobjects`);
}
