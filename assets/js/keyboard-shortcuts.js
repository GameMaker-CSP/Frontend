// Keyboard shortcuts (Alt+Shift+key)
// Uses e.code so shortcuts are stable regardless of OS char remapping from Alt+Shift.

(function() {
    // Map KeyboardEvent.code → destination path
    const shortcuts = {
        'KeyH': '/',                          // Home
        'KeyP': '/profile',                   // Profile
        'KeyD': '/dashboard',                 // Dashboard
        'KeyL': '/login',                     // Login
        'KeyG': '/play/',                     // Play / Game
        'KeyC': '/gamify/character-select',   // Character Select
        'KeyS': '/stats',                     // Stats
        'KeyA': '/about/',                    // About
    };

    // Help trigger codes
    const helpCodes = new Set(['Slash', 'Period']);

    // Help overlay element (created on first use)
    let overlay = null;

    function createHelpOverlay() {
        overlay = document.createElement('dialog');
        overlay.id = 'keyboard-shortcuts-overlay';
        overlay.className = 'ocs__card';
        overlay.setAttribute('aria-labelledby', 'keyboard-shortcuts-title');
        overlay.innerHTML = `
          <div class="ocs__stack">
            <h2 id="keyboard-shortcuts-title" class="ocs__section-title">Keyboard shortcuts</h2>
            <p class="ocs__description">Press Alt + Shift + a key.</p>
            <table class="ocs__table">
              <tr><th scope="col">Key</th><th scope="col">Destination</th></tr>
              <tr><td>H</td><td>Home</td></tr><tr><td>P</td><td>Profile</td></tr>
              <tr><td>D</td><td>Dashboard</td></tr><tr><td>L</td><td>Login</td></tr>
              <tr><td>G</td><td>Play</td></tr><tr><td>C</td><td>Character select</td></tr>
              <tr><td>S</td><td>Stats</td></tr><tr><td>A</td><td>About</td></tr>
              <tr><td>?</td><td>Show this help</td></tr>
            </table>
            <form method="dialog"><button class="ocs__btn">Close</button></form>
          </div>`;
        document.body.appendChild(overlay);
    }

    function showHelp() {
        if (!overlay) createHelpOverlay();
        if (!overlay.open) overlay.showModal();
    }

    function hideHelp() { overlay?.close(); }

    function navigate(dest) {
        const baseurl = window.baseurl || '';
        let url = dest;
        if (baseurl && !url.startsWith(baseurl)) {
            url = baseurl + url;
        }
        window.location.href = url;
    }

    // Expose globally so the toolkit button can call it directly
    window.showKeyboardHelp = showHelp;

    document.addEventListener('keydown', function(e) {
        // Close help overlay on Escape
        if (e.key === 'Escape' && overlay && overlay.open) {
            hideHelp();
            e.preventDefault();
            return;
        }

        // Require Alt+Shift (no conflict with browser shortcuts)
        if (!e.altKey || !e.shiftKey) return;
        // Ignore Ctrl/Meta combos to stay out of browser shortcut space
        if (e.metaKey || e.ctrlKey) return;

        // Don't fire when typing in inputs, textareas, or code editors
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable) return;
        if (document.activeElement?.closest('.CodeMirror')) return;

        const code = e.code; // physical key — stable regardless of Alt+Shift char remapping

        // Help overlay (Shift+/ = ? on US keyboards)
        if (helpCodes.has(code)) {
            e.preventDefault();
            showHelp();
            return;
        }

        if (shortcuts[code]) {
            e.preventDefault();
            navigate(shortcuts[code]);
        }
    });
})();
