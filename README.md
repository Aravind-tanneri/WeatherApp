# 🌦️ Weather App

A modern, responsive weather application built with **Vanilla JavaScript** and styled with **Tailwind CSS**. This app provides real-time weather updates, dynamic background images based on the city, and location-based weather services.

It is bundled using **Vite** for a fast and optimized development experience.



https://github.com/user-attachments/assets/2970a21a-ed66-4f23-8c6d-1dbc8a9e042f



## ✨ Features

-   **Real-Time Weather Data:** Fetches current temperature, humidity, wind speed, and rain probability.
-   **City Search:** Includes an autocomplete feature to search for cities globally.
-   **Geolocation Support:** "My Location" button to automatically fetch weather for your current position.
-   **Dynamic Backgrounds:** The background image changes dynamically based on the searched city using the Unsplash API.
-   **Glassmorphism UI:** A sleek, modern user interface with glass-effect cards.
-   **Interactive 3D Cards:** Weather detail cards feature a 3D tilt effect using `vanilla-tilt.js`.
-   **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

-   **Frontend:** HTML5, JavaScript (ES6+)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Bundler:** [Vite](https://vitejs.dev/)
-   **Libraries:**
    -   `vanilla-tilt` (for 3D card effects)

## 📡 APIs Used

This project aggregates data from several free APIs:

1.  **[Open-Meteo](https://open-meteo.com/):**
    -   *Geocoding API:* To convert city names into Latitude/Longitude.
    -   *Weather API:* To get forecast and current weather data.
2.  **[Unsplash API](https://unsplash.com/developers):**
    -   Fetches high-quality landscape photos of the searched city for the background.
3.  **[BigDataCloud](https://www.bigdatacloud.com/):**
    -   *Reverse Geocoding:* Converts your GPS coordinates (Lat/Lon) into a readable City/Country name.
4.  **[FlagsAPI](https://flagsapi.com/):**
    -   Displays the country flag for the searched location.

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

-   **Node.js** (v18 or higher recommended)
-   **npm** (Node Package Manager)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Aravind-tanneri/WeatherApp.git](https://github.com/your-username/WeatherApp.git)
    cd WeatherApp
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To create an optimized build for deployment:

```bash
npm run build
