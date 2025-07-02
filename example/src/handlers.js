const env = require('@x-sls/env');

const readEnv = async (event) => {
  const plaintext = await env('PLAINTEXT_VAR');
  const secure = await env('SECURE_VAR');
  return {
    body: JSON.stringify({ plaintext, secure})
  }
};

module.exports = {
  readEnv
};