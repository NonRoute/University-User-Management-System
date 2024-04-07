export default async function createUser(token, username, password, role) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    },
    body: JSON.stringify({
      username,
      password,
      role
    })
  })
  return response
}
