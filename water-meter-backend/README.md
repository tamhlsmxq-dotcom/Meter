# Water Meter Backend

## Local development

1. Copy `.env.example` to `.env`.
2. Put `serviceAccountKey.json` in this directory. The file is ignored by Git.
3. Install dependencies and start the API:

```powershell
npm ci
npm start
```

Health check: `http://localhost:5000/health`

## Production environment

Set these environment variables in the hosting provider:

- `PORT`: supplied by the provider, or `5000`.
- `FRONTEND_ORIGIN`: comma-separated Firebase Hosting origins.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: the complete service-account JSON as a secret.

Never commit `serviceAccountKey.json`, `.env`, or the service-account JSON value.

After the API is deployed, set `window.WATER_METER_API_URL` before `firebase-config.js` loads in the frontend to the deployed API URL.

## Render deployment

The repository includes `render.yaml`. Create a Render Blueprint from the repository, then set:

- `FRONTEND_ORIGIN=https://water-meter-a8b4a.web.app`
- `FIREBASE_SERVICE_ACCOUNT_JSON`: paste the complete service-account JSON into Render's secret field.

After deployment, copy the generated Render URL and set it as `window.WATER_METER_API_URL` in the frontend before `firebase-config.js` is loaded. Test the URL by opening `/health`.
