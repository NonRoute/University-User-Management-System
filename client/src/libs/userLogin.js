export default async function userLogin(username, password) {
  const response = await fetch(`${process.env.NEXTAUTH_URL_INTERNAL}/user/login`, {
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
