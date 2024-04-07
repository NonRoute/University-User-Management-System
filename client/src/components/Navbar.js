'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <div className="bg-white h-14 text-black flex items-center justify-between px-4 shadow w-full">
      <div className="flex items-center h-full">
        <Link href={'/'} className="hover:bg-gray-100 h-full flex items-center px-2 transition-all">
          <Image src="logo.svg" alt="logo" width={40} height={40} />
        </Link>
        {session && session.user.role == 'admin' && (
          <Link href={'/user'} className="hover:bg-gray-100 h-full flex items-center px-2 transition-all font-light">
            Users
          </Link>
        )}
      </div>
      {session && session.user && (
        <>
          <div className="flex gap-2 items-center">
            <Image src={`${session.user.role}.svg`} alt="logo" width={30} height={30} />
            <div className="font-semibold text-lg mr-4">{session.user.username}</div>
            <button
              onClick={() => {
                signOut({
                  callbackUrl: '/'
                })
              }}
              className="border-sky-600 border-2 py-1 px-1 sm:px-3 text-sky-600 font-semibold rounded-md hover:bg-slate-200 transition-all active:ring-2 ring-cyan-600"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  )
}
