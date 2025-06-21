"use client";

import { useWallet } from "@/hooks/use-wallet";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button";

export function ConnectWalletButton() {
    const { isSessionLoading, error, connectWallet } = useWallet();

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