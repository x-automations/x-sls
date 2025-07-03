const jwt = require('jsonwebtoken')

const { createAuthUrl, getAccessToken, getUserInfo } = require('./index')

async function initiate() {
  return {
    statusCode: 302,
    headers: {
      Location: createAuthUrl({ GOOGLE_CLIENT_ID, REDIRECT_URI })
    }
  }
}

async function callback(event) {
  const { code } = event.queryStringParameters
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  }

  try {
    const { access_token } = await getAccessToken({
      code,
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      REDIRECT_URI
    })
    const info = await getUserInfo({ access_token })

    const { email, name, picture } = info
    const sessionToken = jwt.sign(
      {
        email,
        name,
        picture
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    console.log({ sessionToken })

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

async function verify(event) {
  try {
    const { token } = JSON.parse(event.body)
    const decoded = jwt.verify(token, JWT_SECRET)

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
  initiate,
  callback,
  verify
}
