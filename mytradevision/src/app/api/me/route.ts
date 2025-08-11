import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { id: (session.user as any).id } });
  return Response.json({ name: user?.name, email: user?.email });
}

const schema = z.object({ name: z.string().optional(), email: z.string().email() });

export async function PUT(req: Request) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session?.user) return Response.json({ message: "Unauthorized" }, { status: 401 });
  const json = await req.json();
  const body = schema.parse(json);
  const updated = await prisma.user.update({ where: { id: (session.user as any).id }, data: { name: body.name, email: body.email } });
  return Response.json({ name: updated.name, email: updated.email });
}