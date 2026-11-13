export const topics = Object.freeze({
  event: 'Upcoming UESL events', party: 'UESL party or venue inquiry',
  tour: 'UESL tour request', enrollment: 'UESL enrollment question', general: 'UESL question',
});

export function makeInquiry(values) {
  const topic = Object.hasOwn(topics, values.topic) ? values.topic : 'general';
  const recipient = topic === 'party' ? 'matthew@unifiedesl.com' : 'services@unifiedesl.com';
  const subject = topics[topic];
  const lines = ['Hello UESL team,', '', values.message.trim(), '',
    `Name: ${values.name.trim()}`, `Reply email: ${values.email.trim()}`];
  for (const [key, label] of [['date', 'Preferred date'], ['size', 'Group size'], ['place', 'City or venue']]) {
    if (values[key]?.trim()) lines.push(`${label}: ${values[key].trim()}`);
  }
  const body = lines.join('\n');
  return { recipient, subject, body, href: `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` };
}

if (typeof document !== 'undefined') {
  const form = document.getElementById('uesl-inquiry');
  const result = document.getElementById('inquiry-result');
  const status = document.getElementById('inquiry-status');
  form.classList.remove('ocs__hidden');
  const topic = new URLSearchParams(window.location.search).get('topic');
  if (Object.hasOwn(topics, topic)) form.elements.topic.value = topic;
  form.addEventListener('input', () => {
    result.classList.add('ocs__hidden');
    status.textContent = '';
    document.getElementById('inquiry-email-link').removeAttribute('href');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const draft = makeInquiry(Object.fromEntries(new FormData(form)));
    document.getElementById('inquiry-preview').value = `To: ${draft.recipient}\nSubject: ${draft.subject}\n\n${draft.body}`;
    document.getElementById('inquiry-email-link').href = draft.href;
    result.classList.remove('ocs__hidden');
    status.textContent = 'Your draft is ready. Nothing has been sent.';
    document.getElementById('inquiry-preview').focus();
  });
}
