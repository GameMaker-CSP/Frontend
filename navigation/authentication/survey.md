---
layout: ocs-account
title: Interest Survey
permalink: /survey
search_exclude: true
---
<p class="ocs__description">Tell us what you enjoy and what would help you get started. Choose one answer per group; your choices save automatically. You can skip this and change your answers anytime.</p>
<p id="accountStatus" role="status"></p>
<section class="ocs__card ocs__stack" id="surveyContent" aria-labelledby="persona" hidden>
  <div class="ocs__links">
    <h2 class="ocs__section-title" id="persona">Your play preferences</h2>
    <span class="ocs__status-pill" id="personaProgress">Loading…</span>
    <button type="button" class="ocs__btn" id="personaEditBtn" hidden>Change</button>
  </div>
  <div class="ocs__stack" id="personaSelectionContainer"></div>
  <a class="ocs__btn" href="{{ '/profile' | relative_url }}">Continue to profile</a>
</section>
<script type="module" src="{{ '/assets/js/profile/account-page.js' | relative_url }}"></script>
