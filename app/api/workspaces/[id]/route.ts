import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { withApiLogging } from "@/lib/api-logging";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({
  name: z.string().min(1).optional(),
  prompt: z.string().optional()
});

async function getCurrentUserId() {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) return null;

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true }
  });

  return user?.id ?? null;
}

export const PATCH = withApiLogging("/api/workspaces/[id]", async (request: NextRequest) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const workspaceId = request.nextUrl.pathname.split("/").at(-1);
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace id required" }, { status: 400 });
  }

  const body = bodySchema.parse(await request.json());
  const workspace = await prisma.workspace.update({
    where: {
      id: workspaceId,
      userId
    },
    data: {
      ...(body.name ? { name: body.name } : {}),
      ...(body.prompt !== undefined ? { brandBrief: body.prompt } : {})
    },
    select: {
      id: true,
      name: true,
      brandBrief: true,
      createdAt: true
    }
  });

  log("info", "Updated user workspace", { userId, workspaceId });

  return NextResponse.json({
    workspace: {
      id: workspace.id,
      name: workspace.name,
      prompt: workspace.brandBrief ?? "",
      createdAt: workspace.createdAt.toISOString()
    }
  });
});

export const DELETE = withApiLogging("/api/workspaces/[id]", async (request: NextRequest) => {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const workspaceId = request.nextUrl.pathname.split("/").at(-1);
  if (!workspaceId) {
    return NextResponse.json({ error: "Workspace id required" }, { status: 400 });
  }

  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, userId },
    select: { id: true }
  });

  if (!workspace) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
  }

  await prisma.workspace.delete({
    where: { id: workspace.id }
  });

  log("info", "Deleted user workspace", { userId, workspaceId });

  return NextResponse.json({ ok: true });
});
