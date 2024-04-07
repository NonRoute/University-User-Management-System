import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <div className="bg-white h-14 text-black flex items-center justify-between p-4 shadow">
      <Link href={'/'}>
        <Image src="logo.svg" alt="logo" width={40} height={40} />
      </Link>
      <div className="flex gap-2 items-center">
        <Image src={`${session.user.role}.svg`} alt="logo" width={30} height={30} />
        <div className="font-semibold text-lg">{session.user.username}</div>
      </div>
    </div>
  )
}
