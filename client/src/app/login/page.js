'use client'
import Content from '@/components/Content'
import InputWithLabel from '@/components/InputWithLabel'
import Navbar from '@/components/Navbar'

export default function Login() {
  const onLogin = async (e) => {}

  return (
    <>
      <Navbar />
      <Content header="Login" width="w-[480px]">
        <form onSubmit={onLogin} className="flex flex-col gap-4">
          <InputWithLabel label="Username" />
          <InputWithLabel label="Password" />
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
