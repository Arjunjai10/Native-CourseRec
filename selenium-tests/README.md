# Selenium Testing Guide

To test the EduLearn project using Selenium, follow these steps.

## Prerequisites

1.  **Node.js**: Ensure you have Node.js installed.
2.  **Google Chrome**: The tests use Chrome via Selenium Manager.
3.  **App Running**: The app must be running in web mode.

## Setup

The following packages have been added to `devDependencies`:
- `selenium-webdriver`
- `mocha`
- `chai`

## How to Run

1.  **Start the Frontend**:
    ```powershell
    npm run web
    ```
    *Note: The tests expect the app at http://localhost:8081.*

2.  **Start the Backend**:
    ```powershell
    npm run server
    ```

3.  **Execute Tests**:
    ```powershell
    npm run test:selenium
    ```

## Test Structure

- `selenium-tests/login.test.js`: Contains a test for the Sign In page. It verifies that entering invalid credentials shows an error.
- `selenium-tests/full_project.test.js`: Comprehensive E2E test covering:
    - User Registration (Sign Up)
    - Tab Navigation (Home, Courses, Mentors, Profile)
    - Settings updates (Bio change)
    - Logout flow

## Best Practices for Selection

Since React Native Web generates dynamic CSS classes, use these strategies for finding elements:
- `By.xpath("//input[@placeholder='Email Address']")`
- `By.xpath("//*[text()='Sign In']")`
- `By.css("[aria-label='Submit']")` (if `accessibilityLabel` is used in JSX)
