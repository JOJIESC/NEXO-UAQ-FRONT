/**
 * Theme presets inspirados en tweakcn (https://tweakcn.com/editor/theme).
 * Cada preset define las CSS variables que se aplican al :root.
 *
 * Variables que cubrimos por preset (light + dark):
 *   --primary, --primary-foreground
 *   --accent, --accent-foreground
 *   --ring
 *   --sidebar-primary, --sidebar-primary-foreground
 *   --sidebar-accent, --sidebar-accent-foreground
 *   --sidebar-ring
 *
 * El resto (radius, fonts, shadows, background, foreground) se mantiene en
 * globals.css.
 */

export interface ThemePreset {
    id: string;
    name: string;
    description: string;
    /** Color principal mostrado como swatch en el selector */
    swatch: string;
    /** CSS variables que se inyectan al :root para light mode */
    cssVars: Record<string, string>;
    /** Variables específicas para .dark */
    cssVarsDark: Record<string, string>;
}

/**
 * Helper para construir el set completo de variables (incluyendo sidebar)
 * a partir de un puñado de colores base.
 */
function buildVars({
    primary,
    primaryForeground,
    accent,
    accentForeground,
    sidebarAccent,
}: {
    primary: string;
    primaryForeground: string;
    accent: string;
    accentForeground: string;
    sidebarAccent: string;
}): Record<string, string> {
    return {
        '--primary': primary,
        '--primary-foreground': primaryForeground,
        '--accent': accent,
        '--accent-foreground': accentForeground,
        '--ring': primary,
        '--sidebar-primary': primary,
        '--sidebar-primary-foreground': primaryForeground,
        '--sidebar-accent': sidebarAccent,
        '--sidebar-accent-foreground': primary,
        '--sidebar-ring': primary,
    };
}

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: 'default',
        name: 'NEXO (default)',
        description: 'El tema verde original de NEXO UAQ.',
        swatch: 'oklch(0.8545 0.1675 159.6564)',
        cssVars: buildVars({
            primary: 'oklch(0.8545 0.1675 159.6564)',
            primaryForeground: 'oklch(0 0 0)',
            accent: 'oklch(0.9947 0.0074 164.9465)',
            accentForeground: 'oklch(0.6184 0.1489 155.4444)',
            sidebarAccent: 'oklch(0.9752 0.0307 168.3924)',
        }),
        cssVarsDark: buildVars({
            primary: 'oklch(0.8545 0.1675 159.6564)',
            primaryForeground: 'oklch(0 0 0)',
            accent: 'oklch(0.3004 0.0609 159.8938)',
            accentForeground: 'oklch(0.9970 0 0)',
            sidebarAccent: 'oklch(0.2824 0.0678 156.5634)',
        }),
    },
    {
        id: 'cobalt',
        name: 'Cobalto',
        description: 'Azul intenso, profesional.',
        swatch: 'oklch(0.6231 0.188 259.8145)',
        cssVars: buildVars({
            primary: 'oklch(0.6231 0.188 259.8145)',
            primaryForeground: 'oklch(1 0 0)',
            accent: 'oklch(0.9514 0.025 236.8242)',
            accentForeground: 'oklch(0.4244 0.18 265.638)',
            sidebarAccent: 'oklch(0.9514 0.025 236.8242)',
        }),
        cssVarsDark: buildVars({
            primary: 'oklch(0.7137 0.1434 254.624)',
            primaryForeground: 'oklch(0.1 0 0)',
            accent: 'oklch(0.3 0.06 260)',
            accentForeground: 'oklch(0.9514 0.025 236.8242)',
            sidebarAccent: 'oklch(0.3 0.06 260)',
        }),
    },
    {
        id: 'sunset',
        name: 'Sunset',
        description: 'Naranja cálido y energético.',
        swatch: 'oklch(0.7 0.18 45)',
        cssVars: buildVars({
            primary: 'oklch(0.7 0.18 45)',
            primaryForeground: 'oklch(1 0 0)',
            accent: 'oklch(0.96 0.04 50)',
            accentForeground: 'oklch(0.55 0.18 35)',
            sidebarAccent: 'oklch(0.96 0.04 50)',
        }),
        cssVarsDark: buildVars({
            primary: 'oklch(0.78 0.16 50)',
            primaryForeground: 'oklch(0.1 0 0)',
            accent: 'oklch(0.32 0.08 35)',
            accentForeground: 'oklch(0.96 0.04 50)',
            sidebarAccent: 'oklch(0.32 0.08 35)',
        }),
    },
    {
        id: 'rose',
        name: 'Rose',
        description: 'Rosa elegante y moderno.',
        swatch: 'oklch(0.65 0.22 12)',
        cssVars: buildVars({
            primary: 'oklch(0.65 0.22 12)',
            primaryForeground: 'oklch(1 0 0)',
            accent: 'oklch(0.95 0.04 12)',
            accentForeground: 'oklch(0.5 0.2 12)',
            sidebarAccent: 'oklch(0.95 0.04 12)',
        }),
        cssVarsDark: buildVars({
            primary: 'oklch(0.72 0.18 14)',
            primaryForeground: 'oklch(0.1 0 0)',
            accent: 'oklch(0.28 0.08 12)',
            accentForeground: 'oklch(0.95 0.04 12)',
            sidebarAccent: 'oklch(0.28 0.08 12)',
        }),
    },
    {
        id: 'violet',
        name: 'Violet',
        description: 'Violeta vibrante y creativo.',
        swatch: 'oklch(0.6 0.22 295)',
        cssVars: buildVars({
            primary: 'oklch(0.6 0.22 295)',
            primaryForeground: 'oklch(1 0 0)',
            accent: 'oklch(0.95 0.04 295)',
            accentForeground: 'oklch(0.45 0.2 295)',
            sidebarAccent: 'oklch(0.95 0.04 295)',
        }),
        cssVarsDark: buildVars({
            primary: 'oklch(0.72 0.18 295)',
            primaryForeground: 'oklch(0.1 0 0)',
            accent: 'oklch(0.28 0.1 295)',
            accentForeground: 'oklch(0.95 0.04 295)',
            sidebarAccent: 'oklch(0.28 0.1 295)',
        }),
    },
    {
        id: 'graphite',
        name: 'Graphite',
        description: 'Grayscale minimalista.',
        swatch: 'oklch(0.3 0 0)',
        cssVars: buildVars({
            primary: 'oklch(0.205 0 0)',
            primaryForeground: 'oklch(0.985 0 0)',
            accent: 'oklch(0.97 0 0)',
            accentForeground: 'oklch(0.205 0 0)',
            sidebarAccent: 'oklch(0.94 0 0)',
        }),
        cssVarsDark: buildVars({
            primary: 'oklch(0.95 0 0)',
            primaryForeground: 'oklch(0.1 0 0)',
            accent: 'oklch(0.27 0 0)',
            accentForeground: 'oklch(0.97 0 0)',
            sidebarAccent: 'oklch(0.27 0 0)',
        }),
    },
];

export const PRESET_STORAGE_KEY = 'nexo-theme-preset';
export const DEFAULT_PRESET_ID = 'default';

export function getPresetById(id: string): ThemePreset {
    return THEME_PRESETS.find((p) => p.id === id) ?? THEME_PRESETS[0];
}
