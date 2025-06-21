import { PostWithUser } from "@/lib/db/schema";
import { UserAvatar } from "./user-avatar";

export function PostUserSection({ post }: { post: PostWithUser }) {
    return (
        <div className="flex items-center gap-3">
            <UserAvatar user={post.user} />
            <div className="space-y-1">
                <div className="text-sm font-medium">{post.user.name ?? 'Anonymous User'}</div>
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