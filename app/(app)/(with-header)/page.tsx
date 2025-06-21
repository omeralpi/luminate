'use client';

import { PostCard, PostCardSkeleton } from "@/components/post-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/trpc/client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
    const { data: posts = [], isFetching } = trpc.post.list.useQuery();

    return (
        <div className="flex divide-x">
            <div className="flex-1 py-6 pr-8 divide-y flex flex-col justify-center">
                <Tabs defaultValue="for-you">
                    <TabsList>
                        <TabsTrigger value="for-you">For you</TabsTrigger>
                        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                    </TabsList>
                </Tabs>
                {isFetching ? [...Array(10)].map((_, index) => (
                    <PostCardSkeleton key={index} />
                )) : (
                    posts.map((post) => (
                        <Link href={`/post/${post.id}`} key={post.id}>
                            <PostCard post={post} />
                        </Link>
                    ))
                )}
            </div>
            <div className="w-[400px] py-6 pl-8">
                <Button className="w-full" size='lg' variant={'outline'}>
                    i’ll tell you a secret
                    <ArrowRightIcon className="size-4" />
                </Button>
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>
                            Hot topics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { tag: "#JavaScript", posts: "2.5k posts", color: "bg-red-500" },
                            { tag: "#React", posts: "1.8k posts", color: "bg-orange-500" },
                            { tag: "#TypeScript", posts: "1.2k posts", color: "bg-yellow-500" },
                            { tag: "#NextJS", posts: "890 posts", color: "bg-green-500" },
                            { tag: "#TailwindCSS", posts: "654 posts", color: "bg-blue-500" },
                        ].map((topic, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 ${topic.color} rounded-full`}></div>
                                    <span className="text-sm font-medium">{topic.tag}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">{topic.posts}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}