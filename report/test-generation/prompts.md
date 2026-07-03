1. For further tasks, any specific website is not mentioned, what should i do?
2. For automationexercise.com the login page doesnt have a lot of features to test such as forgot password, session expiry, brute-force lockout.
(I decided to go with practice.expandtesting.com)
3.  As a tester for the following website https://practice.expandtesting.com/notes/app, write test cases for the login module of the website, It has a email/password authentication and a registration flow.
Requirements:
-Cover registration, valid login, invalid credentials, forgot password, session expirt and brute-force lockout.
-Give it in a Gherkin format
-For each test case include: ID, title, preconditions, steps, expected results
-Include any other edge cases and negative paths
4. Now test the dashboard module of the same website, https://practice.expandtesting.com/notes/app. After login, users land on the dashboard page where each note acts as a widget/card showing title, description, category and completion status.
Requirements:
-Cover Widget loading, data accuracy, filter/sort behavior, responsive layout
-Give it in a gherkin format
-For each test case include: ID, title, preconditions, steps, expected results
-Use the sample existing notes wherever it is relevant (Grocery run, Fix leaky faucet, Sprint planning, Review PR, book dentist appointment)
-Include any other edge cases and negative paths
5. As a tester testing the api layer of https://practice.expandtesting.com/notes/api/api-docs/#/ generate related test cases
Requirements:
-Cover Auth token validation, CRUD operations, error handling (4xx/5xx), rate limiting, schema validation.
-Format should be in json with fields such as id, title, method, endpoint, headers, request body, expected status, expected response, notes etc
-Include negative cases
6. Ok now write actual tests for the following test cases in the login module:
LOGIN-001 - Successful registration with valid details
LOGIN-007 - Successful login with valid credentials
LOGIN-009 - Login fails with incorrect password
LOGIN-010 - Login fails with an unregistered email (deliberately fail this test case for task 3)
7. Ok now similarly write test cases for the dashboard functionality for the following test cases:
DASH-001 - Dashboard loads all existing notes as cards after login
DASH-006 - Each note card accurately reflects its stored title and description
DASH-012 - Filtering by category "Work" shows only matching notes
the login email is asdsa@gmail.com and password is demon1245
8. Instead of trying to match the category name in this function just match the background colour instead (which is either that specific category or completed category)
the bg color for work is rgb(92, 107, 192) and completed is rgba(40, 46, 41, 0.6)
9. Ok now similarly write test cases for api for the following test cases: 
"id": "API-001",
"id": "API-011",
"id": "API-012",
"id": "API-018",
10. For task 3, I'd like to go with the Failure Explainer to automatically send the failure context to an LLM and receive a brief explanation that helps identify the likely cause of the failure. How would you go about implementing it?
