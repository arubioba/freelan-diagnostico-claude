import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const diagnoses = await prisma.diagnosis.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, createdAt: true, status: true,
      companyName: true, companyUrl: true, industry: true, contactName: true,
      user: { select: { name: true } },
    },
  })

  return NextResponse.json(diagnoses)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { contactName, contactEmail, contactRole, companyName, companyUrl, industry, meetingNotes } = body

  if (!contactName || !contactEmail || !companyName || !companyUrl || !industry || !meetingNotes) {
    return NextResponse.json({ error: 'Todos los campos son requeridos' }, { status: 400 })
  }

  const diagnosis = await prisma.diagnosis.create({
    data: {
      contactName, contactEmail, contactRole,
      companyName, companyUrl, industry, meetingNotes,
      userId: session.user.id,
    },
  })

  return NextResponse.json(diagnosis, { status: 201 })
}
