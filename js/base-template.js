document.addEventListener('DOMContentLoaded', function() {
    const darkModeStyles = `
.dark {
    --bg-primary: #121212;
    --bg-secondary: #1E1E1E;
    --bg-surface: #2D2D2D;
    --primary: #BB86FC;
    --primary-variant: #3700B3;
    --secondary: #03DAC6;
    --error: #CF6679;
    --text-primary: rgba(255, 255, 255, 0.87);
    --text-secondary: rgba(255, 255, 255, 0.6);
    --text-disabled: rgba(255, 255, 255, 0.38);
}

.dark body {
    background-color: var(--bg-primary);
    color: var(--text-primary);
}

.dark .bg-white {
    background-color: var(--bg-secondary) !important;
}

.dark .neu-shadow {
    box-shadow: 8px 8px 0px rgba(255, 255, 255, 0.1);
}

.dark .neu-button {
    box-shadow: 8px 8px 0px rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
    background-color: var(--bg-surface);
    color: var(--text-primary);
}

.dark .neu-button:hover {
    box-shadow: 4px 4px 0px rgba(255, 255, 255, 0.1);
    background-color: var(--primary);
    color: var(--bg-primary);
}

.dark .text-gray-800,
.dark .text-gray-700,
.dark .text-gray-600,
.dark .text-gray-400,
.dark .text-gray-200 {
    color: var(--text-primary);
}

.dark .text-purple-100 {
    color: var(--text-secondary);
}

.dark .border-black {
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .bg-purple-600 {
    background-color: var(--primary) !important;
}

.dark .text-purple-600 {
    color: var(--primary) !important;
}

.dark .hover\\:text-purple-600:hover {
    color: var(--secondary) !important;
}

.dark nav {
    background-color: var(--bg-secondary);
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .bg-gray-100 {
    background-color: var(--bg-primary);
}

.dark .bg-gray-200 {
    background-color: var(--bg-secondary);
}

.dark input, 
.dark select, 
.dark textarea {
    background-color: var(--bg-surface);
    color: var(--text-primary);
    border-color: rgba(255, 255, 255, 0.1);
}

.dark input::placeholder {
    color: var(--text-disabled);
}

.dark .emoji-item {
    background-color: var(--bg-secondary);
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .emoji-scroll-container {
    background-color: var(--bg-secondary);
    border-color: rgba(255, 255, 255, 0.1);
}

.dark #confirm-modal div {
    background-color: var(--bg-secondary);
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .alert-error {
    background-color: var(--error);
    color: var(--bg-primary);
}

.dark .alert-success {
    background-color: var(--secondary);
    color: var(--bg-primary);
}

.dark .bg-yellow-200 {
    background-color: var(--bg-surface);
}

.dark .bg-green-200 {
    background-color: var(--bg-surface);
}

.dark .bg-pink-400 {
    background-color: var(--primary);
}

.dark footer {
    background-color: var(--bg-secondary);
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .border-gray-200 {
    border-color: rgba(255, 255, 255, 0.1);
}

.dark .border-gray-700 {
    border-color: rgba(255, 255, 255, 0.2);
}

.dark .text-gray-400 {
    color: var(--text-secondary);
}

.dark .text-white {
    color: var(--text-primary);
}

.dark .bg-black {
    background-color: var(--bg-secondary);
}

.dark .bg-pink-400 {
    background-color: var(--primary);
    color: var(--bg-primary);
}

.dark .text-black {
    color: var(--text-primary);
}
`;
    const styleElement = document.createElement('style');
    styleElement.textContent = darkModeStyles;
    document.head.appendChild(styleElement);
    
    window.addEventListener('themeChanged', function(e) {
        const html = document.documentElement;
        if (e.detail.isDark) {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
        }
    });
}); 