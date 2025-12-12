# Museum Guide India

A comprehensive web portal to discover museums across India and track your cultural journey. This application helps tourists and culture enthusiasts explore India's rich heritage and maintain a centralized record of their museum visits.

## Features

### 1. Museum Directory & Exhibit Catalog
- **Searchable Museum List**: Browse through 17+ museums across India
- **State Filtering**: Filter museums by state
- **Museum Profile Pages**: Each museum has a detailed profile with:
  - Opening hours
  - Ticket prices
  - Top 5 Exhibits with photos, descriptions, periods, and significance
  - Location information

### 2. Personal Dashboard
- **Wishlist**: Save museums you want to visit
- **Visited Log**: Track museums you've visited with date stamps
- **Review Diary**: Rate your visits (1-5 stars) and write personal notes
- **Points System**: Earn points for various activities (adding to wishlist, visiting museums, writing reviews)

### 3. Smart Artifact Scanner
- **AI-Powered Recognition**: Uses TensorFlow.js and MobileNet for image recognition
- **Camera Integration**: Take photos directly or upload images
- **Instant Information**: Get detailed history cards about identified artifacts
- **Artifact Database**: Includes information about famous Indian artifacts

### 4. User Authentication
- **Sign Up**: Create a new account
- **Login/Logout**: Secure authentication system
- **User Data Persistence**: All user data is saved and maintained across sessions
- **Progress Tracking**: Points and scores are tracked for each user

## Technology Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **AI/ML**: TensorFlow.js, MobileNet
- **Authentication**: bcryptjs for password hashing
- **Data Storage**: JSON file-based storage (can be easily migrated to a database)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Modern web browser with camera access (for scanner feature)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
museum-guide-india/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication endpoints
│   │   └── user/         # User data endpoints
│   ├── dashboard/        # User dashboard
│   ├── museums/          # Museum directory and profiles
│   ├── scanner/          # Artifact scanner page
│   └── login/            # Authentication pages
├── components/           # React components
├── contexts/            # React contexts (Auth)
├── data/                # Data files (museums, users)
├── lib/                 # Utility functions
└── public/              # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user

### User Data
- `GET /api/user/wishlist?userId={id}` - Get user wishlist
- `POST /api/user/wishlist` - Add/remove from wishlist
- `GET /api/user/visited?userId={id}` - Get visited museums
- `POST /api/user/visited` - Mark museum as visited
- `GET /api/user/reviews?userId={id}` - Get user reviews
- `POST /api/user/reviews` - Add/update review
- `GET /api/user/museum-status?userId={id}&museumId={id}` - Get museum status

## Museums Included

The application includes 17 museums across India:

1. National Museum, New Delhi
2. Indian Museum, Kolkata
3. Salar Jung Museum, Hyderabad
4. Chhatrapati Shivaji Maharaj Vastu Sangrahalaya, Mumbai
5. Government Museum, Chennai
6. Calico Museum of Textiles, Ahmedabad
7. Victoria Memorial Hall, Kolkata
8. Rajasthan State Museum, Jaipur
9. Kerala Museum, Kochi
10. Birla Industrial & Technological Museum, Kolkata
11. Archaeological Museum, Hampi
12. Punjab State Museum, Chandigarh
13. Assam State Museum, Guwahati
14. Goa State Museum, Panaji
15. Bharat Bhavan, Bhopal
16. Jawahar Kala Kendra, Jaipur
17. Sarnath Museum, Varanasi

## Features in Detail

### Points System
- Add to wishlist: +10 points
- Visit a museum: +50 points
- Write a review: +25 points

### Artifact Scanner
The scanner uses TensorFlow.js with MobileNet model to identify artifacts. It includes a database of famous Indian artifacts like:
- Dancing Girl of Mohenjo-daro
- Chola Bronze Nataraja
- Lion Capital of Ashoka
- Veiled Rebecca
- And more...

## Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- Social features (share reviews, follow other users)
- Advanced search and filtering
- Museum recommendations based on interests
- Integration with Google Maps for directions
- Multi-language support
- Mobile app version

## License

This project is created for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

