'use client';

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ClientStellarService } from "@/lib/client-stellar-service";
import { renderLexicalContent } from "@/lib/utils/render-lexical-content";
import { trpc } from "@/trpc/client";
import { isConnected } from "@stellar/freighter-api";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
    const params = useParams();
    const [isMinting, setIsMinting] = useState(false);
    const stellarService = new ClientStellarService();
    const { data: session } = trpc.auth.getSession.useQuery();
    const { data: post, isFetching, refetch } = trpc.post.detail.useQuery({ id: Number(params.postId) });
    const confirmMintMutation = trpc.post.confirmNftMint.useMutation();
    const markAsReadMutation = trpc.post.markAsRead.useMutation();

    useEffect(() => {
        if (session?.user && post) {
            markAsReadMutation.mutate({ postId: post.id });
        }
    }, [session, post]);

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
        return (
            <div className="py-6 space-y-6 max-w-[800px] mx-auto">
                <Skeleton className="w-full h-64 rounded-xl" />
                <Skeleton className="h-12 w-3/4" />
                <div className="flex justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-20" />
                        <Skeleton className="h-10 w-10" />
                    </div>
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <Card className="bg-base-50">
                    <CardHeader>
                        <Skeleton className="h-6 w-24" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                            <Skeleton className="h-12 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const contentHtml = renderLexicalContent(JSON.parse(post?.content ?? ""));

    if (!post) {
        return <div>Post not found</div>
    }

    const isAuthor = session?.user?.id === post.user.id;
    const canMintNFT = isAuthor && !post.nftMinted && post.ipfsHash;

    return (
        <></>
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