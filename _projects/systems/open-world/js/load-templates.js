---
layout: null
---
    (function(){
        try {
            const s = document.createElement('script');
            s.src = "{{ site.baseurl }}/assets/js/GameEnginev1.2/builder/templates.js";
            s.defer = true;
            document.head.appendChild(s);
        } catch (e) { console.error('GameTemplatesV1_1 loader failed; templates.js must be available', e); }
    })();
