/**
 * Theme presets inspirados en tweakcn (https://tweakcn.com/editor/theme).
 * Cada preset define las CSS variables que se aplican al :root.
 *
 * Para añadir un preset nuevo: copia un tema desde tweakcn y mete los
 * valores `--primary`, `--accent`, `--ring`, etc. en `cssVars`.
 *
 * Solo personalizamos los colores principales — el resto (radius, fonts,
 * shadows) se mantiene en globals.css.
 */

export interface ThemePreset {
    id: string;
    name: string;
    description: string;
    /** Color principal mostrado como swatch en el selector */
    swatch: string;
    /** CSS variables que se inyectan al :root para light mode */
    cssVars: Record<string, string>;
    /** Variables específicas para .dark si difieren */
    cssVarsDark?: Record<string, string>;
}

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: 'default',
        name: 'NEXO (default)',
        description: 'El tema verde original de NEXO UAQ.',
        swatch: 'oklch(0.8545 0.1675 159.6564)',
        cssVars: {
            '--primary': 'oklch(0.8545 0.1675 159.6564)',
            '--primary-foreground': 'oklch(0 0 0)',
            '--accent': 'oklch(0.9947 0.0074 164.9465)',
            '--accent-foreground': 'oklch(0.6184 0.1489 155.4444)',
            '--ring': 'oklch(0.8545 0.1675 159.6564)',
            '--sidebar-primary': 'oklch(0 0 0)',
            '--sidebar-accent': 'oklch(0.9752 0.0307 168.3924)',
        },
        cssVarsDark: {
            '--primary': 'oklch(0.8545 0.1675 159.6564)',
            '--primary-foreground': 'oklch(0 0 0)',
            '--accent': 'oklch(0.3004 0.0609 159.8938)',
            '--accent-foreground': 'oklch(0.9970 0 0)',
            '--ring': 'oklch(0.8545 0.1675 159.6564)',
            '--sidebar-primary': 'oklch(0.8545 0.1675 159.6564)',
            '--sidebar-accent': 'oklch(0.2824 0.0678 156.5634)',
        },
    },
    {
        id: 'cobalt',
        name: 'Cobalto',
        description: 'Azul intenso, ideal para temas profesionales.',
        swatch: 'oklch(0.6231 0.188 259.8145)',
        cssVars: {
            '--primary': 'oklch(0.6231 0.188 259.8145)',
            '--primary-foreground': 'oklch(1 0 0)',
            '--accent': 'oklch(0.9514 0.025 236.8242)',
            '--accent-foreground': 'oklch(0.4244 0.18 265.638)',
            '--ring': 'oklch(0.6231 0.188 259.8145)',
            '--sidebar-primary': 'oklch(0.6231 0.188 259.8145)',
            '--sidebar-accent': 'oklch(0.9514 0.025 236.8242)',
        },
        cssVarsDark: {
            '--primary': 'oklch(0.7137 0.1434 254.624)',
            '--primary-foreground': 'oklch(0.1 0 0)',
            '--accent': 'oklch(0.3 0.06 260)',
            '--accent-foreground': 'oklch(0.9514 0.025 236.8242)',
            '--ring': 'oklch(0.7137 0.1434 254.624)',
            '--sidebar-primary': 'oklch(0.7137 0.1434 254.624)',
            '--sidebar-accent': 'oklch(0.3 0.06 260)',
        },
    },
    {
        id: 'sunset',
        name: 'Sunset',
        description: 'Naranja cálido, energético y juvenil.',
        swatch: 'oklch(0.7 0.18 45)',
        cssVars: {
            '--primary': 'oklch(0.7 0.18 45)',
            '--primary-foreground': 'oklch(1 0 0)',
            '--accent': 'oklch(0.96 0.04 50)',
            '--accent-foreground': 'oklch(0.55 0.18 35)',
            '--ring': 'oklch(0.7 0.18 45)',
            '--sidebar-primary': 'oklch(0.7 0.18 45)',
            '--sidebar-accent': 'oklch(0.96 0.04 50)',
        },
        cssVarsDark: {
            '--primary': 'oklch(0.78 0.16 50)',
            '--primary-foreground': 'oklch(0.1 0 0)',
            '--accent': 'oklch(0.32 0.08 35)',
            '--accent-foreground': 'oklch(0.96 0.04 50)',
            '--ring': 'oklch(0.78 0.16 50)',
            '--sidebar-primary': 'oklch(0.78 0.16 50)',
            '--sidebar-accent': 'oklch(0.32 0.08 35)',
        },
    },
    {
        id: 'rose',
        name: 'Rose',
        description: 'Rosa elegante con toques modernos.',
        swatch: 'oklch(0.65 0.22 12)',
        cssVars: {
            '--primary': 'oklch(0.65 0.22 12)',
            '--primary-foreground': 'oklch(1 0 0)',
            '--accent': 'oklch(0.95 0.04 12)',
            '--accent-foreground': 'oklch(0.5 0.2 12)',
            '--ring': 'oklch(0.65 0.22 12)',
            '--sidebar-primary': 'oklch(0.65 0.22 12)',
            '--sidebar-accent': 'oklch(0.95 0.04 12)',
        },
        cssVarsDark: {
            '--primary': 'oklch(0.72 0.18 14)',
            '--primary-foreground': 'oklch(0.1 0 0)',
            '--accent': 'oklch(0.28 0.08 12)',
            '--accent-foreground': 'oklch(0.95 0.04 12)',
            '--ring': 'oklch(0.72 0.18 14)',
            '--sidebar-primary': 'oklch(0.72 0.18 14)',
            '--sidebar-accent': 'oklch(0.28 0.08 12)',
        },
    },
    {
        id: 'violet',
        name: 'Violet',
        description: 'Violeta vibrante, creativo y moderno.',
        swatch: 'oklch(0.6 0.22 295)',
        cssVars: {
            '--primary': 'oklch(0.6 0.22 295)',
            '--primary-foreground': 'oklch(1 0 0)',
            '--accent': 'oklch(0.95 0.04 295)',
            '--accent-foreground': 'oklch(0.45 0.2 295)',
            '--ring': 'oklch(0.6 0.22 295)',
            '--sidebar-primary': 'oklch(0.6 0.22 295)',
            '--sidebar-accent': 'oklch(0.95 0.04 295)',
        },
        cssVarsDark: {
            '--primary': 'oklch(0.72 0.18 295)',
            '--primary-foreground': 'oklch(0.1 0 0)',
            '--accent': 'oklch(0.28 0.1 295)',
            '--accent-foreground': 'oklch(0.95 0.04 295)',
            '--ring': 'oklch(0.72 0.18 295)',
            '--sidebar-primary': 'oklch(0.72 0.18 295)',
            '--sidebar-accent': 'oklch(0.28 0.1 295)',
        },
    },
    {
        id: 'graphite',
        name: 'Graphite',
        description: 'Grayscale minimalista, sin distracciones.',
        swatch: 'oklch(0.3 0 0)',
        cssVars: {
            '--primary': 'oklch(0.205 0 0)',
            '--primary-foreground': 'oklch(0.985 0 0)',
            '--accent': 'oklch(0.97 0 0)',
            '--accent-foreground': 'oklch(0.205 0 0)',
            '--ring': 'oklch(0.205 0 0)',
            '--sidebar-primary': 'oklch(0.205 0 0)',
            '--sidebar-accent': 'oklch(0.97 0 0)',
        },
        cssVarsDark: {
            '--primary': 'oklch(0.95 0 0)',
            '--primary-foreground': 'oklch(0.1 0 0)',
            '--accent': 'oklch(0.27 0 0)',
            '--accent-foreground': 'oklch(0.97 0 0)',
            '--ring': 'oklch(0.6 0 0)',
            '--sidebar-primary': 'oklch(0.95 0 0)',
            '--sidebar-accent': 'oklch(0.27 0 0)',
        },
    },
];

export const PRESET_STORAGE_KEY = 'nexo-theme-preset';
export const DEFAULT_PRESET_ID = 'default';

/**
 * Aplica un preset al `:root` inyectando las CSS variables.
 * Detecta si estamos en dark mode (clase `.dark` en html) y usa las
 * variables apropiadas.
 */
export function applyThemePreset(preset: ThemePreset) {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const vars = isDark && preset.cssVarsDark ? preset.cssVarsDark : preset.cssVars;

    Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });

    // También aplica las variables del modo opuesto al elemento contrario
    // para que el switch de tema funcione sin recargar.
    if (preset.cssVarsDark) {
        const oppositeVars = isDark ? preset.cssVars : preset.cssVarsDark;
        // Guardamos las variables del modo opuesto en data-attrs;
        // se aplican cuando el modo cambia (vía MutationObserver del provider).
        Object.entries(oppositeVars).forEach(([key, value]) => {
            root.dataset[`preset${isDark ? 'Light' : 'Dark'}${key.replace(/--/g, '').replace(/-/g, '_')}`] = value;
        });
    }
}

export function getPresetById(id: string): ThemePreset {
    return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
}
