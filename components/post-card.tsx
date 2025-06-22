import { Skeleton } from "@/components/ui/skeleton";
import { PostWithUser } from "@/lib/db/schema/post";
import { lexicalToText } from "@/lib/utils/render-lexical-content";
import { BookmarkIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { UserAvatar } from "./user-avatar";

export function PostCard({ post }: { post: PostWithUser }) {
    return (
        <div key={post.id} className="py-6 space-y-3">
            <div className="text-sm text-muted-foreground">1 min read</div>
            <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                    <Link href={`/post/${post.id}`} className="text-xl font-semibold">{post.title}</Link>
                    <div className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mt-3">
                        {lexicalToText(JSON.parse(post.content ?? ""))}
                    </div>
                </div>
                <Link href={`/post/${post.id}`}>
                    <img src={post.cover || ""} alt={post.title} className="h-[108px] w-[180px] object-cover rounded-xl" />
                </Link>
            </div>
            <div className="flex text-sm text-muted-foreground gap-8 items-center">
                <Link href={`/profile/${post.user.walletAddress}`} className="flex items-center gap-2">
                    <UserAvatar className="w-7 h-7" user={post.user} />
                    <div>
                        {post.user.name}
                    </div>
                </Link>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <HeartIcon className="size-4" /> 0
                    </div>
                    <div className="size-[4px] rounded-full bg-black/25 flex"></div>
                    <div className="flex items-center gap-2"> <MessageCircleIcon className="size-4" />
                        0
                    </div>
                    <div className="size-[4px] rounded-full bg-black/25 flex"></div>
                    <div className="flex items-center gap-2">
                        <BookmarkIcon className="size-4" /> 0
                    </div>
                </div>
            </div>
        </div>
    )
}

export const PostCardSkeleton = () => {
    return (
        <div className="py-6 space-y-3">
            <Skeleton className="h-4 w-20" />

            <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-3/4" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                </div>
                <Skeleton className="h-[108px] w-[180px] rounded-xl" />
            </div>

            <div className="flex text-sm text-muted-foreground gap-8 items-center">
                <div className="flex items-center gap-2">
                    <Skeleton className="w-7 h-7 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4" />
                        <Skeleton className="h-4 w-6" />
                    </div>
                    <div className="size-[4px] rounded-full bg-black/25 flex"></div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4" />
                        <Skeleton className="h-4 w-6" />
                    </div>
                    <div className="size-[4px] rounded-full bg-black/25 flex"></div>
                    <div className="flex items-center gap-2">
                        <Skeleton className="size-4" />
                        <Skeleton className="h-4 w-6" />
                    </div>
                </div>
            </div>
        </div>
    )
}