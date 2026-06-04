# Render Backend Deployment

## Render service settings

- Service type: Web Service
- Runtime: Node
- Root directory: `backend`
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/api/health`

## Environment variables

Add these in Render under **Environment**:

```text
NODE_ENV=production
MONGO_URI=<your MongoDB Atlas connection string>
JWT_SECRET=<long random secret>
CLIENT_URL=<your frontend URL, for example https://your-site.netlify.app>
CLOUDINARY_CLOUD_NAME=<your Cloudinary cloud name>
CLOUDINARY_API_KEY=<your Cloudinary API key>
CLOUDINARY_API_SECRET=<your Cloudinary API secret>
```

Render provides `PORT` automatically, so you do not need to add it there.

## Step-by-step

1. Push this repository to GitHub.
2. In Render, choose **New +** then **Web Service**.
3. Connect the GitHub repository.
4. Set the root directory to `backend`.
5. Set build command to `npm install`.
6. Set start command to `npm start`.
7. Add all environment variables listed above.
8. Deploy the service.
9. After deployment, open:

```text
https://your-render-service.onrender.com/api/health
```

You should see a JSON response saying the API is healthy.

## Frontend update

After Render gives you the backend URL, set your frontend environment variable:

```text
VITE_API_URL=https://your-render-service.onrender.com/api
```

Then rebuild and redeploy the frontend.
