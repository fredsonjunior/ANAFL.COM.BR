(function(){
    // Run DOM behaviors after DOM is ready
    document.addEventListener('DOMContentLoaded', function(){
        // Toggle overlay menu
        var toggle = document.getElementById('menu-toggle');
        var overlay = document.getElementById('nav-overlay');
        var closeBtn = document.getElementById('nav-close');
        if (toggle && overlay) {
            toggle.addEventListener('click', function(){
                var opened = overlay.classList.toggle('open');
                overlay.setAttribute('aria-hidden', opened ? 'false' : 'true');
                toggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
                document.body.style.overflow = opened ? 'hidden' : '';
            });
        }
        if (closeBtn && overlay) {
            closeBtn.addEventListener('click', function(){
                overlay.classList.remove('open');
                overlay.setAttribute('aria-hidden','true');
                if(toggle) toggle.setAttribute('aria-expanded','false');
                document.body.style.overflow = '';
                if(toggle) toggle.focus();
            });
        }
        // Close overlay when clicking a link or outside
        if (overlay) {
            overlay.addEventListener('click', function(e){
                // close when clicking outside the content
                if (e.target === overlay) {
                    overlay.classList.remove('open');
                    overlay.setAttribute('aria-hidden','true');
                    if(toggle) toggle.setAttribute('aria-expanded','false');
                    document.body.style.overflow = '';
                    if(toggle) toggle.focus();
                }
                if (e.target.tagName === 'A') {
                    overlay.classList.remove('open');
                    overlay.setAttribute('aria-hidden','true');
                    if(toggle) toggle.setAttribute('aria-expanded','false');
                    document.body.style.overflow = '';
                    if(toggle) toggle.focus();
                }
            });
            // Close on ESC
            document.addEventListener('keydown', function(e){
                if (e.key === 'Escape' && overlay.classList.contains('open')) {
                    overlay.classList.remove('open');
                    overlay.setAttribute('aria-hidden','true');
                    if(toggle) toggle.setAttribute('aria-expanded','false');
                    document.body.style.overflow = '';
                    if(toggle) toggle.focus();
                }
            });
        }
        // Smooth scroll for internal links
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
            anchor.addEventListener('click', function(e){
                var href = this.getAttribute('href');
                if (href && href.startsWith('#')){
                    var target = document.querySelector(href);
                    if (target){
                        e.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }
            });
        });

        // Dark mode toggle: persist preference and use system preference if none
        var darkToggle = document.getElementById('dark-toggle');
        function applyTheme(theme) {
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
                if (document.documentElement) document.documentElement.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
                if (document.documentElement) document.documentElement.classList.remove('dark-mode');
            }
            // update control icon
            if (darkToggle) {
                var icon = darkToggle.querySelector('i');
                if (document.body.classList.contains('dark-mode')){
                    icon.className = 'fas fa-sun';
                    darkToggle.setAttribute('aria-pressed','true');
                } else {
                    icon.className = 'fas fa-moon';
                    darkToggle.setAttribute('aria-pressed','false');
                }
            }
        }

        // Reveal animation: IntersectionObserver to reveal .card elements with a slower stagger
        function initRevealForSection(selector){
            var section = document.querySelector(selector);
            if (!section) return;
            var cards = Array.prototype.slice.call(section.querySelectorAll('.card'));
            cards.forEach(function(c, idx){ c.setAttribute('data-index', String(idx)); });
            var observer = new IntersectionObserver(function(entries, obs){
                entries.forEach(function(entry){
                    if (entry.isIntersecting) {
                        var card = entry.target;
                        var idx = parseInt(card.getAttribute('data-index') || '0', 10);
                        setTimeout(function(){ card.classList.add('revealed'); }, idx * 180);
                        obs.unobserve(card);
                    }
                });
            }, { threshold: 0.12 });
            cards.forEach(function(c){ observer.observe(c); });
        }


        if (darkToggle) {
            darkToggle.addEventListener('click', function(){
                var isDark = document.body.classList.toggle('dark-mode');
                // keep html element in sync to avoid FOUC and support early classes
                if (document.documentElement) {
                    if (isDark) document.documentElement.classList.add('dark-mode'); else document.documentElement.classList.remove('dark-mode');
                }
                applyTheme(isDark ? 'dark' : 'light');
                try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch(e){}
            });
            // Initialize theme on load
            var saved = null;
            try { saved = localStorage.getItem('theme'); } catch(e){}
            if (saved) {
                applyTheme(saved);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                applyTheme('dark');
            } else {
                applyTheme('light');
            }
        }

        // Start reveals after DOM setup
        initRevealForSection('#agentes');
        initRevealForSection('#planos');

    });
})();
