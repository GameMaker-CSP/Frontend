---
name: UESL OpenCS workspace
description: Shared OCS controls and the OpenCS workspace format inside UESL Play.
colors:
  primary: "#00d4ff"
  background: "#0d1117"
  panel: "#161b27"
  panel-mid: "#1e2535"
  text: "#e6edf3"
  muted: "#8b949e"
  border: "rgba(255,255,255,.07)"
  danger: "#ed6470"
typography:
  headline:
    fontFamily: "Inter, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-.025em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.2rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: ".875rem"
    fontWeight: 600
    lineHeight: 1.35
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: ".8125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  control: "8px"
  panel: "12px"
spacing:
  compact: "8px"
  standard: "16px"
  panel: "20px"
  section: "24px"
components:
  button:
    backgroundColor: "{colors.panel-mid}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: ".65rem 1rem"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    width: "44px"
    height: "44px"
  view-button:
    backgroundColor: "{colors.panel-mid}"
    textColor: "{colors.text}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "9px 12px"
  view-button-active:
    backgroundColor: "{colors.panel-mid}"
    textColor: "{colors.primary}"
  input:
    backgroundColor: "{colors.panel-mid}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: ".65rem .8rem"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel}"
---

# Design System: UESL OpenCS workspace

## Overview

**Creative North Star: "UESL OpenCS workspace"**

The Game Maker uses UESL's existing dark surfaces and cyan accent with the OpenCS workspace format. Named builder modes sit above a practical editing surface: setup, game preview and code. The interface keeps controls compact and legible so students can move between building and running a game.

This document covers UESL Play, the OpenCS Workbench, Open World and Racing builder frames, and the OCS primitives they share. It does not claim that every inherited historical page follows these rules. Default tokens come from `_sass/open-coding/_core.scss`; shared builder composition comes from `_builder-shell.scss`. User preferences can override theme colors, font and control radius.

**Key Characteristics:**
- One named workspace with three builder modes.
- Dark tonal panels, cyan selected states and visible keyboard focus.
- Inter controls and headings with a monospace code editor.
- Setup, preview and code columns that stack on smaller screens.

## Colors

The default palette separates surfaces through small tonal changes and reserves cyan for focus, selection and actions.

### Primary
- **Cyan accent:** selected view borders, focus outlines, links and drawing marks. Use the preference-aware accent rather than a separate builder color.

### Secondary
- **Danger rose:** destructive-action borders and barrier markings. Keep it tied to meaning rather than decorating ordinary panels.

### Neutral
- **Deep background:** page and code-editor background.
- **Panel:** setup, preview and code containers.
- **Raised control surface:** form controls and selected mode backgrounds.
- **Light text:** headings, labels and primary content.
- **Muted text:** context, secondary controls and status descriptions.
- **Quiet border:** panel edges and section dividers.

**The Shared Accent Rule.** All three builder frames use the same preference-aware accent for selected controls and keyboard focus.

## Typography

**Display Font:** Inter, with sans-serif fallback.
**Body Font:** Inter, with sans-serif fallback; builder content respects the selected preference font.
**Label/Mono Font:** System monospace for source code.

The hierarchy is compact: a bold page heading, semibold workspace titles and controls, then regular body text. The code editor uses a smaller monospace size and open line spacing. The frontmatter records the default roles; the page heading reduces on narrow screens.

## Layout

Play has a centered workspace with a maximum width (1600px), desktop side padding (28px) and room below the fixed UESL navigation. Builder modes share one tab row and a short context row. The standalone builder frame has its own return link; embedded frames omit that extra navigation.

Desktop composition places setup on the left (280px), with preview and code sharing the remaining width in a ratio (1.15:1). Panel gaps use the standard spacing token. Game / Code / Split controls and Run / Stop remain outside the panels they can hide. The setup panel can collapse without removing the workspace controls.

At the intermediate breakpoint (1100px), preview and code stack. At the narrow breakpoint (900px), setup also stacks and the Play gutter reduces (16px). At the compact breakpoint (540px), the heading stacks and tabs share the available width. Setup lists scroll within their panels so long forms do not force oversized columns.

**The One Workspace Rule.** Keep the same setup, preview, code and view-control arrangement across all three builders.

## Elevation & Depth

Workspace panels use tonal layers and thin borders, with no resting card shadow or backdrop blur. Transient workbench feedback can use a small shadow to separate a message from the controls below it. The existing UESL navigation retains its translucent treatment; this is not a site-wide ban on translucency or shadows.

**The Flat Workspace Rule.** Use panel tone and borders to separate persistent editing regions; reserve floating depth for temporary feedback.

## Shapes

Controls use gently rounded corners and panels use a slightly larger radius, as recorded in the frontmatter. Borders are thin (1px). Icon controls are square (44px) with visible icons (20px); text controls have a minimum height (44px). Keep native range, checkbox and color inputs recognizable. Game-specific overlays retain the shapes needed by their gameplay.

## Components

### Buttons

OCS buttons are compact, bordered controls with semibold labels. Standard buttons use the raised control surface; utility icons can use a transparent background. Hover adds the accent border. Keyboard focus uses an accent outline (3px) with an offset (3px). Disabled controls reduce opacity and use the disabled cursor. Workspace state transitions are short (150ms) and stop under reduced-motion preferences.

### Cards / Containers

Setup, preview and code containers use the panel surface and panel radius. Setup cards use the panel padding token, reduced to standard padding on compact screens. Preview and editor headers use a dividing border. Keep the canvas and code area visually connected to their own header.

### Inputs / Fields

Text inputs and selects use the raised control surface, quiet border and control radius. Labels remain adjacent and associated with the field. Focus matches the button outline. Preserve range sliders, checkboxes and color pickers for their corresponding value types.

### Navigation

Builder modes appear as a single bordered tab row with explicit names. The selected tab gains the raised surface and accent border. Keyboard navigation uses arrows, Home and End, with one tab in the normal tab order. Game / Code / Split controls use the same border-and-accent language inside each builder.

### Game workspace

The preview and code editor have matched desktop panel heights. Their shared toolbar keeps Run / Stop available in every view. Switching builder modes keeps open edits in place and stops the hidden preview. Status text and feedback remain close to the action that produced them; instructions and storage guidance sit beneath the workspace.

## Do's and Don'ts

### Do:
- **Do** reuse the shared OCS controls and preference-aware theme tokens.
- **Do** keep setup, preview and code in the same arrangement across builder modes.
- **Do** preserve visible focus, named controls and responsive stacking.
- **Do** keep Run / Stop outside the panels that view controls hide.

### Don't:
- **Don't** introduce an unrelated visual theme for one inherited builder.
- **Don't** turn gameplay colors or overlays into global interface tokens.
- **Don't** hide the only way to stop a preview when switching views.
- **Don't** assume historical pages outside this workspace conform to this document.
