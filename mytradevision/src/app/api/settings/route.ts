import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, email, password } = await req.json()

  const data: any = {}
  if (name) data.name = name
  if (email) data.email = email
  if (password) data.passwordHash = await bcrypt.hash(password, 10)

  const updated = await prisma.user.update({ where: { id: user.id }, data })
  return NextResponse.json({ id: updated.id })
}