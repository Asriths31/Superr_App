# Sign Up and Sign In Implementation Specifications

This document outlines the detailed validation logic, toggling mechanisms, session persistence, and navigation structures built for the registration and login flows.

---

## 1. Unified Interface Toggling
The entry routes `/register` and `/login` load the unified split-screen view in [LoginPage.jsx](file:///d:/recat/superApp/myapp/src/comp/LoginPage.jsx).

* **State**: Manages a boolean state `isSignUp` (defaults to `true`).
* **Conditional Rendering**:
  * If `isSignUp` is `true`: Renders the `<SignUp toggleView={() => setIsSignUp(false)} />` component.
  * If `isSignUp` is `false`: Renders the `<SignIn toggleView={() => setIsSignUp(true)} />` component.
* **Navigation Trigger**: Swapping happens locally inside the panel, which keeps page loading extremely fast and keeps form fields aligned with the left-hand hero graphic.

---

## 2. Sign Up (Registration) Flow
The sign-up logic is encapsulated in [SignUp.jsx](file:///d:/recat/superApp/myapp/src/comp/SignUp.jsx).

### Input Capture & Validation
When the user clicks the green **SIGN UP** button, `validateForm` executes the following checks:

| Field | Input Control | Validation Rules | Action on Failure |
| :--- | :--- | :--- | :--- |
| **Name** | Text | Cannot be blank or whitespace-only. | Shows *"Field is required"*; turns borders red. |
| **Username** | Text | Cannot be blank or whitespace-only. | Shows *"Field is required"*; turns borders red. |
| **Email** | Text | Must be non-empty and match standard format `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. | Shows *"Field is required"* or *"Invalid email address"*; turns borders red. |
| **Mobile** | Text | Must be non-empty and contain exactly 10 digits `/^\d{10}$/`. | Shows *"Field is required"* or *"Must be a 10-digit number"*; turns borders red. |
| **Password** | Password | Must be non-empty and contain at least 8 characters. | Shows *"Field is required"* or *"Password Should Be Min 8 Char"*; turns borders red. |
| **Confirm Password** | Password | Must be non-empty and match the **Password** field exactly. | Shows *"Field is required"* or *"Passwords do not match"*; turns borders red. |
| **Consent Checkbox** | Checkbox | Optional. | None (user can register without checking). |

### Session Persistence
If all fields pass validation, the user details are serialized into a JSON object and saved in local storage:
```javascript
const userData = { name, username, email, mobile, password };
localStorage.setItem('superapp_user', JSON.stringify(userData));
```
The user is then routed to `/categories` to select preferred entertainment genres.

---

## 3. Sign In (Login) Flow
The login validation logic is handled in [SignIn.jsx](file:///d:/recat/superApp/myapp/src/comp/SignIn.jsx).

### Input Capture & Validation
When the user clicks the green **SIGN IN** button, it validates:
* **Username**: Required.
* **Password**: Required, and must be at least 8 characters long.

### Authentication Checks
The component retrieves the saved user data from local storage:
1. **Registered User Found**:
   * Compares the input `username` with the stored `username`.
   * Compares the input `password` with the stored `password`.
   * If either does not match, shows *"Username does not match registered account"* or *"Incorrect password"* warnings.
2. **First-Time Tester (No Registered User Found)**:
   * To prevent testing friction in empty browser sessions, the system automatically registers a mock account with the entered credentials, saves it under the `'superapp_user'` key in local storage, and logs the session in.

### Smart Routing
On successful login:
* Evaluates onboarding categories in `'superapp_categories'`:
  * If the array contains **3 or more categories**, the user is navigated directly to the widgets panel (`/dashboard`).
  * If fewer than 3 categories are set, the user is redirected to the onboarding screen (`/categories`) to complete their profile setup.
