# BlueKa

BlueKa is a comprehensive habit tracking and identity formation application designed to help users build better habits and achieve their personal goals. It features a mobile application built with React Native (Expo) and a backend API powered by Node.js and MySQL.

## Features

-   **Identity-Based Habits:** Create habits linked to specific identities you want to cultivate.
-   **Squads:** Join or create squads to track habits together with friends or like-minded individuals.
-   **Detailed Tracking:** Log completions with energy levels, mood, and notes.
-   **Visual Progress:** View streaks and progress for each habit.
-   **Customizable:** Set frequency, reminders, and colors for your habits.

## Tech Stack

### Frontend (Mobile App)
-   **Framework:** React Native with Expo (~54.0.25)
-   **Language:** JavaScript
-   **Styling:** Tailwind CSS (NativeWind)
-   **Navigation:** React Navigation (Native Stack & Bottom Tabs)
-   **State/Storage:** React Native Async Storage
-   **Networking:** Axios

### Backend (API)
-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MySQL
-   **ORM/Driver:** mysql2
-   **Authentication:** JWT (JSON Web Tokens) & bcryptjs

## Prerequisites

-   Node.js (v18 or higher recommended)
-   npm or yarn
-   Expo Go app on your mobile device (for testing) or an emulator.
-   MySQL Server

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd BlueKa
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

## Database Setup

1.  Ensure your MySQL server is running.
2.  Create a database for the application.
3.  Configure the database connection in a `.env` file in the `backend` directory (refer to `backend/index.js` or `backend/init_db.js` for required variables, typically `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).
4.  Run the initialization script to set up the schema:
    ```bash
    cd backend
    node init_db.js
    # OR manually import schema.sql
    mysql -u <user> -p <database_name> < schema.sql
    ```

## Running the Application

### Start the Backend
```bash
cd backend
npm start
# OR for development with nodemon
npm run dev
```
The server typically runs on port 3000.

### Start the Frontend
```bash
# In the root directory
npm start
```
This will start the Expo development server. Scan the QR code with the Expo Go app on your phone or press `a` for Android emulator / `i` for iOS simulator.

## Project Structure

-   `src/`: Frontend source code (screens, components, navigation).
-   `backend/`: Backend API source code.
    -   `index.js`: Entry point for the API.
    -   `schema.sql`: Database schema definitions.
-   `assets/`: Static assets (images, fonts).
