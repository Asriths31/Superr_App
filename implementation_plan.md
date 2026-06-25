# Implementation Plan - Super App Extension

This plan outlines the changes and additions required to extend the existing React + Vite + Tailwind CSS project with the requested authentication, onboarding, dashboard, and movie discovery features.

## Proposed Changes

### Core & Routing

#### [MODIFY] [App.jsx](file:///d:/recat/superApp/myapp/src/App.jsx)
* Set up state management and routing using `react-router` (v8).
* Define routes:
  * `/register` (default page, displays `SignUp` form).
  * `/categories` (Category selection page).
  * `/dashboard` (Super Dashboard).
  * `/movies` (Entertainment Discovery).
* Implement client-side route guards:
  * If a user tries to access `/categories`, `/dashboard`, or `/movies` without registering, redirect them to `/register`.
  * If they haven't selected categories, redirect them to `/categories` when accessing `/dashboard` or `/movies`.
  * If they've already registered and selected categories, redirect `/register` to `/dashboard`.

#### [MODIFY] [index.html](file:///d:/recat/superApp/myapp/index.html)
* Import Google Fonts in the `<head>` tag for premium typography:
  * `'Single Day'` (cursive, comic-style font matching the "Super app" title).
  * `'DM Sans'` or `'Inter'` (clean, modern sans-serif body font).

---

### API Layer

#### [NEW] [.env](file:///d:/recat/superApp/myapp/.env)
* Add API key environment variables (and document them for the user):
  ```env
  VITE_OPENWEATHER_API_KEY=your_openweathermap_api_key
  VITE_NEWS_API_KEY=your_newsapi_org_api_key
  VITE_OMDB_API_KEY=your_omdb_api_key
  ```

#### [MODIFY] [routes.js](file:///d:/recat/superApp/myapp/src/api/routes.js)
* Define the endpoints using the configuration keys:
  * `WEATHER_URL(lat, lon)`: OpenWeatherMap endpoint `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`.
  * `NEWS_URL`: NewsAPI endpoint `https://newsapi.org/v2/top-headlines?country=us&category=general&apiKey=${apiKey}`.
    * *Fallback*: Since NewsAPI blocks client-side CORS requests on free developer accounts, we will fallback automatically to Saurav's NewsAPI mirror (`https://saurav.tech/NewsAPI/top-headlines/category/general/in.json`) which serves the exact same JSON format without CORS restrictions.
  * `OMDB_URL(query)`: OMDB API search endpoint `https://www.omdbapi.com/?s=${query}&type=movie&apikey=${apiKey}`.
  * `OMDB_DETAILS_URL(id)`: OMDB API details endpoint `https://www.omdbapi.com/?i=${id}&plot=full&apikey=${apiKey}`.

#### [MODIFY] [asyncHandler.js](file:///d:/recat/superApp/myapp/src/api/asyncHandler.js)
* Implement a helper `apiFetch` using `axios` or standard `fetch` with built-in error handling and JSON parsing, ensuring all API requests fail gracefully without crashing the app.

#### [MODIFY] [hooks.js](file:///d:/recat/superApp/myapp/src/api/hooks.js)
* Implement clean custom React hooks for page logic:
  * `useWeather()`: Fetches OpenWeatherMap data for Delhi coordinates (`lat=28.6139, lon=77.2090`), maps conditions to user-friendly text and icons, and handles loading & error states.
  * `useNews()`: Fetches news articles (with Saurav mirror fallback if CORS blocked), manages the 2-second rotation interval, and returns the current active article.
  * `useMovies(categories)`: For each selected category, fetches movies from OMDB API using the category name as a search term (`s=category`). Includes fallbacks to cached or mock data if keys are invalid or limits are hit.
  * `useMovieDetails(movieId)`: Lazily fetches detailed movie specifications (plot, rating, release, cast) when a card is clicked to open the modal.

---

### Components

#### [MODIFY] [LoginPage.jsx](file:///d:/recat/superApp/myapp/src/comp/LoginPage.jsx)
* Update to manage a toggle state `isSignUp` (defaulting to `true` for new registration).
* Structure the page with the Figma layout:
  * **Left Side**: Large background image (`hero.png`) with text overlay "Discover new things on Superapp".
  * **Right Side**: Dark background (`#000000`).
* Render `<SignUp toggleView={() => setIsSignUp(false)} />` when `isSignUp` is true.
* Render `<SignIn toggleView={() => setIsSignUp(true)} />` when `isSignUp` is false.

#### [MODIFY] [SignUp.jsx](file:///d:/recat/superApp/myapp/src/comp/SignUp.jsx)
* Implement the registration form according to the Figma layout:
  * Title: "Super app" in green, subtitle "Create your new account".
  * **Form Fields**:
    * Name
    * Username
    * Email
    * Mobile Number
    * Checkbox for "Share my registration data with Superapp".
  * **Validation Logic**:
    * Check that Name, Username, Email, and Mobile are not empty (show "Field is required" in red if empty).
    * Email must be valid (regex check).
    * Mobile must be a 10-digit number.
    * Checkbox must be ticked (show "Check this box if you want to proceed" in red if unchecked).
    * Input borders turn red on validation error.
  * **Terms and Conditions Modal**:
    * Make the "Terms and Conditions of Use" and "Privacy Policy" links clickable.
    * When clicked, open a beautiful, readable modal popup containing dummy text for terms and conditions / privacy policies (with a "Close" or "Accept" button).
  * **Action Link**:
    * Add a link at the bottom: "Already have an account? **Log In**" which calls `toggleView()`.
  * **Submission**:
    * If valid, persist user information in `localStorage` under key `superapp_user` and redirect to `/categories`.

#### [MODIFY] [SignIn.jsx](file:///d:/recat/superApp/myapp/src/comp/SignIn.jsx)
* Adapt the current Sign In form to fit the styling and folder structure:
  * Title: "Super app" in green, subtitle "Log into your account".
  * **Form Fields**:
    * Username
    * Password
  * **Validation Logic**:
    * Username is required.
    * Password is required and must be at least 8 characters (matches the existing password validation).
  * **Action Link**:
    * Add a link at the bottom: "Don't have an account? **Register**" which calls `toggleView()`.
  * **Submission**:
    * Log the user in, checking `localStorage` for registered credentials, or create a mock session if none exists, and navigate to `/categories` (or `/dashboard` if they already have categories selected).

#### [MODIFY] [FormInput.jsx](file:///d:/recat/superApp/myapp/src/comp/FormInput.jsx)
* Enhance to support Tailwind CSS v4 styling:
  * Remove label elements in the registration form view to match Figma.
  * Implement rounded border style, dark-gray background (`bg-[#292929]`), and custom error classes.
  * Red border when `isErr` is true.

#### [NEW] [CategorySelection.jsx](file:///d:/recat/superApp/myapp/src/comp/CategorySelection.jsx)
* Implement the category onboarding page (two columns on desktop):
  * **Left Column**:
    * Title: "Super app" in green comic style.
    * Heading: "Choose your entertainment category".
    * Capsules: Displays list of currently selected categories. Each capsule is green with category name and a click-to-remove "X" icon.
    * Error Message: Shows "⚠️ Minimum 3 category required" in red if user attempts to submit or has < 3 categories selected.
  * **Right Column**:
    * Grid of 9 category cards (Action, Drama, Romance, Thriller, Western, Horror, Fantasy, Music, Fiction).
    * Cards styled with custom backgrounds and background preview stills (using high-quality movie photos from Unsplash).
    * Selection state: Selected cards display a thick green border.
  * **Navigation**:
    * "Next Page" green button in the bottom right corner.
    * Validates category count is >= 3. If valid, persists array to `localStorage` under key `superapp_categories` and navigates to `/dashboard`.

#### [NEW] [Dashboard.jsx](file:///d:/recat/superApp/myapp/src/comp/Dashboard.jsx)
* Implement the dashboard page as a custom CSS Grid:
  * **Profile Widget** (top-left, purple background `#5746AF`):
    * Avatar image (nice illustrative profile avatar).
    * Name, Email, and Username display.
    * Capsules listing all selected categories.
  * **Weather Widget** (middle-left, below profile):
    * Top row (pink background): Shows current date (`MM-DD-YYYY`) and local time (`hh:mm AM/PM`) updating in real-time.
    * Bottom row (dark blue background): Fetches current weather from Open-Meteo API using coordinate location for New Delhi (latitude=28.6139, longitude=77.2090):
      * Weather condition icon and string mapped from WMO code (e.g. Heavy rain, Sunny, Cloudy).
      * Temperature (in °C), Pressure (in hPa/mbar).
      * Wind speed (in km/h), Humidity (in %).
      * Handle loading skeleton & error fallback gracefully.
  * **Notes Widget** (middle-right, yellow background `#F3C95F`):
    * Title: "All notes".
    * Autosaving textarea. Content is synced to `localStorage` key `superapp_notes` on every keypress.
  * **News Widget** (far right, covers full height):
    * Fetch headlines from Saurav's NewsAPI mirror (`https://saurav.tech/NewsAPI/top-headlines/category/general/in.json`).
    * Large top image with dark text gradient overlay (title and date/time).
    * News paragraph content at the bottom.
    * Automatic rotation of articles every 2 seconds.
    * Handle loading skeleton and CORS-safe error fallback.
  * **Timer Widget** (bottom-left, spans 2 columns):
    * Left: Circular SVG progress ring indicating countdown progress, with time remaining text `HH:MM:SS` in the center.
    * Right: Controls for setting Hours, Minutes, and Seconds with up/down arrows.
    * salmon/pink "Start" button which toggles between "Start" and "Pause".
    * Clean sound alert (using HTML5 Audio/Web Audio API) when countdown reaches 0.
  * **Browse Button**:
    * Green pill button placed at the bottom right (below News column) to navigate to `/movies`.

#### [NEW] [Movies.jsx](file:///d:/recat/superApp/myapp/src/comp/Movies.jsx)
* Implement the Entertainment Discovery view:
  * **Header**: Green comic title "Super app" and small profile avatar linking back to the dashboard.
  * **API Fetching**:
    * Fetches standard shows from TVmaze API (`https://api.tvmaze.com/shows`).
    * Groups shows dynamically based on user's selected categories (mapping "Fiction" to "Science-Fiction", "Action" to "Action", etc.).
    * Handled loading skeleton rows and empty/error states with fallback local movies data.
  * **Movie Cards**:
    * Display movie poster, with hover zoom/scale animations.
  * **Details Modal**:
    * Clicking a card opens a modal overlay displaying full poster, title, rating, premiere date, genres list, and HTML-stripped summary.

---

### Styling

#### [MODIFY] [index.css](file:///d:/recat/superApp/myapp/src/index.css)
* Add Tailwind CSS custom themes, base resets, and helper classes:
  * Define animations (e.g. slow rotate, skeleton pulsing, hover zoom, and smooth fade-in).
  * CSS for circular countdown SVG (`stroke-dasharray` and transitions).
  * Styled scrollbars for a premium dark layout.
  * Custom font families matching the Figma designs.
  * **Color Theme Configuration**:
    * Superapp title text color: `#72DB73`
    * Input box background: `#292929`
    * Signup/signin button background: `#72DB73`
    * Category selected capsule button background: `#148A08`
    * Category card background colors:
      1. Action: `#FF5209`
      2. Drama: `#D7A4FF`
      3. Romance: `#11B800`
      4. Thriller: `#84C2FF`
      5. Western: `#902500`
      6. Horror: `#7358FF`
      7. Fantasy: `#FF4ADE`
      8. Music: `#E61E32`
      9. Fiction: `#6CD061`
  * **Loader Styles**: Add a shimmer effect class (`.shimmer`) and pulsing skeleton styles for components.

---

## Verification Plan

### Smooth UX & Loading States Check
* Simulating slow network speed (throttling to Slow 3G in Chrome DevTools) to ensure:
  * The Weather widget displays a skeleton placeholder showing pulsing circular icons instead of abruptly flashing.
  * The News widget displays a pulsing layout resembling an article card.
  * Movie sections display rows of empty, pulsing movie poster silhouettes (`animate-pulse`) that transition smoothly into actual images once loaded.
  * Main page loads use clean CSS fade-in animations to avoid visual jarring.

### Automated Tests
* Run Vite build command (`npm run build`) to ensure there are no compilation or typescript/babel compile errors.
* Validate linting rules (`npm run lint`).

### Manual Verification
1. **Registration Form**: Test empty fields, invalid emails, invalid mobile formatting, and unchecked box. Confirm that inputs change to a red border and validation errors are shown. Verify that valid submit redirects to `/categories` and saves data in `localStorage`.
2. **Category Selection**: Toggle categories. Check that selected cards have a green border. Check that capsules update live on the left, and clicking 'X' deselects them. Ensure that clicking 'Next Page' with < 3 categories displays a warning and blocks navigation. Ensure >= 3 categories saves selections to `localStorage` and navigates.
3. **Route Guards**: Attempt to navigate directly to `/dashboard` or `/movies` in a fresh browser session (or after clearing local storage). Confirm you are redirected to `/register`.
4. **Dashboard Widgets**:
   * **Profile Section**: Verify details match what was registered and selected categories are displayed.
   * **Weather Section**: Confirm actual date, live ticking time, and real-time weather details load from Open-Meteo.
   * **Notes Section**: Type notes, refresh, and check that the notes are retained.
   * **News Section**: Verify news loads and rotates automatically every 2 seconds.
   * **Timer Section**: Set a 10-second timer, click Start. Check that the countdown ticks down, the circular ring shrinks smoothly, the button toggles to Pause, and an alert sound plays when it reaches 0.
   * **Browse Button**: Verify it links to the Movies discovery page.
5. **Movies Discovery Page**:
   * Verify rows load matching selected categories.
   * Hover over cards to verify zoom animation.
   * Click a card to verify the details modal pops up, displays all movie details, and closes cleanly.
