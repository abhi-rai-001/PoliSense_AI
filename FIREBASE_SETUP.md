# Firebase Authentication Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "polisense-ai")
4. Follow the setup wizard

## Step 2: Enable Authentication

1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Configure Google OAuth:
   - Add your authorized domain: `www.polisense.info`
   - Add authorized redirect URIs if needed

## Step 3: Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click **Add app** → **Web**
4. Register your app with nickname (e.g., "Polisense Web")
5. Copy the configuration object

## Step 4: Set Environment Variables

Create a `.env` file in the `frontend` directory with:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 5: Update Backend (Optional)

If you want to verify Firebase tokens on the backend, you'll need to:
1. Install Firebase Admin SDK in your backend
2. Add Firebase service account key
3. Update authentication middleware

## Features

✅ **Google OAuth Authentication**  
✅ **Automatic redirect after sign-in**  
✅ **User profile display**  
✅ **Sign out functionality**  
✅ **Protected routes**  
✅ **Loading states**  
✅ **Error handling**  

## Security

- Firebase handles all authentication securely
- No sensitive data stored in frontend
- Automatic token refresh
- Secure session management 