// Font choices and typography limits from the OCS portfolio dashboard.
const fonts = {
    System: window.SitePreferences.PRESETS['Site Default'].font,
    Roboto: "Roboto, system-ui, -apple-system, 'Segoe UI', 'Helvetica Neue', Arial",
    'Open Sans': "'Open Sans', Arial, sans-serif",
    Lato: 'Lato, Arial, sans-serif', Montserrat: 'Montserrat, Arial, sans-serif',
    Georgia: "Georgia, 'Times New Roman', Times, serif",
    'Source Code Pro': "'Source Code Pro', monospace",
};
const SEASONAL_THEMES = {
    halloween: { label: 'Halloween', bg: '#1a0f1f', text: '#f5e6d3', accent: '#ff7518', decor: ['🎃', '🦇', '👻'] },
    thanksgiving: { label: 'Thanksgiving', bg: '#2b1d0e', text: '#f3e3c3', accent: '#e58e4d', decor: ['🍂', '🦃', '🥧'] },
    christmas: { label: 'Christmas', bg: '#0f2a1d', text: '#f8f8f8', accent: '#ff8591', decor: ['❄️', '🎄', '🎁'] },
    valentines: { label: "Valentine's", bg: '#fff0f5', text: '#5a1030', accent: '#b41655', decor: ['💕', '💘', '🌹'] },
  };
const colors = ['bg', 'text', 'accent', 'selectionColor'];
export function appearance(preset, options) {
    return {...preset, ...options, font: fonts[options.fontName] || preset.font};
}

export function appearanceEditor(form, preview, generate) {
    const fields = form.elements;
    for (const name of Object.keys(fonts)) fields.fontName.add(new Option(name, name));
    function read() {
        return {...Object.fromEntries(colors.map(key => [key, fields[key].value])),
            fontName: fields.fontName.value, size: Number(fields.size.value), buttonStyle: fields.buttonStyle.value};
    }
    function update() {
        document.querySelector('#appearance-size').value = fields.size.value + ' px';
        preview(read());
    }
    function fill(preset, options = {}) {
        for (const key of colors) fields[key].value = options[key] || preset[key] || preset.accent;
        fields.size.value = options.size ?? preset.size;
        fields.fontName.value = options.fontName || Object.keys(fonts).find(name => fonts[name] === preset.font) || 'System';
        fields.buttonStyle.value = options.buttonStyle || 'rounded';
        update();
    }
    for (const key of [...colors, 'fontName', 'size', 'buttonStyle']) fields[key].addEventListener('input', update);
    const button = document.querySelector('#generate-palette');
    const status = document.querySelector('#palette-status');
    button.onclick = async () => {
        const idea = fields.paletteIdea.value.trim();
        if (!idea) { fields.paletteIdea.focus(); return; }
        button.disabled = true;
        status.textContent = 'Generating palette…';
        try {
            const palette = await generate(idea);
            if (!colors.every(key => /^#[a-f\d]{6}$/i.test(palette[key]))) throw Error();
            for (const key of colors) fields[key].value = palette[key];
            update();
            status.textContent = 'Palette ready. Review the contrast before saving.';
        } catch {
            const holiday = Object.values(SEASONAL_THEMES).find(theme => theme.label.toLowerCase() === idea.toLowerCase());
            if (holiday) {
                for (const key of colors) fields[key].value = holiday[key] || holiday.accent;
                update();
                status.textContent = 'Using the built-in ' + holiday.label + ' palette.';
            } else status.textContent = 'Palette generation is unavailable. Choose colors manually or try a holiday such as Halloween.';
        }
        finally { button.disabled = false; }
    };
    return {read, fill};
}
