'use client'
import AccessDenied from '@/components/AccessDenied'
import Content from '@/components/Content'
import InputWithLabel from '@/components/InputWithLabel'
import Navbar from '@/components/Navbar'
import SelectWithLabel from '@/components/SelectWithLabel'
import createUser from '@/libs/createUser'
import getUsers from '@/libs/getUsers'
import { useSession } from 'next-auth/react'
import { Fragment, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

export default function User() {
  const { data: session, status } = useSession()
  const [users, setUsers] = useState()
  const [isShowPopup, setIsShowPopup] = useState(false)
  const [state, setState] = useState({
    username: '',
    password: '',
    role: ''
  })

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

  const CreateButton = () => {
    return (
      <button
        className="text-center bg-white text-cyan-600 py-2 px-3 sm:px-6 rounded-lg text-lg sm:text-xl font-bold drop-shadow-md hover:bg-gray-200 transition-all active:bg-gray-300 active:ring-4 ring-cyan-600"
        onClick={() => setIsShowPopup(true)}
      >
        Create User
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

  const onCreateUser = async (e) => {
    e.preventDefault()
    const response = await createUser(session.user.token, state.username, state.password, state.role)
    if (response?.ok) {
      toast.success('Create success')
      setState({
        username: '',
        password: '',
        role: ''
      })
      fetchData()
    } else {
      toast.error('Create failed')
    }
  }

  if (session?.user?.role !== 'admin') {
    return <AccessDenied />
  }

  return (
    <>
      <Navbar />
      <Content header="Users" rightElement={<CreateButton />}>
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
        <div className="fixed top-0 w-screen bg-black/70 max-h-screen overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen h-full w-full">
            <Content header="Create User" width="w-[480px]" rightElement={<CloseButton />}>
              <form onSubmit={onCreateUser} className="flex flex-col gap-4">
                <InputWithLabel
                  label="Username"
                  type="text"
                  value={state.username}
                  onChange={onChangeForm('username')}
                />
                <InputWithLabel
                  label="Password"
                  type="text"
                  value={state.password}
                  onChange={onChangeForm('password')}
                />
                <SelectWithLabel
                  label="Role"
                  options={[
                    { value: 'admin', name: 'Admin' },
                    { value: 'teacher', name: 'Teacher' },
                    { value: 'student', name: 'Student' }
                  ]}
                  value={state.role}
                  onChange={onChangeForm('role')}
                />
                <div className="flex flex-col gap-1 mt-6">
                  <button
                    type="submit"
                    className="bg-gradient-to-br from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 py-2 px-3 text-white font-semibold rounded-md text-lg transition-all active:ring-4 ring-slate-300 drop-shadow-md"
                  >
                    Create
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
