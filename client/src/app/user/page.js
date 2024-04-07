'use client'
import AccessDenied from '@/components/AccessDenied'
import Content from '@/components/Content'
import Navbar from '@/components/Navbar'
import getUsers from '@/libs/getUsers'
import { useSession } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'

export default function User() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState()

  if (session?.user?.role !== 'admin') {
    return <AccessDenied />
  }

  const fetchData = async () => {
    if (session && session.user.token) {
      setUsers(await getUsers(session.user.token))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Navbar />
      <Content header="Users" width="">
        <div className="grid grid-cols-[min-content_1fr_1fr] shadow-lg overflow-x-auto">
          <div className="py-2 px-4 bg-gray-300 font-semibold text-lg rounded-tl-lg">ID</div>
          <div className="py-2 px-4 bg-gray-300 font-semibold text-lg">Username</div>
          <div className="py-2 px-4 bg-gray-300 font-semibold text-lg rounded-tr-lg">Role</div>
          {users?.map((user, index) => {
            return (
              <Fragment key={user.id}>
                <div className={`py-2 px-4 ${index % 2 && 'bg-gray-100'}`}>{user.id}</div>
                <div className={`py-2 px-4 ${index % 2 && 'bg-gray-100'}`}>{user.username}</div>
                <div className={`py-2 px-4 ${index % 2 && 'bg-gray-100'}`}>{user.role}</div>
              </Fragment>
            )
          })}
        </div>
      </Content>
    </>
  )
}
