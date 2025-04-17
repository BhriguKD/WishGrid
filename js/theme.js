document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeLabel = document.getElementById('theme-label');
    const html = document.documentElement;
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setTheme(isDarkMode);

    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            setTheme(this.checked);
            window.dispatchEvent(new CustomEvent('themeChanged', {
                detail: { isDark: this.checked }
            }));
        });
    }

    window.addEventListener('themeChanged', function(e) {
        setTheme(e.detail.isDark);
    });

    function setTheme(isDark) {
        if (isDark) {
            html.classList.add('dark');
            html.classList.remove('light');
            if (themeLabel) themeLabel.textContent = 'Dark Mode';
            if (themeToggle) themeToggle.checked = true;
            localStorage.setItem('darkMode', 'true');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
            if (themeLabel) themeLabel.textContent = 'Light Mode';
            if (themeToggle) themeToggle.checked = false;
            localStorage.setItem('darkMode', 'false');
        }
    }

    function applyTheme() {
        const isDark = localStorage.getItem('darkMode') === 'true';
        setTheme(isDark);
    }
    applyTheme();
}); 