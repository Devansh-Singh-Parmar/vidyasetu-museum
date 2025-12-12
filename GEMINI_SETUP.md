# Gemini API Setup Instructions

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey) or [MakerSuite](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key" or "Get API Key"
4. Copy your API key (it will look like: `AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`)

## Step 2: Configure Environment Variables

1. **Create a `.env.local` file** in the root directory of your project (same level as `package.json`)

2. **Add your Gemini API key** to the file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

   Replace `your_actual_api_key_here` with the API key you copied in Step 1.

3. **Example `.env.local` file:**
   ```
   GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

## Step 3: Restart Your Development Server

After adding the API key:

1. Stop your current development server (if running) by pressing `Ctrl+C` in the terminal
2. Start it again with:
   ```bash
   npm run dev
   ```

## Important Notes

- **Never commit `.env.local` to git** - it's already in `.gitignore`
- The `.env.local` file is for local development
- For production, set the environment variable in your hosting platform (Vercel, Netlify, etc.)
- The API key is free to use with reasonable rate limits
- Make sure your API key has access to the Gemini API

## Troubleshooting

### "Gemini API key not configured" error
- Make sure you created `.env.local` (not `.env.example`)
- Verify the variable name is exactly `GEMINI_API_KEY`
- Restart your development server after adding the key
- Check that there are no extra spaces or quotes around the key

### API errors
- Verify your API key is valid and active
- Check your internet connection
- Ensure you haven't exceeded rate limits
- Try regenerating your API key if issues persist

## Testing

Once configured, navigate to the Scanner page (`/scanner`) and try:
1. Uploading an image of an artifact
2. Using the camera to capture an artifact

The scanner will now use Gemini AI to identify and provide detailed historical information about artifacts!
