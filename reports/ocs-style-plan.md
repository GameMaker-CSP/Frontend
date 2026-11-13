# OCS styling consolidation — 2026-11-13

## Goal and scope

Use the repository's existing OCS components for UESL community pages, navigation,
account pages, accessibility tools, and social dialogs. Remove the separate UESL
skin and static inline CSS rather than relocating it. Preserve page content,
account/API contracts, social storage keys, and all three builders.

## Plan

1. Snapshot the current dirty tree and map style consumers (complete).
2. Share one OCS site layout and navigation; replace UESL page classes with OCS.
3. Reuse the account flow, native dialogs, and OCS controls for social/accessibility.
4. Delete obsolete Sass entry points; retain existing accessibility behavior rules
   and game-specific layout/overlay styles in the existing shared bundles.
5. Build, run the frontend checks, inspect desktop/mobile and exercise controls.
6. Record stylesheet reduction, verification, and remaining scope limits.

## Baseline

Snapshot: `/private/tmp/uesl-ocs-uniform-20261113/before`.
The working tree already contained extensive unrelated and overlapping edits;
preserve those and measure this task against the snapshot, not HEAD.
UESL shell: 1,471 Sass lines. Built site skin: 59,987 bytes; app skin: 6,565 bytes.
Core OCS: 17,965 bytes; builder bundle: 75,003 bytes.

## Verification boundaries

Do not publish, send messages, or change backend data during UI checks. Verify
social dialog opening, empty states and form controls without sending requests.
The existing direct/group chat storage is local to the browser; styling work does
not turn it into a deployed multi-device messaging service.

## Complete

All six steps completed. Final metrics and validation are recorded in
reports/verification.md and reports/progress.md; retained behavior and the
non-blocking browser-console observation are recorded in reports/limitations.md.
No production deployment, GitHub update, commit, or push performed.
