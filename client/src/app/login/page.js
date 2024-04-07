'use client'
import Content from '@/components/Content'
import InputWithLabel from '@/components/InputWithLabel'
import Navbar from '@/components/Navbar'
import login from '@/libs/login'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'

export default function Login() {
  const router = useRouter()
  const [state, setState] = useState({
    username: '',
    password: ''
  })

  const onChangeForm = (name) => (event) => {
    setState({ ...state, [name]: event.target.value })
  }

  const onLogin = async (e) => {
    e.preventDefault()
    const response = await login(state.username, state.password)
    if (response.status == 200) {
      toast.success('Login success')
      router.push('/')
    } else {
      toast.error((await response.json()).message)
    }
  }

  return (
    <>
      <Navbar />
      <Content header="Login" width="w-[480px]">
        <form onSubmit={onLogin} className="flex flex-col gap-4">
          <InputWithLabel label="Username" type="text" autoComplete="username" onChange={onChangeForm('username')} />
          <InputWithLabel
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={onChangeForm('password')}
          />
          <div className="flex flex-col gap-1 mt-6">
            <button
              type="submit"
              className="bg-gradient-to-br from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 py-2 px-3 text-white font-semibold rounded-md hover:bg-slate-200 text-lg"
            >
              Login
            </button>
          </div>
        </form>
      </Content>
    </>
  )
}
