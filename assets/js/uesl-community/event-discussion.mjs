import { button, node, request, timestamp } from './event-api.mjs';

export function mountDiscussion(eventId) {
  const $ = id => document.getElementById(id);
  const list = $('discussion-comments');
  const status = $('discussion-status');
  const form = $('comment-form');
  const text = form.elements.text;
  const submit = form.querySelector('[type=submit]');
  const cancel = $('cancel-comment-action');
  const feedback = $('comment-feedback');
  const more = $('comments-more');
  const path = `/${eventId}/comments`;
  const drafts = new Map();
  let records = [];
  let cursor = null;
  let mode = { key: 'new' };
  let member = true;
  let busy = false;
  let loading = false;

  function switchMode(next) {
    drafts.set(mode.key, text.value);
    mode = next;
    text.value = drafts.get(next.key) ?? next.text ?? '';
    $('comment-action').textContent = next.edit ? 'Edit your comment' : next.parent ? `Reply to ${next.author}` : 'Add a comment';
    cancel.hidden = next.key === 'new';
    submit.textContent = next.edit ? 'Save changes' : next.parent ? 'Post reply' : 'Post comment';
    text.focus();
  }

  const chooseMode = next => { if (!busy) switchMode(next); };

  function render() {
    const thread = new Map();
    const elements = [];
    for (const comment of records) {
      const card = node('article', '', 'ocs__card ocs__stack');
      card.setAttribute('aria-label', comment.removed ? 'Removed comment' : `Comment by ${comment.author}`);
      const meta = node('div', '', 'ocs__links');
      const time = node('time', timestamp(comment.created_at));
      time.dateTime = comment.created_at;
      meta.append(node('strong', comment.removed ? 'Comment removed' : comment.author), time);
      if (comment.edited && !comment.removed) meta.append(node('span', 'Edited', 'ocs__caption'));
      card.append(meta);
      if (!comment.removed) {
        const message = node('div', '', 'ocs__description');
        for (const line of comment.text.split(/\r?\n/)) message.append(node('p', line));
        card.append(message);
        const actions = node('div', '', 'ocs__links');
        if (member && !comment.parent_id) actions.append(button('Reply', () => chooseMode({
          key: `reply:${comment.id}`, parent: comment.id, author: comment.author
        })));
        if (member && comment.can_edit) actions.append(button('Edit', () => chooseMode({
          key: `edit:${comment.id}`, edit: comment.id, text: comment.text
        })));
        if (member && comment.can_remove) actions.append(button(comment.can_edit ? 'Remove' : 'Moderate: remove',
          () => remove(comment.id), 'ocs__btn alert-red'));
        if (actions.childElementCount) card.append(actions);
      }
      const replies = node('div', '', 'ocs__stack');
      if (comment.parent_id && thread.has(comment.parent_id)) thread.get(comment.parent_id).append(card);
      else {
        card.append(replies);
        thread.set(comment.id, replies);
        elements.push(card);
      }
    }
    list.replaceChildren(...elements);
  }

  async function load(reset = false) {
    if (loading) return;
    loading = true;
    const previousCount = records.length;
    status.textContent = 'Loading discussion…';
    more.disabled = true;
    try {
      let after = reset ? null : cursor;
      const result = reset ? [] : [...records];
      do {
        let page;
        const suffix = after ? `?after=${after}` : '';
        try {
          page = await request(`${path}${member ? '/member' : ''}${suffix}`);
        } catch (error) {
          if (!member || ![401, 403].includes(error.status)) throw error;
          member = false;
          $('discussion-login').hidden = false;
          form.hidden = true;
          page = await request(`${path}${suffix}`);
        }
        result.push(...page.comments);
        after = page.next;
      } while (reset && after && result.length < previousCount);
      records = result;
      cursor = after;
      form.hidden = !member;
      render();
      status.textContent = records.length ? `${records.length} ${records.length === 1 ? 'comment' : 'comments'} shown.` : 'No comments yet. Start the conversation.';
      more.textContent = 'Load more comments';
      more.hidden = !cursor;
      more.onclick = () => load();
    } catch {
      status.textContent = 'Could not load this discussion.';
      more.textContent = 'Retry discussion';
      more.hidden = false;
      more.onclick = () => load(reset);
    } finally {
      loading = false;
      more.disabled = false;
    }
  }

  function setBusy(value) {
    busy = value;
    text.readOnly = value;
    submit.disabled = value;
    cancel.disabled = value;
  }

  cancel.addEventListener('click', () => switchMode({ key: 'new' }));
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    feedback.textContent = 'Saving comment…';
    try {
      const posted = mode.edit ? await request(`${path}/${mode.edit}`, 'PUT', { text: text.value }) :
        await request(path, 'POST', { text: text.value, parent_id: mode.parent ?? null });
      const message = mode.edit ? 'Changes saved.' : 'Comment posted.';
      text.value = '';
      switchMode({ key: 'new' });
      feedback.textContent = message;
      await load(true);
      if (posted?.id && cursor && !records.some(record => record.id === posted.id)) {
        feedback.textContent = 'Comment posted. Use “Load more comments” to see it in the discussion.';
      }
    } catch (error) {
      feedback.textContent = `${error.message} Your draft has been kept.`;
      if (error.status === 401) $('discussion-login').hidden = false;
    } finally {
      setBusy(false);
    }
  });

  async function remove(id) {
    if (busy || !window.confirm('Remove this comment from the event discussion?')) return;
    setBusy(true);
    feedback.textContent = 'Removing…';
    try {
      await request(`${path}/${id}`, 'DELETE');
      feedback.textContent = 'Comment removed.';
      text.focus();
      await load(true);
    } catch (error) {
      feedback.textContent = error.message;
    } finally {
      setBusy(false);
    }
  }
  load(true);
}
