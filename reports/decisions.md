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
