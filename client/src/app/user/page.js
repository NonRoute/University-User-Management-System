'use client'
import AccessDenied from '@/components/AccessDenied'
import Content from '@/components/Content'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'

export default function User() {
  const { data: session, status } = useSession()

  if (session?.user?.role !== 'admin') {
    return <AccessDenied />
  }

  return (
    <>
      <Navbar />
      <Content header="Users" width="w-full"></Content>
    </>
  )
}
