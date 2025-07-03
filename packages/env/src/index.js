const { SSMClient, GetParameterCommand } = require('@aws-sdk/client-ssm')
const client = new SSMClient()

const SSM_PREFIX = 'ssm:'
const SSM_SECRET_PREFIX = `ssm:x:`

const lookup = {}

async function getEnv(key) {
  if (!lookup[key]) {
    lookup[key] = await resolveEnv(process.env[key])
  }

  return lookup[key]
}

async function resolveEnv(val) {
  // If this is not an SSM key, return the value as-is
  if (val.substr(0, SSM_PREFIX.length) !== SSM_PREFIX) {
    return val
  }

  // values with `ssm:x:` prefix are SecureString and need to be decrypted
  const WithDecryption =
    val.substr(0, SSM_SECRET_PREFIX.length) === SSM_SECRET_PREFIX
  const Name = val.substr(
    WithDecryption ? SSM_SECRET_PREFIX.length : SSM_PREFIX.length
  )

  try {
    const command = new GetParameterCommand({
      Name,
      WithDecryption
    })
    const res = await client.send(command)
    return res?.Parameter?.Value
  } catch (error) {
    console.error(error)
  }
}

module.exports = getEnv
