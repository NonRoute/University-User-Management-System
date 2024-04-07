'use client'
import AccessDenied from '@/components/AccessDenied'
import Content from '@/components/Content'
import InputWithLabel from '@/components/InputWithLabel'
import Navbar from '@/components/Navbar'
import SelectWithLabel from '@/components/SelectWithLabel'
import getUsers from '@/libs/getUsers'
import { useSession } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'

export default function User() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState()
  const [isShowPopup, setIsShowPopup] = useState(false)
  const [state, setState] = useState({
    username: '',
    password: '',
    role: ''
  })

  if (session?.user?.role !== 'admin') {
    return <AccessDenied />
  }

  const onChangeForm = (name) => (event) => {
    setState({ ...state, [name]: event.target.value })
  }

  const fetchData = async () => {
    if (session && session.user.token) {
      setUsers(await getUsers(session.user.token))
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const AddButton = () => {
    return (
      <button
        className="text-center bg-white text-cyan-600 py-2 px-6 rounded-lg text-xl font-bold drop-shadow-md hover:bg-gray-200 transition-all active:bg-gray-300 active:ring-4 ring-cyan-600"
        onClick={() => setIsShowPopup(true)}
      >
        Add +
      </button>
    )
  }

  const CloseButton = () => {
    return (
      <button
        className="text-center bg-white text-cyan-600 py-2 px-5 rounded-lg text-xl font-bold drop-shadow-md hover:bg-gray-200 transition-all active:bg-gray-300 active:ring-4 ring-cyan-600"
        onClick={() => setIsShowPopup(false)}
      >
        X
      </button>
    )
  }

  const onAddUser = async (e) => {
    e.preventDefault()
    console.log(state)
  }

  return (
    <>
      <Navbar />
      <Content header="Users" rightElement={<AddButton />}>
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
      {isShowPopup && (
        <div className="absolute top-0 left-0 w-screen bg-black/70">
          <div className="flex items-center justify-center min-h-screen w-full">
            <Content header="Add User" width="w-[480px]" rightElement={<CloseButton />}>
              <form onSubmit={onAddUser} className="flex flex-col gap-4">
                <InputWithLabel label="Username" type="text" onChange={onChangeForm('username')} />
                <InputWithLabel label="Password" type="text" onChange={onChangeForm('password')} />
                <SelectWithLabel
                  label="Role"
                  options={[
                    { value: 'admin', name: 'Admin' },
                    { value: 'teacher', name: 'Teacher' },
                    { value: 'student', name: 'Student' }
                  ]}
                  onChange={onChangeForm('role')}
                />
                <div className="flex flex-col gap-1 mt-6">
                  <button
                    type="submit"
                    className="bg-gradient-to-br from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 py-2 px-3 text-white font-semibold rounded-md text-lg transition-all active:ring-4 ring-slate-300 drop-shadow-md"
                  >
                    Add
                  </button>
                </div>
              </form>
            </Content>
          </div>
        </div>
      )}
    </>
  )
}
