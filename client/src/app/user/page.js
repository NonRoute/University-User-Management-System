'use client'
import Content from '@/components/Content'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'

export default function User() {
  const { data: session, status } = useSession()

  console.log(session.user)
  return (
    <>
      <Navbar />
      <Content header="Users" width="w-full"></Content>
    </>
  )
}
