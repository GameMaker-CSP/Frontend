---
layout: null
permalink: /assets/js/portfolio-preview/config.js
---
// Only the isolated portfolio preview uses these backends.
export const baseurl = {{ site.baseurl | default: '' | jsonify }};
export const javaURI = {{ site.portfolio_spring_url | jsonify }};
export const javaWebSocketURI = {{ site.portfolio_chat_url | jsonify }};
export const pythonURI = {{ site.portfolio_flask_url | jsonify }};
export const fetchOptions = {
  credentials: 'include',
  headers: { 'Content-Type': 'application/json', 'X-Origin': 'client' }
};
