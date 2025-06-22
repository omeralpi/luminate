'use client';

import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { Moon, PencilLineIcon, Sun, TrophyIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ConnectWalletButton } from "./connect-wallet-button";
import { Logo } from "./logo";
import { SearchForm } from "./search-form";
import { UserDropdown } from "./user-dropdown";

export function AppHeader() {
    const [theme, setTheme] = useState<"light" | "dark">("light")

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light")

    const { isAuthenticated, user, disconnect } = useWallet();

    return (
        <header className="border-b bg-gray-50">
            <div className="container">
                <div className="flex gap-6 items-center justify-between py-4">
                    <Link href="/" className="flex shrink-0 items-center gap-2">
                        <Logo />
                    </Link>

                    <div className="flex-1">
                        <SearchForm />
                    </div>

                    <div className="flex items-center gap-2.5">
                        {
                            !isAuthenticated ? <ConnectWalletButton /> : <>
                                <>
                                    <Link href="/ate-score">
                                        <Button className="bg-purple-500 rounded-full">
                                            <TrophyIcon className="h-4 w-4" />
                                            ATE Score
                                        </Button>
                                    </Link>
                                    <Link href="/editor">
                                        <Button className="rounded-full">
                                            <PencilLineIcon className="h-4 w-4" />
                                            Create post
                                        </Button>
                                    </Link>
                                    <UserDropdown user={user!} onLogout={disconnect} />
                                </>
                            </>
                        }
                        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full">
                            {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    )
}