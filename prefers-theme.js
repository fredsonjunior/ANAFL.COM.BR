(function(){
    try{
        var saved = null;
        try{ saved = localStorage.getItem('theme'); } catch(e){}
        var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        var useDark = saved === 'dark' || (!saved && prefersDark);
        if (useDark) {
            document.documentElement.classList.add('dark-mode');
            if (document.body) document.body.classList.add('dark-mode');
        }
    } catch(e){}
})();
