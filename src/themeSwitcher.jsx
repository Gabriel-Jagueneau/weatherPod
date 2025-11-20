const THEME_KEY = 'theme'
export const THEMES = ['Défaut', 'Forêt', 'Mangrove', 'Savane', 'Raisin', 'Cerise']

const themeClassMap = {
    Defaut: '',
    Forêt: 'Foret-theme',
    Mangrove: 'Mangrove-theme',
    Savane: 'Savane-theme',
    Raisin: 'Raisin-theme',
    Cerise: 'Cerise-theme'
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