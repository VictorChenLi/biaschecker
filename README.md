# biaschecker

### Prerequisites
- **Node.js and npm**: You must have Node.js (which includes npm) installed on your computer. You can download it from [nodejs.org](https://nodejs.org/).
- **Firebase Project**: You need to create a project on the [Firebase Console](https://console.firebase.google.com/).
- **Gemini API Key**: You need an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Step-by-Step Guide

1.  **Create a Project Folder:**
    Open your terminal or command prompt and create a new folder for your project.
    ```bash
    mkdir bias-check-app
    cd bias-check-app
    ```

2.  **Initialize a Vite + React Project:**
    Run the following command to set up a new React project using Vite.
    ```bash
    npm create vite@latest . -- --template react
    ```
    When prompted, confirm to proceed. This will scaffold a new project in your current directory.

3.  **Install Dependencies:**
    Install the project's dependencies, including Firebase and Tailwind CSS.
    ```bash
    npm install
    npm install firebase react react-dom
    npm install -D tailwindcss postcss autoprefixer
    npx tailwindcss init -p
    ```

4.  **Create Project Files:**
    -   Replace the contents of `src/App.jsx` with the code from the **App.js** artifact above.
    -   Replace the contents of `package.json` with the code from the **package.json** artifact.
    -   Replace the contents of `tailwind.config.js` with the code from the **tailwind.config.js** artifact.
    -   Replace the contents of `index.html` with the code from the **index.html** artifact.
    -   Replace the contents of `src/index.css` with the following Tailwind directives:
        ```css
        @tailwind base;
        @tailwind components;
        @tailwind utilities;
        ```

5.  **Configure Firebase:**
    Open `src/App.jsx` and replace the placeholder `firebaseConfig` object with your actual Firebase project configuration credentials, which you can find in your Firebase project settings.

6.  **Set Up a Backend for Gemini API:**
    For security, you should not call the Gemini API directly from the frontend with your API key. The provided code assumes you have a backend proxy. You will need to create a simple server (e.g., using Node.js/Express) that receives requests from your React app and forwards them to the Gemini API, adding your secret API key on the server-side.

7.  **Run the Development Server:**
    Start the local development server.
    ```bash
    npm run dev
    ```
    Your application should now be running, and you can open it in your browser at the local address provided (usually `http://localhost:5173`).
