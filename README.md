# VibeSync Mobile App

A dynamic social media platform built with Expo React Native, featuring video sharing, community interactions, and real-time messaging.

## 🌟 Features

### Core Features

- **Video Feed**
  - TikTok-style vertical scrolling
  - Auto-playing videos
  - Like, comment, and share functionality
  - Video preview thumbnails

### Authentication & User Management

- Secure authentication system
- Profile management
- Account verification system
- Settings management

### Community Features

- User following/subscription system
- Content creation and sharing
- Comments and interactions
- Real-time notifications
- Direct messaging

### Premium Features

- Verified user badges
- Premium content access
- Extended upload limits

## 🛠 Technology Stack

- **Framework**: Expo React Native
- **State Management**:
  - Zustand for global state
  - React Query for server state
- **Navigation**: Expo Router
- **UI Components**: Custom themed components
- **API Integration**: Custom fetch utilities
- **Real-time Features**: Socket.IO
- **Storage**: Expo SecureStore
- **Forms**: Custom form hook with Zod validation

## 📱 App Structure

```
src/
├── app/                    # Expo Router app directory
│   ├── (auth)/            # Authentication routes
│   ├── (tabs)/            # Main app tabs
│   └── [dynamic]/         # Dynamic routes
├── components/            # Reusable components
├── constants/             # App constants and configs
├── hooks/                 # Custom hooks
├── stores/                # Zustand stores
├── types/                 # TypeScript definitions
└── utils/                 # Utility functions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Expo CLI
- iOS Simulator/Android Emulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

### Environment Setup

Create a `.env` file in the root directory:

```env
BASE_URL=your_api_url
STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## 🔒 Security Features

- JWT Authentication
- Secure token storage
- API request encryption
- Secure file uploads
- Input validation and sanitization

## 📱 Screens & Navigation

### Authentication Flow

- Login Screen
- Registration Screen
- Password Reset

### Main Tabs

- Feed Tab (Video Scrolling)
- Explore Tab
- Create Content Tab
- Community Tab
- Messages Tab

### Other Screens

- User Profile
- Settings
- Content Details
- Chat Screens
- Notifications

## 💻 Development

### Code Style

- TypeScript for type safety
- ESLint configuration
- Prettier formatting
- Husky pre-commit hooks

### Testing

```bash
# Run tests
npm test

# Run linting
npm run lint
```

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details
