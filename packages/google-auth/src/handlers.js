const jwt = require('jsonwebtoken')
const { createAuthUrl, getAccessToken, getUserInfo } = require('./client')

function initiate({ GOOGLE_CLIENT_ID, REDIRECT_URI }) {
  return event => {
    const { returnUrl } = event?.queryStringParameters || {}

    const state = { returnUrl }
    return {
      statusCode: 302,
      headers: {
        Location: createAuthUrl({
          GOOGLE_CLIENT_ID,
          REDIRECT_URI,
          state
        })
      }
    }
  }
}

function callback({
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI,
  JWT_SECRET
}) {
  return async event => {
    const { code, state } = event.queryStringParameters

    let returnUrl
    try {
      const data = JSON.parse(state)
      returnUrl = data.returnUrl
    } catch (error) {
      console.error('Invalid state:', state)
      returnUrl = '/'
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

      return {
        statusCode: 302,
        headers: {
          Location: `${returnUrl}#token=${sessionToken}`
        }
      }
    } catch (error) {
      console.error('Error:', error)
      return {
        statusCode: 302,
        headers: {
          Location: `${returnUrl}#authError=${error}`
        }
      }
    }
  }
}

function verify({ JWT_SECRET }) {
  return async event => {
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
}

module.exports = {
  initiate,
  callback,
  verify
}
