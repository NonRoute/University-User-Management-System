export default async function getUsers(token) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user`, {
    method: 'GET',
    headers: {
      authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    throw new Error('Cannot get users')
  }

  return await response.json()
}
