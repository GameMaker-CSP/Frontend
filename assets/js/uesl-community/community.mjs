import {refreshEvents} from './events.mjs';
import {pythonURI, fetchOptions} from '../api/config.js';

const base = pythonURI + '/api/community';
async function request(path, method = 'GET', body) {
    const multipart = body instanceof FormData;
    const response = await fetch(base + path, {...fetchOptions, method, cache:'no-store',
        signal:AbortSignal.timeout(12000), headers: multipart ? {} : fetchOptions.headers, body: multipart ? body : JSON.stringify(body)});
    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw Error(data.message || 'Community service unavailable.');
    }
    return response.json();
}
function node(tag, text, cls) {
    const el = document.createElement(tag);
    if (text) el.textContent = text;
    if (cls) el.className = cls;
    return el;
}
function when(event) {
    return new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short',timeZone:event.timezone})
        .format(new Date(event.starts_at_utc)) + ' · ' + event.timezone;
}
function eventCard(event) {
    const card = node('article', '', 'ocs__card ocs__stack');
    card.append(node('h3',event.title),node('p',when(event) + ' · ' + event.location),
        node('p',event.description,'ocs__description'));
    return card;
}
function photoRow(photo) {
    const figure = node('figure','','ocs__stack ocs__grid-cell');
    const img = node('img','','ocs__image-frame');
    img.src = pythonURI + photo.image; img.alt = photo.alt; img.loading = 'lazy';
    figure.append(img,node('figcaption',photo.caption + ' · ' + photo.credit));
    return figure;
}
const upcoming = () => request('/events?from=' + encodeURIComponent(new Date().toISOString()));
export async function refreshCommunity(root = document) {
    await Promise.all(Array.from(root.querySelectorAll('[data-community-feed]'), async slot => {
        try {
            const isEvents = slot.dataset.communityFeed === 'events';
            const data = isEvents ? (await upcoming()).filter(e => e.state === 'published') : await request('/photos');
            const limit = Number(slot.dataset.limit) || data.length;
            slot.replaceChildren(...data.slice(0, limit).map(isEvents ? eventCard : photoRow));
            if (isEvents) refreshEvents(slot.parentElement);
        } catch {
            slot.replaceChildren(node('p','Live updates are temporarily unavailable.','ocs__description'));
        }
    }));
}
function field(form, name, label, type='text') {
    const wrap = node('label',label,'ocs__field');
    const el = node(type === 'select' ? 'select' : 'input','','ocs__input');
    if (type !== 'select') el.type = type;
    el.name = name; el.required = true;
    wrap.append(el); form.append(wrap); return el;
}
async function isStaff() {
    const response = await fetch(pythonURI + '/api/id', {...fetchOptions,cache:'no-store',signal:AbortSignal.timeout(12000)});
    return response.ok && ['Admin','Teacher'].includes((await response.json()).role);
}
export async function command(text, slot) {
    slot.replaceChildren();
    if (!['/event','/photo'].includes(text.trim().toLowerCase())) {
        slot.append(node('p','Use /event for gatherings or /photo to upload an event photo.'));
        return;
    }
    const eventMode = text.trim().toLowerCase() === '/event';
    const staff = await isStaff();
    if (eventMode) {
        const events = (await upcoming()).filter(e => e.state === 'published').slice(0,2);
        slot.append(...(events.length ? events.map(eventCard) : [node('p','No upcoming gatherings have been published.')]));
    }
    if (!staff) {
        if (!eventMode) slot.append(node('p','Sign in with a staff account to upload event photos.'));
        return;
    }
    const details = node('details'), form = node('form','','ocs__stack');
    details.open = !eventMode; details.append(node('summary',eventMode?'Publish an event':'Add an event photo'),form);
    slot.append(details);
    let submit;
    if (eventMode) {
        const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        for (const [key,label] of [['title','Event name'],['description','Description'],['location','Venue'],['event_type','Event type']]) field(form,key,label);
        field(form,'start','Starts ('+zone+')','datetime-local'); field(form,'end','Ends ('+zone+')','datetime-local');
        submit = async () => {
            const {start,end,...data} = Object.fromEntries(new FormData(form));
            return request('/events','POST',{...data,timezone:zone,state:'published',starts_at_utc:new Date(start).toISOString(),ends_at_utc:new Date(end).toISOString()});
        };
    } else {
        const select = field(form,'event_id','Event','select');
        let page = 1, batch;
        do {
            batch = await request('/staff/events?page='+page++);
            for (const e of batch) select.add(new Option(e.title+' · '+when(e),e.id));
        } while (batch.length === 50);
        if (!select.length) { form.replaceChildren(node('p','Create an event with /event first.')); return; }
        field(form,'image','Photo (up to 5 MB)','file').accept='image/jpeg,image/png,image/webp';
        field(form,'caption','Gallery caption'); field(form,'alt','Image description'); field(form,'credit','Photo credit');
        field(form,'permission','I have permission to publish this photo','checkbox').value='yes';
        submit = () => request('/events/'+select.value+'/photos','POST',new FormData(form));
    }
    const btn = node('button',eventMode?'Publish event':'Upload photo','ocs__btn accent fill');
    const status = node('p'); status.setAttribute('role','status'); form.append(btn,status);
    form.onsubmit = async event => {
        event.preventDefault(); if (btn.disabled) return; btn.disabled=true;
        try { await submit(); form.replaceChildren(node('p',eventMode?'Event published.':'Photo saved to the event.')); await refreshCommunity(); }
        catch (error) { status.textContent=error.message; btn.disabled=false; }
    };
}
