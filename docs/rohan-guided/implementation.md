# Guided editor improvements — issues #17, #18 and #19

## Scope and source audit

This is an AI-assisted implementation for Rohan's classroom development work, not a claim that Rohan independently authored or explained it, and not a final Create artifact. Preserve the repository's inherited attribution. Rohan should review, understand and adapt this work before claiming a personal contribution.

The checked-out `main` at `d4dd988` contains the six-step guided surface in `pages/game-maker.html`, and the starter title contract in `docs/guided-state-contract.md`. It does **not** contain the `_projects/systems/` three-builder hub described in the newer issue text. This PR deliberately improves the existing `/game-maker/` surface; it does not select a team-wide capstone, replace another builder, convert game formats or claim to resolve #10. Integration with the newer selected hub remains dependent on the team's scope decision.

## Three small changes

1. **#17 — keyboard navigation and progress.** Continue/Back moves focus to the active step heading, progress exposes `aria-current="step"`, and review includes an Edit choices button. Choices stay in the inherited `game`/`a11y` objects.
2. **#18 — background catalog.** `theme-catalog.js` stores inherited procedural background IDs and labels. `selectGuidedTheme({id, mode})` traverses the catalog, filters by supported game mode and returns a specific error for an unknown/ineligible selection. The real guided buttons are generated from this catalog and update the inherited background selector and canvas. Selected text and `aria-pressed` convey selection without relying on color. The collector flow offers space, sunset and ocean; a maze entry demonstrates the separate eligibility boundary without changing the current game format. All artwork is reused from the existing procedural draw functions; no media was imported.
3. **#19 — title validation and review.** The UI calls Adhvay's existing `configureGameTitle` helper. Invalid input has an inline, announced correction and does not replace the last valid shared title. Continue/preview/save return to the name field when it needs correction. Preview and review read the current inherited title, background and comfort settings. Save wording distinguishes local browser storage, account availability and the inherited lack of comfort persistence.

## Storyboard and return path

Start → Choose background → Customize/name → Accessibility → Preview → Review/save.
An empty name stays at Customize with “Give your game a name.”, focus on the input and the last accepted title intact. Correcting it permits Continue. Back returns to the prior step without changing the shared game. Edit choices returns from Review to Choose. Advanced editor remains accessible; returning to Guided refreshes the controls and summary from shared state. Returning from a running guided preview retains the inherited cleanup and return behavior.

## Verification

Run `node --test tests/game-maker-guided/*.test.mjs tests/api-config.test.cjs`.
The catalog cases cover three entries, ordinary/maze arguments, unknown/empty IDs, empty catalog and adding another eligible catalog entry without changing the function. Existing title/adapter cases cover blank, type, boundary, trim, unchanged input and save-envelope compatibility.

Browser verification results are recorded after the local build below. Teammate review, feedback-driven revision, the newer hub's cross-builder integration and formal eligibility are still pending. Do not close the parent issues or mark them verified from this PR alone.

### Observed local checks (October 20, 2026)

- Local Jekyll build completed; inherited duplicate-route and Sass deprecation warnings remain outside this change.
- All 22 checks passed with `node --test tests/*.test.cjs tests/game-maker-guided/*.test.mjs`.
- In the browser, Tab/Enter advanced from Start to Choose and focused the new heading. Keyboard selection of Sunset updated the shared advanced background selector.
- Empty name blocked Continue, announced the correction and focused the name field. The advanced name remained My Awesome Game. Entering `  Sunset Quest  ` accepted and trimmed the shared name.
- Calm plus high contrast appeared in the preview summary. The configured preview opened with Sunset Quest, returned to Guided, and preserved its summary.
- Review matched preview; Edit choices returned to Choose with Sunset visibly selected. Switching to the advanced editor and back retained the name, background and current step.
- No account saves, microphone/camera activation or game-format migration were needed for these checks.

The local walkthrough is developer verification, not a teammate review or an independent student-authorship claim.
