import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { addHours } from 'date-fns'
import bcrypt from 'bcrypt'
import { randomBytes } from 'crypto'

export async function POST(req: Request) {
  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return NextResponse.json({ ok: true })
  const token = randomBytes(32).toString('hex')
  const expires = addHours(new Date(), 2)
  await prisma.verificationToken.create({ data: { identifier: email, token, expires } })
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/reset-password/${token}`
  return NextResponse.json({ ok: true, resetUrl })
}

export async function PUT(req: Request) {
  const { token, password } = await req.json()
  if (!token || !password) return NextResponse.json({ error: 'Token and password required' }, { status: 400 })
  const record = await prisma.verificationToken.findUnique({ where: { token } })
  if (!record || record.expires < new Date()) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  const user = await prisma.user.findUnique({ where: { email: record.identifier } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  const passwordHash = await bcrypt.hash(password, 10)
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } })
  await prisma.verificationToken.delete({ where: { token } })
  return NextResponse.json({ ok: true })
}