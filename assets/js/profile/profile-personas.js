import { firstSentence, personaDescription, personaSections, personaTitle } from './profile-model.js';

function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

export async function initPersonas({ api, container, progress, editButton, onChange }) {
    const { pythonURI, fetchOptions } = api;
    let personas = [];
    let selected = {};
    let step = 0;

    async function load() {
        const [allResponse, mineResponse] = await Promise.all([
            fetch(api.personaURL || `${pythonURI}/api/persona`, fetchOptions),
            fetch(`${pythonURI}/api/user/personas`, fetchOptions),
        ]);
        if (!allResponse.ok) throw new Error(`the server answered ${allResponse.status}`);
        personas = await allResponse.json();
        if (!mineResponse.ok) throw new Error(mineResponse.status === 401 ? 'please sign in again' : 'your saved preferences could not be loaded');
        selected = (await mineResponse.json()).personas ?? {};
    }

    function render(moveFocus = false) {
        const sections = personaSections(personas, selected);
        const section = sections[step];
        container.replaceChildren();
        editButton.hidden = Boolean(section);
        onChange?.(sections.filter(s => s.chosen).length, sections.every(s => s.chosen));
        if (!section) {
            progress.textContent = 'Survey complete';
            const list = element('dl', 'ocs__stack');
            for (const item of sections) {
                const row = element('div');
                row.append(element('dt', 'ocs__description', item.label), element('dd', null, personaTitle(item.chosen)));
                list.append(row);
            }
            container.append(list);
            if (moveFocus) editButton.focus();
            return;
        }
        progress.textContent = `Question ${step + 1} of ${sections.length}`;
        const form = element('form', 'ocs__stack');
        const fieldset = element('fieldset', 'ocs__card ocs__stack');
        const legend = element('legend', 'ocs__section-title', section.prompt);
        legend.tabIndex = -1;
        fieldset.append(legend);
        for (const option of section.options) {
            const label = element('label', 'ocs__card ocs__toggle');
            const radio = element('input');
            Object.assign(radio, { type: 'radio', name: 'answer', value: String(option.id), required: true, checked: section.chosen?.id === option.id });
            const copy = element('span', 'ocs__stack');
            copy.append(element('strong', null, personaTitle(option)), element('small', null, firstSentence(personaDescription(option))));
            label.append(radio, copy);
            fieldset.append(label);
        }
        const actions = element('div', 'ocs__links');
        const back = element('button', 'ocs__btn', 'Back');
        back.type = 'button';
        back.disabled = step === 0;
        back.onclick = () => { step--; render(true); };
        const save = element('button', 'ocs__btn accent fill', step === sections.length - 1 ? 'Save and finish' : 'Save and continue');
        save.disabled = !section.options.length;
        const status = element('p', 'ocs__description', section.options.length ? '' : 'Choices are unavailable. Reload to try again.');
        status.setAttribute('role', 'status');
        actions.append(back, save);
        form.append(fieldset, actions, status);
        form.onsubmit = async event => {
            event.preventDefault();
            if (save.disabled) return;
            const id = Number(new FormData(form).get('answer'));
            fieldset.disabled = back.disabled = save.disabled = true;
            status.textContent = 'Saving…';
            try {
                const response = await fetch(`${pythonURI}/api/user/persona`, {
                    ...fetchOptions, method: 'POST', body: JSON.stringify({ persona_id: id }),
                });
                if (!response.ok) throw new Error('Save failed');
                selected[section.key] = { persona_id: id };
                step++;
                render(true);
            } catch {
                status.textContent = 'Your answer could not be saved. Try again.';
                fieldset.disabled = save.disabled = false;
                back.disabled = step === 0;
            }
        };
        container.append(form);
        if (moveFocus) legend.focus();
    }

    editButton.onclick = () => { step = 0; render(true); };
    try {
        await load();
        const sections = personaSections(personas, selected);
        const first = sections.findIndex(section => !section.chosen);
        step = first < 0 ? sections.length : first;
        render();
    } catch {
        progress.textContent = 'Unavailable';
        container.textContent = 'Your preferences could not be loaded. Reload to try again.';
    }
}
