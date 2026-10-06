# Starter decisions

- 2026-10-05: build on the organization's existing guided flow at `b7b506f53`.
- Preserve the inherited `{game, nextId}` envelope and unknown fields.
- Keep the first configuration slice limited to the existing 40-unit title field.
  Use dependency-free modules and Node's built-in test runner.
- Agree on UI integration and accessibility persistence with the affected owners
  before changing those contracts.
- The title adapter copies only its two wrappers and shares unchanged nested
  data. It accepts parsed envelopes and leaves storage and live-state mutation
  to the existing editor. Envelope guards are not full level-data validation.

- 2026-10-06: preserve the individual starter commit history with a merge.
  Use a separate locked local Ruby bundle to keep the inherited hosting setup.
  Load the existing guided styles directly on the editor, independent of the
  theme's optional custom-style hooks; no visual redesign was introduced.
- Removed inherited credentials from the current tracked configuration and
  kept local environment files ignored. Existing history was not rewritten.
