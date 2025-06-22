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
        <header className="py-8">
            <div className="container">
                <div className="w-[min(90%,700px)] mx-auto bg-background/70 z-50 border backdrop-blur-md bg-white">
                    <div className="flex items-center justify-between px-6 py-3">
                        <Link href="/" className="flex shrink-0 items-center gap-2">
                            <Logo />
                        </Link>

                        <nav aria-label="Main" className="relative z-10 flex max-w-max flex-1 items-center justify-center max-lg:hidden">
                            <Link href="/editor" className="text-sm font-medium px-3">Editor</Link>

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
            </div>
        </header>
    )
}