import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { ClientStellarService } from "@/lib/client-stellar-service";
import { PostWithUser } from "@/lib/db/schema";
import { isConnected, requestAccess } from "@stellar/freighter-api";
import { Check, Loader2, RefreshCw, Users, Wallet, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CollectModalProps {
    children: React.ReactNode;
    post: PostWithUser;
}

export function CollectModal({ post, children }: CollectModalProps) {
    const [open, setOpen] = useState(false);
    const [isCollecting, setIsCollecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasCollected, setHasCollected] = useState(false);
    const [collectCount, setCollectCount] = useState(0);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    const stellarService = new ClientStellarService();

    const fetchCollectionDataFromStellar = async () => {
        if (!post.nftMinted || !open) return;

        setIsLoading(true);
        try {
            // TODO: Implement fetching collection data from Stellar
            // const count = await stellarService.getCollectCount(post.id);
            // setCollectCount(count);

            // const connected = await isConnected();
            // if (connected) {
            //     const { address } = await requestAccess();
            //     setWalletAddress(address);

            //     const collected = await stellarService.hasCollected(address, post.id);
            //     setHasCollected(collected);
            // }
        } catch (error) {
            console.error("Error fetching from Stellar:", error);
            toast.error("Failed to fetch collection data from blockchain");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (open && post.nftMinted) {
            fetchCollectionDataFromStellar();
        }
    }, [open, post.nftMinted]);

    const handleCollect = async () => {
        if (!post.nftMinted) {
            toast.error("This post hasn't been minted as NFT yet");
            return;
        }

        setIsCollecting(true);

        try {
            const connected = await isConnected();
            if (!connected) {
                toast.error("Please install and connect Freighter wallet");
                window.open("https://www.freighter.app/", "_blank");
                return;
            }

            toast.info("Please approve the transaction in your wallet");

            const result = await stellarService.collectPost(post.id);

            if (result.success) {
                toast.success("Successfully collected! 🎉");

                await fetchCollectionDataFromStellar();
            }
        } catch (error: unknown) {
            console.error("Collect error:", error);

            if (error instanceof Error) {
                if (error.message?.includes("User declined")) {
                    toast.error("Transaction cancelled");
                } else if (error.message?.includes("insufficient balance")) {
                    toast.error("Insufficient XLM balance for transaction fee");
                } else if (error.message?.includes("Already collected")) {
                    toast.error("You have already collected this NFT");
                    setHasCollected(true);
                } else {
                    toast.error(error.message || "Failed to collect NFT");
                }
            }
        } finally {
            setIsCollecting(false);
        }
    };

    const handleUncollect = async () => {
        if (!hasCollected) return;

        setIsCollecting(true);

        try {
            const connected = await isConnected();
            if (!connected) {
                toast.error("Please connect your wallet");
                return;
            }

            toast.info("Please approve the uncollect transaction");

            // TODO: Implement uncollecting
            // const result = await stellarService.uncollectPost(post.id);

            // if (result.success) {
            //     toast.success("Successfully uncollected");

            //     await fetchCollectionDataFromStellar();
            // }
        } catch (error: unknown) {
            console.error("Uncollect error:", error);

            if (error instanceof Error && error.message?.includes("Cannot uncollect your own post")) {
                toast.error("You cannot uncollect your own post");
            } else {
                toast.error("Failed to uncollect");
            }
        } finally {
            setIsCollecting(false);
        }
    };

    // Kullanıcı post sahibi mi kontrol et
    const isAuthor = walletAddress && post.user.walletAddress === walletAddress;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle>
                            {hasCollected ? "Collected NFT" : "Collect NFT"}
                        </DialogTitle>
                        {post.nftMinted && (
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={fetchCollectionDataFromStellar}
                                disabled={isLoading}
                            >
                                <RefreshCw className={`size-4 ${isLoading ? 'animate-spin' : ''}`} />
                            </Button>
                        )}
                    </div>
                    <DialogDescription>
                        {post.nftMinted
                            ? "Live data from Stellar blockchain"
                            : "This post needs to be minted as an NFT first"
                        }
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="flex gap-4 p-4 border rounded-lg bg-muted/30">
                        {post.cover && (
                            <img
                                src={post.cover}
                                alt={post.title}
                                className="w-20 h-20 object-cover rounded-md"
                            />
                        )}
                        <div className="flex-1 space-y-1">
                            <h3 className="font-semibold line-clamp-1">{post.title}</h3>
                            <p className="text-sm text-muted-foreground">
                                by {post.user.name || post.user.walletAddress?.slice(0, 8) + "..."}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <div className="flex items-center gap-2">
                                {post.nftMinted ? (
                                    <Badge variant="secondary" className="gap-1">
                                        <Check className="size-3" />
                                        On-chain
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="gap-1">
                                        <X className="size-3" />
                                        Not Minted
                                    </Badge>
                                )}
                                {hasCollected && (
                                    <Badge className="gap-1">
                                        <Check className="size-3" />
                                        Collected
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                <Users className="size-3" />
                                Collectors (Blockchain)
                            </div>
                            <div className="text-2xl font-bold">
                                {isLoading ? (
                                    <Loader2 className="size-5 animate-spin" />
                                ) : (
                                    collectCount
                                )}
                            </div>
                        </div>
                    </div>

                    {post.nftMinted && (
                        <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                            <p>🔗 Data fetched directly from Stellar blockchain</p>
                            <p>💰 Transaction fee: ~0.00001 XLM</p>
                            <p>♾️ Unlimited collectors allowed</p>
                            {isAuthor && <p>👤 Authors cannot uncollect their own posts</p>}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {!walletAddress ? (
                        <Button
                            onClick={async () => {
                                try {
                                    await requestAccess();
                                    await fetchCollectionDataFromStellar();
                                } catch (error) {
                                    toast.error("Failed to connect wallet");
                                }
                            }}
                            className="w-full"
                        >
                            <Wallet className="size-4 mr-2" />
                            Connect Wallet
                        </Button>
                    ) : !post.nftMinted ? (
                        <Button disabled variant="secondary">
                            <X className="size-4 mr-2" />
                            Not Available
                        </Button>
                    ) : hasCollected && !isAuthor ? (
                        <Button
                            onClick={handleUncollect}
                            disabled={isCollecting || isLoading}
                            variant="outline"
                            className="w-full"
                        >
                            {isCollecting ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <X className="size-4 mr-2" />
                                    Uncollect
                                </>
                            )}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCollect}
                            disabled={isCollecting || hasCollected || isLoading}
                            className="w-full"
                        >
                            {isCollecting ? (
                                <>
                                    <Loader2 className="size-4 mr-2 animate-spin" />
                                    Collecting...
                                </>
                            ) : hasCollected ? (
                                <>
                                    <Check className="size-4 mr-2" />
                                    Already Collected
                                </>
                            ) : (
                                <>
                                    <Wallet className="size-4 mr-2" />
                                    Collect NFT
                                </>
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}