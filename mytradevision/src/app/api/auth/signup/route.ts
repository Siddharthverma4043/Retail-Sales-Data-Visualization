import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = schema.parse(json);

    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return Response.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await hash(body.password, 10);

    await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        hashedPassword,
      },
    });

    return Response.json({ ok: true });
  } catch (e: any) {
    return Response.json({ message: e.message ?? "Invalid request" }, { status: 400 });
  }
}