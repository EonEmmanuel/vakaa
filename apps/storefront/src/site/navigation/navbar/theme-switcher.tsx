"use client";

import {useTheme} from "next-themes";
import {useEffect, useState} from "react";
import {Moon, Sun, Monitor, Check} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" disabled>
                <Sun className="size-5" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
                <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")} className="cursor-pointer">
                    <Sun className="size-4" />
                    <span>Light</span>
                    {theme === "light" && <Check className="ml-auto w-3.5 h-3.5 text-[#D4A43C]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="cursor-pointer">
                    <Moon className="size-4" />
                    <span>Dark</span>
                    {theme === "dark" && <Check className="ml-auto w-3.5 h-3.5 text-[#D4A43C]" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="cursor-pointer">
                    <Monitor className="size-4" />
                    <span>System</span>
                    {theme === "system" && <Check className="ml-auto w-3.5 h-3.5 text-[#D4A43C]" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
