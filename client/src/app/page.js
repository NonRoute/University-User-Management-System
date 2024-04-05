import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <div className="text-2xl md:text-3xl font-bold text-white text-center">Welcome to</div>
      <div className="text-4xl md:text-5xl font-bold text-white text-center drop-shadow-md mt-2">
        University user management system
      </div>
      <Link
        href="/login"
        className="text-center bg-white text-cyan-600 p-2 rounded-lg text-xl font-bold w-72 mt-16 drop-shadow-md hover:bg-gray-200 transition-colors active:bg-gray-300 active:ring-4 ring-cyan-600"
      >
        Login
      </Link>
    </main>
  )
}
