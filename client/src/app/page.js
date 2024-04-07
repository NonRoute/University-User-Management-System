import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex w-full flex-col h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-center grow">
        <div className="text-2xl md:text-3xl font-bold text-white text-center">Welcome to</div>
        <div className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-md mt-2">
          University user management system
        </div>
        <Link
          href="/login"
          className="text-center bg-white text-cyan-600 p-2 rounded-lg text-xl font-bold w-72 mt-16 drop-shadow-md hover:bg-gray-200 transition-all active:bg-gray-300 active:ring-4 ring-cyan-600"
        >
          Login
        </Link>
      </main>
    </div>
  )
}
