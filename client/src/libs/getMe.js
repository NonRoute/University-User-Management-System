export default async function getMe(token) {
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
