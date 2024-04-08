/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL
  }
}

export default nextConfig
