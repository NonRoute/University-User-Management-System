export default async function getMe(token) {
  const NEXT_PUBLIC_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
  if (!NEXT_PUBLIC_SERVER_URL) throw new Error('Please define NEXT_PUBLIC_SERVER_URL')

  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/me`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Failed to fetch user profile')
  }
  return await response.json()
}
