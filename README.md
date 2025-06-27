# Bias Checker

A React-based web application that analyzes topics and articles to provide balanced perspectives from both left-leaning and right-leaning viewpoints, helping users combat information bias.

## Features

- **Dual Perspective Analysis**: Get summarized viewpoints from both political perspectives
- **Article URL Support**: Analyze content directly from article URLs
- **Bias Scoring**: Receive bias analysis scores for articles
- **Multi-language Support**: Available in English and Chinese
- **History Tracking**: Save and review your analysis history
- **Real-time Updates**: Live updates using Firebase

## Prerequisites

- **Node.js v18 or higher** (required for Vite v5)
- **npm** (comes with Node.js)
- **Firebase Project**: Create a project on [Firebase Console](https://console.firebase.google.com/)
- **Gemini API Key**: Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

## Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd biaschecker

# Check Node.js version (must be v18 or higher)
node --version

# If you need to update Node.js, use nvm:
# nvm install 20
# nvm use 20

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory with your credentials:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Gemini AI Configuration
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Set Up Firebase

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one

2. **Get Configuration**:
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps" section
   - Add a web app if you haven't already
   - Copy the configuration object

3. **Enable Services**:
   - **Authentication**: Enable Anonymous sign-in
   - **Firestore Database**: Create database in test mode

4. **Update .env**: Replace placeholder values with your actual Firebase config

### 4. Run the Application

```bash
# Start development server
npm run dev
```

The application will be available at **http://localhost:5173**

## Usage

1. **Enter a Topic**: Type any topic you want to analyze (e.g., "climate change policy")
2. **Or Paste a URL**: Provide an article URL to analyze its content
3. **Get Perspectives**: Click "Get Perspectives" to receive balanced viewpoints
4. **Review Results**: View left and right perspectives, bias scores, and article summaries
5. **Check History**: Access your previous analyses from the history section

## Project Structure

```
biaschecker/
├── src/
│   ├── App.jsx           # Main React application
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── .env                  # Environment variables (not in git)
├── .gitignore           # Git ignore rules
└── README.md            # This file
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Troubleshooting

### Node.js Version Issues
If you get `crypto.getRandomValues is not a function` error:
```bash
# Check your Node.js version
node --version

# If below v18, update using nvm:
nvm install 20
nvm use 20
```

### JSX Syntax Errors
If you get JSX parsing errors:
- Ensure your React files have `.jsx` extension
- The main file should be `src/App.jsx`

### Firebase Connection Issues
- Verify your `.env` file has correct Firebase credentials
- Check that Authentication and Firestore are enabled in Firebase Console
- Ensure Firestore security rules allow read/write access

### Environment Variables Not Loading
- Restart the development server after updating `.env`
- Ensure all variables are prefixed with `VITE_`

## Technologies Used

- **React 18** - Frontend framework
- **Vite** - Build tool and development server
- **Firebase** - Authentication and database
- **Tailwind CSS** - Styling
- **Gemini AI** - AI-powered analysis
- **CORS Proxy** - URL content fetching

## Security Notes

- Never commit your `.env` file to version control
- Use environment variables for all sensitive configuration
- Consider implementing a backend proxy for API calls in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
