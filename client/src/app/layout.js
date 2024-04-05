import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'University user management system',
  description: 'Generated by create next app'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-gradient-to-br from-cyan-500 to-sky-600 min-h-screen">{children}</div>
      </body>
    </html>
  )
}
