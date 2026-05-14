import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { withApiLogging } from "@/lib/api-logging";
import { auth } from "@/lib/auth";
import { log } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

const bodySchema = z.object({
  name: z.string().min(1),
  prompt: z.string().optional()
});

async function getCurrentUser() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return null;
  }

  return prisma.user.upsert({
    where: { email },
    update: {
      name: session.user?.name,
      image: session.user?.image
    },
    create: {
      email,
      name: session.user?.name,
      image: session.user?.image
    }
  });
}

export const GET = withApiLogging("/api/workspaces", async () => {
  const user = await getCurrentUser();

  if (!user) {
    log("warn", "Workspace list requested without an authenticated user");
    return NextResponse.json({ workspaces: [] }, { status: 401 });
  }

  const workspaces = await prisma.workspace.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      brandBrief: true,
      createdAt: true
    }
  });

  log("info", "Loaded user workspaces", {
    userId: user.id,
    workspaceCount: workspaces.length
  });

  return NextResponse.json({
    workspaces: workspaces.map((workspace) => ({
      id: workspace.id,
      name: workspace.name,
      prompt: workspace.brandBrief ?? "",
      createdAt: workspace.createdAt.toISOString()
    }))
  });
});

export const POST = withApiLogging("/api/workspaces", async (request: NextRequest) => {
  const user = await getCurrentUser();

  if (!user) {
    log("warn", "Workspace creation requested without an authenticated user");
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = bodySchema.parse(await request.json());
  const slug = `${slugify(body.name)}-${crypto.randomUUID().slice(0, 8)}`;
  const workspace = await prisma.workspace.create({
    data: {
      name: body.name,
      slug,
      brandBrief: body.prompt ?? "",
      userId: user.id
    },
    select: {
      id: true,
      name: true,
      brandBrief: true,
      createdAt: true
    }
  });

  log("info", "Created user workspace", {
    userId: user.id,
    workspaceId: workspace.id
  });

  return NextResponse.json({
    workspace: {
      id: workspace.id,
      name: workspace.name,
      prompt: workspace.brandBrief ?? "",
      createdAt: workspace.createdAt.toISOString()
    }
  });
});
