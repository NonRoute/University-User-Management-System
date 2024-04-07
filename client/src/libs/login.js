export default async function login(username, password) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  return response
}
