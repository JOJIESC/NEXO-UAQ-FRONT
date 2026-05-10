'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export function ThemeSelector() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evita hydration mismatch: el tema solo se conoce en el cliente.
    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <div className="h-10 w-[280px] animate-pulse rounded-md bg-muted/50" />
        );
    }

    return (
        <ToggleGroup
            type="single"
            variant="outline"
            value={theme || 'system'}
            onValueChange={(value) => {
                if (value) setTheme(value);
            }}
        >
            <ToggleGroupItem value="light" aria-label="Tema claro">
                <Sun className="mr-2 h-4 w-4" />
                Claro
            </ToggleGroupItem>
            <ToggleGroupItem value="dark" aria-label="Tema oscuro">
                <Moon className="mr-2 h-4 w-4" />
                Oscuro
            </ToggleGroupItem>
            <ToggleGroupItem value="system" aria-label="Tema del sistema">
                <Monitor className="mr-2 h-4 w-4" />
                Sistema
            </ToggleGroupItem>
        </ToggleGroup>
    );
}
