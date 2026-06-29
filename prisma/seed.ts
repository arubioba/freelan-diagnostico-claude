import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const users = [
  { email: 'antonio.rubio@freelan.com.mx',    name: 'Antonio Rubio',    role: Role.ADMIN, password: 'Freelan2025!' },
  { email: 'lourdes.cicero@freelan.com.mx',   name: 'Lourdes Cicero',   role: Role.SALES, password: 'Freelan2025!' },
  { email: 'adriana.plata@freelan.com.mx',    name: 'Adriana Plata',    role: Role.SALES, password: 'Freelan2025!' },
  { email: 'amaya.gutierrez@freelan.com.mx',  name: 'Amaya Gutiérrez',  role: Role.SALES, password: 'Freelan2025!' },
  { email: 'antonio.rcarrero@freelan.com.mx', name: 'Antonio Carrero',  role: Role.SALES, password: 'Freelan2025!' },
]

async function main() {
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 12)
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { email: u.email, name: u.name, role: u.role, password: hash },
    })
    console.log(`✓ ${u.email}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
