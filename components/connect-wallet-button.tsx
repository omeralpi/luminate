"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { UserDropdown } from "./user-dropdown";

export function ConnectWalletButton() {
    const { walletAddress, user, isAuthenticated, isSessionLoading, error, connectWallet, disconnect } = useWallet();

    if (isAuthenticated && walletAddress) {
        return (
            <UserDropdown user={user!} onLogout={disconnect} />
        );
    }

    return (
        <div className="flex flex-col items-center gap-2">
            <Button
                onClick={connectWallet}
                disabled={isSessionLoading}
            >
                {isSessionLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Connecting...
                    </>
                ) : (
                    'Connect Wallet'
                )}
            </Button>
            {error && (
                <p className="text-sm text-red-500 mt-1 text-center max-w-xs">{error}</p>
            )}
        </div>
    );
}