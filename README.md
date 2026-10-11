# Bazar Dor (বাজার দর)

## Description

Bazar Dor is a simple web application designed to help users track and view daily market prices of essential commodities. It allows everyday consumers to quickly check fluctuating prices of daily essentials like vegetables, rice, and groceries in one place before going to the market.

## Technologies Used

- HTML5
- Tailwind CSS
- JavaScript
- React.js

## Features

- **Daily Price List:** View updated market rates for essential daily items.
- **Category Filter:** Easily browse products divided into clear categories.
- **Search Bar:** Quickly look up specific commodities by name.
- **Responsive Layout:** Works smoothly across mobile phones, tablets, and desktops.
- **User-Friendly UI:** Clean, simple interface designed for easy reading.

## Deploying to Vercel

The app uses Better Auth with MongoDB in production. Local development can use
the in-memory adapter, but Vercel must have the production variables configured
before the deployment can authenticate users.

1. Create a MongoDB database and allow your Vercel deployment to connect to it.
2. In Vercel, open **Project Settings > Environment Variables** and add these
   variables for **Production** (and Preview if needed):
   - `BETTER_AUTH_SECRET`: a long random value that does not change between
     deployments.
   - `MONGODB_URI`: the MongoDB connection string for the `bazar-dor` database.
   - `NEXT_PUBLIC_APP_URL`: the deployed URL, for example
     `https://your-project.vercel.app`.
   - `BETTER_AUTH_URL`: the same deployed URL.
3. Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` if Google sign-in is
   enabled. Add `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` if GitHub sign-in
   is enabled.
4. Update the authorized redirect URLs in Google and GitHub to use the deployed
   URL. The Better Auth callback endpoint is:
   `https://your-project.vercel.app/api/auth/callback/<provider>`.
5. Redeploy after saving the variables. Environment variable changes only apply
   to new deployments.

The expected variable names are listed in `.env.example`. Never commit
`.env.local` or OAuth secrets.

To check the deployed configuration, open
`https://your-project.vercel.app/api/auth/health`. It should report
`database: "configured"` and `ok: true`.
