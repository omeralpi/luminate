'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { PostWithUser } from "@/lib/db/schema";
import { useState } from "react";

interface CollectModalProps {
    children: React.ReactNode;
    post: PostWithUser;
}

export function CollectModal({ post, children }: CollectModalProps) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Collect NFT</DialogTitle>
                </DialogHeader>
                <div className="text-xl font-semibold">
                    {post.title}
                </div>
                <div>
                    <div className="text-sm text-muted-foreground">Minted</div>
                    <div>1/10</div>
                </div>
                <Button>
                    Collect
                </Button>
            </DialogContent>
        </Dialog>
    );
}
