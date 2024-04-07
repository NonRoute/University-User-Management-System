import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AccessDenied() {
  const router = useRouter()
  useEffect(() => router.push('/login'), [])
  return (
    <div className="flex justify-center items-center h-screen text-white font-semibold text-4xl shadow-md">
      Access Denied
    </div>
  )
}
