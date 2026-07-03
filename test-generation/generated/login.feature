Feature: Notes App - Authentication (Registration, Login, Password Recovery, Session, Lockout)
  As a user of the Notes application
  I want to register, log in, recover my password, and be protected by session/security controls
  So that my notes remain secure and accessible only to me

  # ============================================================
  # REGISTRATION
  # ============================================================

  Scenario: LOGIN-001 - Successful registration with valid details
    # Preconditions: User is on the registration page; email is not already registered
    Given the user is on the "/notes/app/register" page
    When the user enters a unique valid name, email, and matching password/confirm password
    And the user submits the registration form
    Then the account should be created successfully
    And the user should see a registration success confirmation
    And the user should be able to proceed to login with the new credentials

  Scenario: LOGIN-002 - Registration fails with an already-registered email
    # Preconditions: An account already exists with the given email
    Given the user is on the registration page
    And an account already exists with email "existinguser@test.com"
    When the user attempts to register again using "existinguser@test.com"
    Then the registration should be rejected
    And an error message indicating the email is already in use should be displayed

  Scenario: LOGIN-003 - Registration fails when password and confirm-password do not match
    Given the user is on the registration page
    When the user enters a valid name and email
    And enters "Password123!" as the password and "Password456!" as the confirm password
    And submits the form
    Then the registration should be rejected
    And an error message indicating the passwords do not match should be displayed

  Scenario: LOGIN-004 - Registration fails with an invalid email format
    Given the user is on the registration page
    When the user enters "notanemail" in the email field
    And completes the remaining fields with valid data
    And submits the form
    Then the registration should be rejected
    And an inline validation error for invalid email format should be displayed

  Scenario: LOGIN-005 - Registration fails when required fields are left empty
    Given the user is on the registration page
    When the user submits the form without entering a name, email, or password
    Then the registration should be rejected
    And required-field validation errors should be displayed for each empty field

  Scenario: LOGIN-006 - Registration fails when password does not meet complexity rules
    Given the user is on the registration page
    When the user enters a valid name and email
    And enters "123" as the password
    And submits the form
    Then the registration should be rejected
    And an error indicating the password does not meet minimum complexity requirements should be displayed

  # ============================================================
  # VALID LOGIN
  # ============================================================

  Scenario: LOGIN-007 - Successful login with valid credentials
    # Preconditions: User has a registered, active account
    Given the user is on the "/notes/app/login" page
    And the user has a registered account with email "validuser@test.com" and password "ValidPass123!"
    When the user enters the correct email and password
    And clicks the "Login" button
    Then the user should be redirected to the notes dashboard
    And the user's name or email should be visible confirming an authenticated session

  Scenario: LOGIN-008 - Login persists after page refresh (valid session)
    Given the user is logged in with a valid session
    When the user refreshes the page
    Then the user should remain logged in
    And the notes dashboard should still be accessible without re-entering credentials

  # ============================================================
  # INVALID CREDENTIALS
  # ============================================================

  Scenario: LOGIN-009 - Login fails with incorrect password
    Given the user is on the login page
    And the user has a registered account with email "validuser@test.com"
    When the user enters "validuser@test.com" and an incorrect password
    And clicks the "Login" button
    Then the login should be rejected
    And an "invalid email or password" error message should be displayed
    And the user should remain on the login page

  Scenario: LOGIN-010 - Login fails with an unregistered email
    Given the user is on the login page
    When the user enters an email that has never been registered
    And enters any password
    And clicks the "Login" button
    Then the login should be rejected
    And a generic "invalid email or password" error should be displayed (not revealing whether the email exists)

  Scenario: LOGIN-011 - Login fails with empty email and/or password fields
    Given the user is on the login page
    When the user clicks the "Login" button without entering an email or password
    Then the login should be rejected
    And required-field validation errors should be displayed

  Scenario: LOGIN-012 - Login is case-insensitive/sensitive for email as per app behavior
    Given the user has a registered account with email "ValidUser@test.com"
    When the user logs in using "validuser@test.com" (different casing) with the correct password
    Then the login should succeed or fail consistently with the application's documented email-casing policy
    # Edge case: flags a real ambiguity worth confirming with the dev team

  # ============================================================
  # FORGOT PASSWORD
  # ============================================================

  Scenario: LOGIN-013 - Successful password reset request for a registered email
    Given the user is on the "forgot password" page
    And the user has a registered account with email "validuser@test.com"
    When the user submits "validuser@test.com" for password reset
    Then a confirmation message indicating a reset link has been sent should be displayed
    And a password reset email should be dispatched to that address

  Scenario: LOGIN-014 - Password reset request for an unregistered email
    Given the user is on the "forgot password" page
    When the user submits an email that is not registered
    Then a generic confirmation message should still be displayed (to avoid leaking account existence)
    And no reset email should actually be sent

  Scenario: LOGIN-015 - Password reset link successfully updates the password
    Given the user has requested a password reset and received a valid reset link
    When the user opens the link and submits a new valid password
    Then the password should be updated successfully
    And the user should be able to log in with the new password
    And the old password should no longer be valid

  Scenario: LOGIN-016 - Expired or already-used reset link is rejected
    Given the user has a password reset link that has expired or was already used
    When the user attempts to use the link to set a new password
    Then the request should be rejected
    And an error message indicating the link is invalid or expired should be displayed

  # ============================================================
  # SESSION EXPIRY  [ASSUMPTION: exact TTL/mechanism not confirmed against this app]
  # ============================================================

  Scenario: LOGIN-017 - Session expires after prolonged inactivity
    # Assumption: app enforces a session/token TTL; confirm actual duration before automating
    Given the user is logged in
    And the session has been inactive beyond the configured expiry window
    When the user attempts to perform an authenticated action (e.g. view notes)
    Then the user should be redirected to the login page
    And a "session expired, please log in again" message should be displayed

  Scenario: LOGIN-018 - Expired session token is rejected on API calls
    # Assumption: applies if the app uses JWT/bearer tokens for its notes API
    Given the user holds an expired auth token
    When a request is made to a protected API endpoint using that token
    Then the API should respond with 401 Unauthorized
    And the client should redirect the user to re-authenticate

  # ============================================================
  # BRUTE-FORCE LOCKOUT  [ASSUMPTION: lockout policy not confirmed against this app]
  # ============================================================

  Scenario: LOGIN-019 - Account is locked after repeated failed login attempts
    # Assumption: app enforces an attempt threshold (e.g. 5 failed attempts); confirm actual policy
    Given the user has failed to log in 4 times consecutively with an incorrect password
    When the user submits an incorrect password for the 5th consecutive time
    Then the account should be locked
    And a message indicating the account is temporarily locked should be displayed

  Scenario: LOGIN-020 - Locked account rejects even correct credentials until lockout period ends
    Given the account is currently in a locked state due to failed attempts
    When the user attempts to log in with the correct password
    Then the login should still be rejected
    And a message indicating the account is locked and to try again later should be displayed

  Scenario: LOGIN-021 - Failed attempt counter resets after a successful login
    Given the user has 2 recorded failed login attempts, below the lockout threshold
    When the user logs in successfully with the correct password
    Then the failed attempt counter should reset to zero
    And subsequent failed attempts should be counted fresh from zero

  # ============================================================
  # ADDITIONAL EDGE / NEGATIVE CASES
  # ============================================================

  Scenario: LOGIN-022 - Login form rejects SQL injection-style input
    Given the user is on the login page
    When the user enters "' OR '1'='1" as both email and password
    And clicks "Login"
    Then the login should be rejected as invalid credentials
    And no unauthorized access or application error should occur

  Scenario: LOGIN-023 - Login form handles leading/trailing whitespace in email
    Given the user has a registered account with email "validuser@test.com"
    When the user enters "  validuser@test.com  " (with whitespace) and the correct password
    Then the application should trim whitespace and log the user in successfully
    # Alternative expected result if app does not trim: login is rejected — confirm actual behavior

  Scenario: LOGIN-024 - Logout invalidates the session immediately
    Given the user is logged in
    When the user clicks "Logout"
    Then the session/token should be invalidated
    And attempting to access the notes dashboard afterward should redirect to the login page

  Scenario: LOGIN-025 - Concurrent sessions on two devices/browsers
    Given the user logs in from Browser A
    When the user logs in with the same credentials from Browser B
    Then the application's concurrent-session policy should apply consistently
    # Edge case: confirm whether the app allows multiple simultaneous sessions or invalidates the first