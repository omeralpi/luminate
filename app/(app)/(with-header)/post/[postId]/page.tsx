'use client';

import { CollectModal } from "@/components/collect-modal";
import { PostUserSection } from "@/components/post-user-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClientStellarService } from "@/lib/client-stellar-service";
import { stellarExplorerUrl } from "@/lib/stellar";
import { renderLexicalContent } from "@/lib/utils/render-lexical-content";
import { trpc } from "@/trpc/client";
import { isConnected } from "@stellar/freighter-api";
import { ExternalLink, Loader2, ShareIcon, Wallet } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const params = useParams();
    const [isMinting, setIsMinting] = useState(false);
    const stellarService = new ClientStellarService();
    const { data: session } = trpc.auth.getSession.useQuery();
    const { data: post, isFetching, refetch } = trpc.post.detail.useQuery({ id: Number(params.postId) });
    const confirmMintMutation = trpc.post.confirmNftMint.useMutation();

    const handleMintNFT = async () => {
        if (!post?.ipfsHash) {
            toast.error("Post needs to be uploaded to IPFS first");
            return;
        }

        setIsMinting(true);

        try {
            const connected = await isConnected();

            if (!connected) {
                toast.error("Please install and connect Freighter wallet");
                window.open("https://www.freighter.app/", "_blank");

                return;
            }

            toast.info("Please approve the transaction in your wallet");

            const result = await stellarService.mintPostAsNFT(
                post.ipfsHash,
                post.id
            );

            if (result.success) {
                await confirmMintMutation.mutateAsync({
                    postId: post.id,
                    transactionHash: result.hash,
                    stellarAddress: result.userAddress,
                });

                toast.success("Post successfully minted as NFT! 🎉");

                refetch();
            }
        } catch (error: unknown) {
            console.error("Mint error:", error);

            if (error instanceof Error && error.message?.includes("User declined")) {
                toast.error("Transaction cancelled");
            } else if (error instanceof Error && error.message?.includes("insufficient balance")) {
                toast.error("Insufficient XLM balance for transaction fee");
            } else {
                toast.error(error instanceof Error ? error.message : "Failed to mint NFT");
            }
        } finally {
            setIsMinting(false);
        }
    };

    if (isFetching) {
        return <div>Loading...</div>
    }

    const contentHtml = renderLexicalContent(JSON.parse(post?.content ?? ""));

    if (!post) {
        return <div>Post not found</div>
    }

    const isAuthor = session?.user?.id === post.user.id;
    const canMintNFT = isAuthor && !post.nftMinted && post.ipfsHash;

    return (
        <div className="py-6 space-y-6 max-w-[800px] mx-auto">
            <img className="mx-auto w-full rounded-xl" src={post?.cover || ""} alt={post?.title || ""} />
            <h1 className="text-4xl font-bold">{post?.title}</h1>
            <div className="flex justify-between">
                <PostUserSection post={post} />
                <div className="flex gap-3">
                    {canMintNFT && (
                        <Button
                            onClick={handleMintNFT}
                            disabled={isMinting}
                            className="gap-2"
                            variant='secondary'
                        >
                            {isMinting ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Minting...
                                </>
                            ) : (
                                <>
                                    <Wallet className="size-4" />
                                    Mint as NFT
                                </>
                            )}
                        </Button>
                    )}

                    <CollectModal post={post}>
                        <Button>
                            Collect
                        </Button>
                    </CollectModal>

                    <Button variant="outline" size="icon">
                        <ShareIcon className="size-4" />
                    </Button>
                </div>
            </div>
            <p className="leading-relaxed text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: contentHtml }} />
            <Card className="bg-base-50">
                <CardHeader>
                    <CardTitle>
                        Verification
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="block border rounded-xl divide-y">
                        {post?.gatewayUrl &&
                            <VerificationItem
                                label="PINATA TRANSACTION"
                                value={post.gatewayUrl}
                                href={post.gatewayUrl}
                            />
                        }
                        <VerificationItem
                            label="AUTHOR"
                            value={post.user.walletAddress}
                            href={`${stellarExplorerUrl}/accounts/${post.user.walletAddress}`}
                        />
                        {post.nftMinted && post.nftTransactionHash && (
                            <VerificationItem
                                label="NFT TRANSACTION"
                                value={post.nftTransactionHash}
                                href={`${stellarExplorerUrl}/transactions/${post.nftTransactionHash}`}
                            />
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    )
}

const VerificationItem = ({
    label,
    value,
    href,
}: {
    label: string;
    value: string;
    href: string;
}) => {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="space-y-1 p-2 block hover:bg-muted/50 transition-colors">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                {label}
                <ExternalLink className="size-3" />
            </div>
            <div className="text-xs text-muted-foreground font-mono truncate">
                {value}
            </div>
        </Link>
    )
}