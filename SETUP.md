# Setup Guide

## Quick Start

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)
   - Version 18 or higher is recommended

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)

## First Time Setup

1. **Create an Account**
   - Click "Sign Up" in the navigation
   - Fill in your name, email, and password
   - The user data will be automatically saved to `data/users.json`

2. **Explore Museums**
   - Browse the museum directory
   - Use search and filters to find museums
   - Click on any museum to see detailed information

3. **Use the Scanner**
   - Navigate to the Scanner page
   - Allow camera access when prompted
   - Take a photo or upload an image of an artifact
   - The AI will attempt to identify it

## Features to Try

### Museum Directory
- Search for museums by name or location
- Filter by state
- View detailed museum profiles with exhibits

### Dashboard
- Add museums to your wishlist
- Mark museums as visited
- Write reviews with ratings and notes
- Track your points

### Artifact Scanner
- Use your device camera or upload images
- Get instant information about artifacts
- Learn about India's cultural heritage

## Troubleshooting

### Camera Not Working
- Make sure you've granted camera permissions in your browser
- Try using the file upload option instead
- Use HTTPS in production (required for camera access)

### AI Model Not Loading
- Check your internet connection (model downloads on first use)
- Clear browser cache and try again
- The model may take a few moments to load initially

### User Data Not Saving
- Check that the `data` directory exists and is writable
- Ensure Node.js has file system permissions

## Production Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

3. **Environment Variables** (Optional)
   - Create a `.env.local` file for any environment-specific settings
   - For production, consider migrating to a database instead of JSON files

## Database Migration (Optional)

The current implementation uses JSON files for data storage. For production, consider migrating to:
- MongoDB
- PostgreSQL
- Firebase
- Supabase

The API structure is already set up to make this migration straightforward.

