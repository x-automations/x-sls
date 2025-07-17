const env = require('@x-sls/env')
const googleAuth = require('@x-sls/google-auth')

const readEnv = async () => {
  const plaintext = await env('PLAINTEXT_VAR')
  const secure = await env('SECURE_VAR')
  return {
    body: JSON.stringify({ plaintext, secure })
  }
}

async function isUserAllowed(email) {
  return Boolean(email)
}

async function googleAuthInit(event) {
  const GOOGLE_CLIENT_ID = await env('GOOGLE_CLIENT_ID')
  const REDIRECT_URI = await env('REDIRECT_URI')

  return googleAuth.handlers.initiate({
    GOOGLE_CLIENT_ID,
    REDIRECT_URI
  })(event)
}

async function googleAuthCallback(event) {
  const GOOGLE_CLIENT_ID = await env('GOOGLE_CLIENT_ID')
  const REDIRECT_URI = await env('REDIRECT_URI')
  const GOOGLE_CLIENT_SECRET = await env('GOOGLE_CLIENT_SECRET')
  const JWT_SECRET = await env('JWT_SECRET')

  return googleAuth.handlers.callback({
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    REDIRECT_URI,
    JWT_SECRET,
    isUserAllowed
  })(event)
}

async function googleAuthVerify(event) {
  const JWT_SECRET = await env('JWT_SECRET')
  return googleAuth.handlers.verify({
    JWT_SECRET,
    isUserAllowed
  })(event)
}

module.exports = {
  readEnv,
  googleAuthInit,
  googleAuthCallback,
  googleAuthVerify
}
