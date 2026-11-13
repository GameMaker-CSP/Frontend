---
layout: ocs-account
title: Your play preferences
permalink: /survey
search_exclude: true
---
<p id="accountStatus" role="status"></p>
<section class="ocs__card ocs__stack" id="surveyContent" aria-labelledby="persona" hidden>
  <p class="ocs__description">Tell us what you enjoy. Each choice saves to your account. You can skip this and change your answers later in profile settings.</p>
  <div class="ocs__links">
    <h2 class="ocs__section-title" id="persona">Make yourself at home</h2>
    <span class="ocs__status-pill" id="personaProgress">Loading…</span>
    <button type="button" class="ocs__btn" id="personaEditBtn" hidden>Change</button>
  </div>
  <div class="ocs__stack" id="personaSelectionContainer"></div>
  <a class="ocs__btn" href="{{ '/profile' | relative_url }}">Continue to profile settings</a>
</section>
<script type="module" src="{{ '/assets/js/profile/account-page.js' | relative_url }}"></script>
