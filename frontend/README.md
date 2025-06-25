# BrewBuzz Frontend

This repository contains the frontend code for **BrewBuzz**, a mobile app connecting coffee enthusiasts with local cafés. Built with **React Native** and powered by **Expo**, the app offers a smooth development and testing experience across Android and iOS.

---

## 🚀 Prerequisites

Ensure the following are installed on your machine before getting started:

- **Node.js** (v16+): [Download here](https://nodejs.org/)
- **npm** or **yarn**: Comes with Node.js (check with `npm -v`)
- **Expo CLI**: Install globally via  
  ```
  npm install -g expo-cli
  ```
- **Git**: Version control system  
  ```
  git --version
  ```
- **Mobile Testing Tools**:
  - **Expo Go App** (Android/iOS) – install from the Play Store or App Store
  - **Emulator** – Android Studio (AVD) or Xcode (iOS Simulator)

---

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/brewbuzz-frontend.git
cd brewbuzz-frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Start the Development Server
```bash
expo start
```

### 4. Preview the App

**Physical Device**:
- Open the **Expo Go App**
- Scan the QR code from your terminal or browser

**Using Emulator**:
- Start the emulator (AVD or iOS Simulator)
- Press `a` (Android) or `i` (iOS) in terminal

---

## 🗂️ Project Structure

```
├── api/                 # API interaction files (business, auth, etc.)
├── app/                 # Contains all screen files (organized in tabs and root screens)
│   └── (tabs)/          # Tab-based layout screens
├── assets/              # App images and icons
├── components/          # Reusable UI components like buttons, headers, etc.
├── service/             # Axios instances or other services
├── styles/              # Shared styling files
├── .env                 # Environment variables
├── app.json             # Expo configuration
├── package.json         # Project dependencies and scripts
├── README.md            # Project documentation

```

---

## ✨ Key Features

- 🗺️ Discover Local Cafés: View nearby shops with ratings, hours, and location.
- ⭐ Favorites: Save and manage your favorite cafés.
- 🛒 Cart System: Add drinks and modifiers, grouped by café.
- 👥 Dual Roles: Supports both customers and business owners.
- 🔐 Authentication: Secure login, password reset, and role-based navigation.
- 🧾 Reviews: View and leave feedback for cafés.
- 📱 Responsive UI: Styled with dynamic dimensions using `react-native-responsive-screen`.

---

## 🌐 Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_API_BASE_URL=https://your-api-url.com  
# URL Found in .env file #
```

---

## 📋 Common Commands

| Command              | Description                            |
|----------------------|----------------------------------------|
| `npm install`        | Install project dependencies           |
| `expo start`         | Start the Expo development server      |
| `expo start -c`      | Clear Metro cache & start clean        |
| `npx kill-port 8081` | Kill default Metro port if already used|

---

## 🧩 Troubleshooting

**1. Metro Bundler Not Responding**
```bash
expo start -c
```

**2. Port Already in Use**
```bash
npx kill-port 8081
```

**3. Image Errors**
Ensure all assets exist in the `assets/` folder and paths are correct.

---

