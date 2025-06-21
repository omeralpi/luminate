'use client';

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Logo } from "./logo";

export function SiteHeader() {
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

    return (
        <header className="border-b">
            <div className="container">
                <div className="flex gap-6 items-center justify-between py-3">
                    <Link href="/" className="flex shrink-0 items-center gap-2">
                        <Logo />
                    </Link>

                    <nav aria-label="Main" className="relative z-10 flex flex-1">
                        <Link href="/explore" className="text-sm font-medium px-3">Explore</Link>
                    </nav>

                    <div className="flex items-center gap-2.5">
                        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>

                        <ConnectWalletButton />
                    </div>
                </div>
            </div>
        </header>
    )
}