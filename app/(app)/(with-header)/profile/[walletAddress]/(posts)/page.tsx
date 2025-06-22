'use client';

import { PostCard } from "@/components/post-card";
import { trpc } from "@/trpc/client";

export default function Page() {
    const { data: posts = [] } = trpc.post.list.useQuery();

    return (
        <div className="container">
            <div className="flex">
                <div className="flex-1 flex flex-col justify-center">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    )
}