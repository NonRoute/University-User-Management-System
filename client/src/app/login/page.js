'use client'
import Content from '@/components/Content'
import InputWithLabel from '@/components/InputWithLabel'
import Navbar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { signIn } from 'next-auth/react'

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
    const response = await signIn('credentials', {
      username: state.username,
      password: state.password,
      redirect: false
    })
    console.log(response)
    if (response?.ok) {
      toast.success('Login success')
      router.push('/')
    } else {
      toast.error('Login failed')
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
              className="bg-gradient-to-br from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 py-2 px-3 text-white font-semibold rounded-md text-lg transition-all active:ring-4 ring-slate-300 drop-shadow-md"
            >
              Login
            </button>
          </div>
        </form>
      </Content>
    </>
  )
}
