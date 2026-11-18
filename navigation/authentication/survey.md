---
layout: ocs-account
title: Your play preferences
permalink: /survey
search_exclude: true
---
<p id="accountStatus" role="status"></p>
<section class="ocs__card ocs__stack" id="surveyContent" aria-labelledby="persona" hidden>
  <p class="ocs__description">Choose one answer per question. You can leave at any time and return to your saved answers.</p>
  <div class="ocs__links">
    <h2 class="ocs__section-title" id="persona">Play preferences survey</h2>
    <span class="ocs__status-pill" id="personaProgress">Loading…</span>
    <button type="button" class="ocs__btn" id="personaEditBtn" hidden>Edit answers</button>
  </div>
  <div class="ocs__stack" id="personaSelectionContainer"></div>
  <a class="ocs__btn" href="{{ '/profile' | relative_url }}">Go to my profile</a>
</section>
<script type="module" src="{{ '/assets/js/profile/account-page.js' | relative_url }}"></script>
