import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = schema.parse(json);
    const user = await prisma.user.findUnique({ where: { email: body.email } });
    if (!user) return Response.json({ message: "User not found" }, { status: 404 });
    const hashedPassword = await hash(body.password, 10);
    await prisma.user.update({ where: { id: user.id }, data: { hashedPassword } });
    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ message: e.message ?? "Invalid request" }, { status: 400 });
  }
}