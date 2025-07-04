const createAuthUrl = ({ GOOGLE_CLIENT_ID, REDIRECT_URI, state = {} }) =>
  `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=profile+email&state=${encodeURIComponent(JSON.stringify(state))}`

const getAccessToken = async ({
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  code
}) => {
  let text
  try {
    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    })

    text = await res.text()

    return JSON.parse(text)
  } catch (error) {
    if (text) {
      console.error({ text })
    }
    throw error
  }
}

const getUserInfo = async ({ access_token }) => {
  let text
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    })

    text = await res.text()
    return JSON.parse(text)
  } catch (error) {
    if (text) {
      console.error({ text })
    }
    throw error
  }
}

module.exports = {
  createAuthUrl,
  getAccessToken,
  getUserInfo
}
