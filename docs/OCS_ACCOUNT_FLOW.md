# OCS account flow

Login `/login`, survey `/survey`, and profile `/profile` share the existing
OCS button, card, input, grid, and links classes. No new CSS or Sass is needed.
The signed-in account menu is `_data/account_menu.yml` plus
`_includes/account-menu.html`. As in OCS, a signed-out visitor sees Login;
the account menu appears after authentication and contains Profile settings
and Log out. Survey/Profile are not public tabs or login-page tabs.

Source: Open-Coding-Society/pages, commit
`35a556de938303d8cba0c17ab46007a91fadacef`, `_projects/systems/profile/`.
Reused `profile-account.js`, `profile-model.js`, `profile-personas.js`, the
account form markup, and model tests. Local adaptations: existing OCS class
names, Flask-only account saving, display name/username/email fields, UESL
question labels, and the catalogue URL. The login keeps the existing Flask
password/OTP behavior while using the same OCS formatting and API configuration.

The survey reuses OCS's selection/save mechanism, rather than creating a new
quiz engine. Its four sections are getting started, favorite games, goals,
and helpful options. Content lives in Backend/data/gamemaker_personas.json;
existing OCS category keys stay unchanged internally. New gm- aliases preserve
old catalogue rows and answers instead of silently relabeling them. School,
student-ID, classroom, grade, and superhero framing are absent from the UI.

Answers save to Flask through `/api/user/persona` and appear on `/profile`.
After login, the server's saved answers determine the next page: missing
answers open the survey, while completed accounts go to profile settings.
Direct signed-out visits to survey/profile return to login without exposing
their forms. A signed-in visit to Login goes to profile settings.
Answers are read for the authenticated account on each visit, with no shared
browser cache. Backend tests verify logout/relogin persistence and isolation
between two accounts. A loading failure is never presented as an empty survey.

The user can skip to profile or revisit preferences from profile settings.
If skipped, the missing answers are offered at the next login. Responses record interests; they do
not automatically enable accessibility settings or create multiplayer features.
Email verification during new-account signup still needs a configured mail
service. Existing-account password login works locally without mail.

Local verification: run the existing run_frontend.sh and run_backend.sh scripts.
Use the demo account, then survey, profile, save, reload, and log out.
The shared API configuration also supports the prepared Docker same-origin
proxy, but the paused production deployment was not resumed in this task.
