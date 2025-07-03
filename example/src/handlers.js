const env = require('@x-sls/env')
const googleAuth = require('@x-sls/google-auth')

const readEnv = async () => {
  const plaintext = await env('PLAINTEXT_VAR')
  const secure = await env('SECURE_VAR')
  return {
    body: JSON.stringify({ plaintext, secure })
  }
}

let _authClient
async function createAuthClient() {
  if (!_authClient) {
    const GOOGLE_CLIENT_ID = await env('GOOGLE_CLIENT_ID')
    const GOOGLE_CLIENT_SECRET = await env('GOOGLE_CLIENT_SECRET')
    const REDIRECT_URI = await env('REDIRECT_URI')
    authClient = googleAuth.createClient({
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    })
  }

  return _authClient
}

async function googleAuthInit() {
  const authClient = await createAuthClient()

  return {
    statusCode: 302,
    headers: {
      Location: authClient.createAuthUrl()
    }
  }
}

async function googleAuthCallback(event) {
  const authClient = await createAuthClient()
  const JWT_SECRET = await env('JWT_SECRET')

  const { code } = event.queryStringParameters
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  try {
    const { access_token } = await authClient.getAccessToken({
      code
    })
    const info = await authClient.getUserInfo({ access_token })

    const { email, name, picture } = info
    const sessionToken = googleAuth.jwt.sign(
      {
        email,
        name,
        picture
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ token: sessionToken })
    }
  } catch (error) {
    console.error('Error:', error)
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Authentication failed' })
    }
  }
}

async function googleAuthVerify(event) {
  try {
    const JWT_SECRET = await env('JWT_SECRET')

    const { token } = JSON.parse(event.body)
    const decoded = googleAuth.jwt.verify(token, JWT_SECRET)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ user: decoded })
    }
  } catch (error) {
    return {
      statusCode: 401,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ error: 'Invalid token' })
    }
  }
}

module.exports = {
  readEnv,
  googleAuthInit,
  googleAuthCallback,
  googleAuthVerify
}
