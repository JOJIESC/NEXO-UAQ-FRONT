'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    DEFAULT_PRESET_ID,
    PRESET_STORAGE_KEY,
    THEME_PRESETS,
    type ThemePreset,
    getPresetById,
} from '@/lib/themes';

interface ThemePresetContextValue {
    preset: ThemePreset;
    setPreset: (id: string) => void;
    presets: ThemePreset[];
}

const ThemePresetContext = createContext<ThemePresetContextValue | null>(null);

/**
 * Aplica un preset al :root usando las variables apropiadas según el modo
 * (light/dark) actual.
 */
function applyPresetToRoot(preset: ThemePreset) {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const isDark = root.classList.contains('dark');
    const vars = isDark && preset.cssVarsDark ? preset.cssVarsDark : preset.cssVars;
    Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

export function ThemePresetProvider({ children }: { children: React.ReactNode }) {
    const [presetId, setPresetId] = useState<string>(DEFAULT_PRESET_ID);

    // Carga inicial desde localStorage
    useEffect(() => {
        const stored = localStorage.getItem(PRESET_STORAGE_KEY);
        if (stored && THEME_PRESETS.find((p) => p.id === stored)) {
            setPresetId(stored);
        }
    }, []);

    // Aplica preset cuando cambia
    useEffect(() => {
        applyPresetToRoot(getPresetById(presetId));
    }, [presetId]);

    // Re-aplica preset cuando el modo light/dark cambia (clase `.dark` en html)
    useEffect(() => {
        if (typeof document === 'undefined') return;

        const observer = new MutationObserver(() => {
            applyPresetToRoot(getPresetById(presetId));
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        });

        return () => observer.disconnect();
    }, [presetId]);

    const setPreset = useCallback((id: string) => {
        setPresetId(id);
        try {
            localStorage.setItem(PRESET_STORAGE_KEY, id);
        } catch {
            // ignore quota errors
        }
    }, []);

    return (
        <ThemePresetContext.Provider
            value={{
                preset: getPresetById(presetId),
                setPreset,
                presets: THEME_PRESETS,
            }}
        >
            {children}
        </ThemePresetContext.Provider>
    );
}

export function useThemePreset() {
    const ctx = useContext(ThemePresetContext);
    if (!ctx) {
        throw new Error('useThemePreset must be used within ThemePresetProvider');
    }
    return ctx;
}
