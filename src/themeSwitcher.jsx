const THEME_KEY = 'theme'
export const THEMES = ['défaut', 'sombre', 'clair']

const themeClassMap = {
    défaut: '',
    sombre: 'darker-theme',
    clair: 'lighter-theme',
}

const applyThemeClass = (theme) => {
    const root = document.documentElement
    Object.values(themeClassMap).forEach((cls) => {
        if (cls) root.classList.remove(cls)
    })
    const cls = themeClassMap[theme] || ''
    if (cls) root.classList.add(cls)
}

export const initTheme = () => {
    const stored = localStorage.getItem(THEME_KEY) || 'défaut'
    applyThemeClass(stored)
}

export const setTheme = (theme) => {
    if (!THEMES.includes(theme)) theme = 'défaut'
    applyThemeClass(theme)
    localStorage.setItem(THEME_KEY, theme)
}