'use client';

import { PostCard, PostCardSkeleton } from "@/components/post-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/trpc/client";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function PostList() {
    const searchParams = useSearchParams();
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");

    const { data: posts = [], isFetching } = trpc.post.list.useQuery({
        limit: 10,
        cursor: 0,
        tag: tag ?? undefined,
        search: search ?? undefined,
    });

    const { data: hotTopics = [] } = trpc.tag.getHotTopics.useQuery({
        limit: 5,
    });

    return (
        <div className="flex-1 py-6 pr-8 flex flex-col">
            {
                tag ? (
                    <div className="text-sm text-muted-foreground mb-4">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeftIcon className="size-4" />
                            Back to all topics
                        </Link>
                    </div>
                ) : search ? (
                    <div className="text-sm text-muted-foreground mb-4">
                        <p className="mb-2">Showing results for: <strong>&quot;{search}&quot;</strong></p>
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeftIcon className="size-4" />
                            Clear search
                        </Link>
                    </div>
                ) : (
                    <Tabs defaultValue="for-you" className="mb-4">
                        <TabsList>
                            <TabsTrigger value="for-you">For you</TabsTrigger>
                            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                        </TabsList>
                    </Tabs>
                )
            }
            <div className="divide-y">
                {isFetching ? [...Array(10)].map((_, index) => (
                    <PostCardSkeleton key={index} />
                )) : (
                    posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
}