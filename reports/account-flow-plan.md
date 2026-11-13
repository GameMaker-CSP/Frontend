# Account flow and main integration

1. Replace public Survey/Profile tabs with a signed-in account menu, reusing OCS components.
2. Read saved preferences after successful login: prompt for missing answers; open profile settings for completed accounts. Protect direct profile/survey visits.
3. Verify account isolation, returning users, logged-out access, responsive layout, and existing site tests. No new CSS/Sass.
4. Commit pending frontend visibility, account-flow and backend preparation changes in focused commits. Merge the frontend branch into main while preserving existing main commits; retest the merge, then push both main branches.

Deployment remains paused. No private configuration or runtime data belongs in commits.
