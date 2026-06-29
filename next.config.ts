import type { NextConfig } from 'next'

const config: NextConfig = {
  serverExternalPackages: ['pg', 'bcryptjs', '@prisma/adapter-pg'],
  turbopack: {
    root: __dirname,
  },
}

export default config
