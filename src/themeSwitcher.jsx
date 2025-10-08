const THEME_KEY = 'theme'
export const THEMES = ['default', 'darker', 'lighter']

const themeClassMap = {
    default: '',
    darker: 'darker-theme',
    lighter: 'lighter-theme',
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
    const stored = localStorage.getItem(THEME_KEY) || 'default'
    applyThemeClass(stored)
}

export const setTheme = (theme) => {
    if (!THEMES.includes(theme)) theme = 'default'
    applyThemeClass(theme)
    localStorage.setItem(THEME_KEY, theme)
}