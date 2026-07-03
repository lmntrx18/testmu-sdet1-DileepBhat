Feature: Notes App - Dashboard (Widget Loading, Data Accuracy, Filter/Sort, Responsive Layout)
  As a logged-in user of the Notes application
  I want the dashboard to accurately load, display, filter, sort, and adapt my notes
  So that I can reliably manage my tasks across devices

  # Sample notes used throughout (assumed pre-seeded for an authenticated test user):
  # 1. "Grocery run"              | Category: Personal | Completed: No
  # 2. "Fix leaky faucet"         | Category: Home      | Completed: No
  # 3. "Sprint planning"          | Category: Work       | Completed: Yes
  # 4. "Review PR"                | Category: Work       | Completed: No
  # 5. "Book dentist appointment" | Category: Personal   | Completed: No

  # ============================================================
  # WIDGET LOADING
  # ============================================================

  Scenario: DASH-001 - Dashboard loads all existing notes as cards after login
    Given the user is logged in with an account containing the 5 sample notes
    When the dashboard page finishes loading
    Then 5 note cards should be displayed
    And each card should show a title, description, category, and completion status

  Scenario: DASH-002 - Dashboard shows a loading indicator while notes are being fetched
    Given the user has just logged in and is being redirected to the dashboard
    When the notes API request is in flight
    Then a loading indicator (spinner or skeleton state) should be visible
    And the note cards should replace the loader once the data arrives

  Scenario: DASH-003 - Dashboard shows an empty state when the user has no notes
    Given the user is logged in with an account that has zero notes
    When the dashboard page loads
    Then no note cards should be displayed
    And an empty-state message (e.g. "No notes yet") should be shown
    And an option to create a new note should be visible

  Scenario: DASH-004 - Dashboard displays a graceful error state if notes fail to load
    Given the user is logged in
    And the notes API request fails (e.g. 500 error or network timeout)
    When the dashboard attempts to load notes
    Then an error message should be displayed instead of a blank or broken screen
    And a retry option should be available

  Scenario: DASH-005 - Newly created note appears on the dashboard without a full page reload
    Given the user is on the dashboard with the 5 sample notes visible
    When the user creates a new note titled "Renew passport"
    Then the new "Renew passport" card should appear on the dashboard immediately
    And the total note count should update to 6

  # ============================================================
  # DATA ACCURACY
  # ============================================================

  Scenario: DASH-006 - Each note card accurately reflects its stored title and description
    Given the user is on the dashboard
    When the user views the "Grocery run" card
    Then the title displayed should exactly match "Grocery run"
    And the description shown should match the note's stored description text

  Scenario: DASH-007 - Note card displays the correct category
    Given the user is on the dashboard
    When the user views the "Fix leaky faucet" card
    Then the category shown should be "Home"

  Scenario: DASH-008 - Note card displays the correct completion status
    Given the user is on the dashboard
    When the user views the "Sprint planning" card
    Then the completion status should show as "Completed"
    And the "Review PR" card should show as "Incomplete" / "Pending"

  Scenario: DASH-009 - Toggling completion status on a card updates persisted data
    Given the user is on the dashboard
    And "Grocery run" is currently marked incomplete
    When the user marks "Grocery run" as complete
    Then the card should visually update to show "Completed"
    And reloading the dashboard should still show "Grocery run" as completed

  Scenario: DASH-010 - Editing a note updates the card's displayed data accurately
    Given the user is on the dashboard
    When the user edits "Book dentist appointment" and changes its category from "Personal" to "Health"
    Then the card should immediately reflect "Health" as the category
    And no other note's data should be affected

  Scenario: DASH-011 - Deleting a note removes its card and does not affect other notes' data
    Given the user is on the dashboard with the 5 sample notes visible
    When the user deletes "Review PR"
    Then the "Review PR" card should no longer be displayed
    And the remaining 4 notes should retain their original title, category, and status

  # ============================================================
  # FILTER / SORT BEHAVIOR
  # ============================================================

  Scenario: DASH-012 - Filtering by category "Work" shows only matching notes
    Given the user is on the dashboard with the 5 sample notes visible
    When the user applies the category filter "Work"
    Then only "Sprint planning" and "Review PR" should be displayed
    And notes from other categories should be hidden

  Scenario: DASH-013 - Filtering by category "Personal" shows only matching notes
    Given the user is on the dashboard
    When the user applies the category filter "Personal"
    Then only "Grocery run" and "Book dentist appointment" should be displayed

  Scenario: DASH-014 - Filtering by completion status "Completed" shows only completed notes
    Given the user is on the dashboard
    When the user filters by status "Completed"
    Then only "Sprint planning" should be displayed

  Scenario: DASH-015 - Filtering by completion status "Incomplete" shows only pending notes
    Given the user is on the dashboard
    When the user filters by status "Incomplete"
    Then "Grocery run", "Fix leaky faucet", "Review PR", and "Book dentist appointment" should be displayed
    And "Sprint planning" should be hidden

  Scenario: DASH-016 - Combining category and status filters narrows results correctly
    Given the user is on the dashboard
    When the user filters by category "Work" and status "Incomplete"
    Then only "Review PR" should be displayed

  Scenario: DASH-017 - Clearing filters restores the full note list
    Given the user has applied a category filter showing only "Work" notes
    When the user clears all filters
    Then all 5 sample notes should be displayed again

  Scenario: DASH-018 - Filter with no matching results shows an empty state
    Given the user is on the dashboard
    When the user filters by a category that has no notes (e.g. "Finance")
    Then no note cards should be displayed
    And a "no notes match this filter" message should be shown

  Scenario: DASH-019 - Sorting notes alphabetically by title (A-Z)
    Given the user is on the dashboard with the 5 sample notes visible
    When the user sorts by title ascending
    Then the notes should appear in order: "Book dentist appointment", "Fix leaky faucet", "Grocery run", "Review PR", "Sprint planning"

  Scenario: DASH-020 - Sorting notes alphabetically by title (Z-A)
    Given the user is on the dashboard
    When the user sorts by title descending
    Then the notes should appear in reverse alphabetical order

  Scenario: DASH-021 - Sorting notes by most recently created/updated
    Given the user is on the dashboard
    And "Fix leaky faucet" was the most recently edited note
    When the user sorts by "last updated"
    Then "Fix leaky faucet" should appear first in the list

  Scenario: DASH-022 - Sort order persists correctly when combined with an active filter
    Given the user has filtered by category "Work"
    When the user then sorts the filtered results by title ascending
    Then only "Review PR" and "Sprint planning" should be shown
    And they should appear in alphabetical order relative to each other

  # ============================================================
  # RESPONSIVE LAYOUT
  # ============================================================

  Scenario: DASH-023 - Dashboard displays a multi-column grid on desktop viewport
    Given the user is on the dashboard using a desktop viewport (e.g. 1440px wide)
    When the page renders
    Then note cards should be arranged in a multi-column grid layout
    And all card content (title, description, category, status) should be fully visible without truncation

  Scenario: DASH-024 - Dashboard reflows to fewer columns on tablet viewport
    Given the user is on the dashboard using a tablet viewport (e.g. 768px wide)
    When the page renders
    Then the note cards should reflow into a reduced-column grid
    And no horizontal scrolling should be required

  Scenario: DASH-025 - Dashboard displays a single-column stacked layout on mobile viewport
    Given the user is on the dashboard using a mobile viewport (e.g. 375px wide)
    When the page renders
    Then note cards should stack in a single column
    And filter/sort controls should remain accessible (e.g. via a collapsed menu or visible toolbar)

  Scenario: DASH-026 - Long note titles/descriptions do not break the card layout on small screens
    Given the user is on a mobile viewport
    And a note has an unusually long title or description
    When the dashboard renders that note's card
    Then the text should wrap or truncate gracefully (e.g. with ellipsis)
    And the card should not overflow or break the page layout

  # ============================================================
  # ADDITIONAL EDGE / NEGATIVE CASES
  # ============================================================

  Scenario: DASH-027 - User cannot view another user's notes on their dashboard
    Given two separate user accounts each have their own notes
    When "User A" logs in and views the dashboard
    Then only "User A"'s own notes should be displayed
    And none of "User B"'s notes should appear

  Scenario: DASH-028 - Rapid consecutive filter changes do not cause stale or duplicate data
    Given the user is on the dashboard
    When the user rapidly switches between category filters "Work", "Personal", and "Home" in quick succession
    Then the final displayed results should match only the last selected filter
    And no duplicate or leftover cards from prior filters should remain

  Scenario: DASH-029 - Dashboard handles a large number of notes without breaking pagination/scroll
    Given the user's account has 100+ notes
    When the dashboard loads
    Then notes should load via pagination or infinite scroll without freezing the page
    And filter/sort actions should still return correct results across the full note set

  Scenario: DASH-030 - Special characters and emojis in note titles render correctly on cards
    Given the user creates a note titled "Fix faucet 🚰 & clean sink <urgent>"
    When the dashboard displays this note's card
    Then the title should render exactly as entered, correctly escaped
    And no HTML injection or broken rendering should occur

  Scenario: DASH-031 - Session expiry during dashboard use redirects the user appropriately
    Given the user is actively viewing the dashboard
    And the session/token expires mid-session
    When the user attempts to filter, sort, or edit a note
    Then the action should fail gracefully
    And the user should be redirected to the login page with a session-expired message