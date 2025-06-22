import { PostWithUser } from "@/lib/db/schema";
import Link from "next/link";
import { UserAvatar } from "./user-avatar";

export function PostUserSection({ post }: { post: PostWithUser }) {
    return (
        <div className="flex items-center gap-3">
            <Link href={`/profile/${post.user.walletAddress}`}>
                <UserAvatar user={post.user} />
            </Link>
            <div className="space-y-1">
                <Link href={`/profile/${post.user.walletAddress}`} className="text-sm font-medium">{post.user.name}</Link>
                <div className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground">
                        {post.createdAt.toLocaleDateString()}
                    </div>
                    <div className="size-[4px] rounded-full bg-black/25 flex"></div>
                    <div className="text-xs text-muted-foreground">
                        1 min read
                    </div>
                </div>
            </div>
        </div>
    )
}