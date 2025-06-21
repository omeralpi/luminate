'use client';

import { CollectModal } from "@/components/collect-modal";
import { PostUserSection } from "@/components/post-user-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stellarExplorerUrl } from "@/lib/stellar";
import { renderLexicalContent } from "@/lib/utils/render-lexical-content";
import { trpc } from "@/trpc/client";
import { ExternalLink, ShareIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();

    const { data: post, isFetching } = trpc.post.detail.useQuery({ id: Number(params.postId) });

    if (isFetching) {
        return <div>Loading...</div>
    }

    const contentHtml = renderLexicalContent(JSON.parse(post?.content ?? ""));

    if (!post) {
        return <div>Post not found</div>
    }

    return (
        <div className="py-6 space-y-6 max-w-[800px] mx-auto">
            <img className="mx-auto w-full rounded-xl" src={post?.cover} alt={post?.title} />
            <h1 className="text-4xl font-bold">{post?.title}</h1>
            <div className="flex justify-between">
                <PostUserSection post={post} />
                <div className="flex gap-3">
                    <Button variant="outline" size="icon">
                        <ShareIcon className="size-4" />
                    </Button>
                    <CollectModal post={post}>
                        <Button >
                            Collect
                        </Button>
                    </CollectModal>
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
        <Link href={href} className="space-y-1 p-2 block">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                {label}
                <ExternalLink className="size-3" />
            </div>
            <div className="text-xs text-muted-foreground">
                {value}
            </div>
        </Link>
    )
}