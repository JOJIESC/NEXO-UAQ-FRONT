'use client';

import { Check, ExternalLink } from 'lucide-react';
import { useThemePreset } from '@/providers/ThemePresetProvider';
import { cn } from '@/lib/utils';

export function ThemePresetSelector() {
    const { preset: active, presets, setPreset } = useThemePreset();

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {presets.map((preset) => {
                    const isActive = preset.id === active.id;
                    return (
                        <button
                            key={preset.id}
                            type="button"
                            onClick={() => setPreset(preset.id)}
                            className={cn(
                                'group relative flex flex-col items-start gap-2 rounded-xl border bg-card p-3 text-left transition-all hover:shadow-md',
                                isActive
                                    ? 'border-primary ring-2 ring-primary/30'
                                    : 'border-border hover:border-foreground/20',
                            )}
                            aria-pressed={isActive}
                        >
                            {isActive && (
                                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}

                            {/* Swatch */}
                            <div
                                className="h-12 w-full rounded-lg border"
                                style={{ background: preset.swatch }}
                                aria-hidden
                            />

                            <div>
                                <p className="text-sm font-semibold leading-tight">
                                    {preset.name}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                    {preset.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="rounded-lg bg-muted/30 p-3 flex items-start gap-2">
                <ExternalLink className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                <div className="text-xs text-muted-foreground">
                    ¿Quieres crear tu propio tema? Personaliza cualquier paleta en{' '}
                    <a
                        href="https://tweakcn.com/editor/theme"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
                    >
                        tweakcn.com
                    </a>
                    {' '}y comparte el código con un desarrollador para añadirlo al proyecto.
                </div>
            </div>
        </div>
    );
}
