# X-Sls Example

Serverless app demonstrating the `@x-sls` packages:

- `env`
- `google-auth`

## Local Setup

- copy `.env.example` to `.env` and add missing values
  - for google client ID and secret, you'll need to set up [credentials](https://console.cloud.google.com/apis/credentials) as well as allow-listing the origin and `REDIRECT_URI`.
- run `npm start` to start the offline serverless backend.
- start the frontend server with `npx http-server -P http://localhost:4000/dev`
  - change the `-P` (proxy) value to match the port that your serverless backend is running on.
