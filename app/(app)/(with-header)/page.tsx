'use client';

import { PostCard, PostCardSkeleton } from "@/components/post-card";
import { SecretModal } from "@/components/secret-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/trpc/client";
import { ArrowRightIcon } from "lucide-react";

export default function Page() {
    const { data: posts = [], isFetching } = trpc.post.list.useQuery();

    return (
        <div className="flex divide-x">
            <div className="flex-1 py-6 pr-8 flex flex-col justify-center">
                <Tabs defaultValue="for-you">
                    <TabsList>
                        <TabsTrigger value="for-you">For you</TabsTrigger>
                        <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
                    </TabsList>
                </Tabs>
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
            <div className="w-[400px] ">
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-100 border-b">
                    <div className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">🤫</span>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                I&apos;ll tell you a secret...
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Answer 3 questions and get a special card
                            </p>
                        </div>
                        <SecretModal>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors">
                                Tell me the secret
                                <ArrowRightIcon className="size-4 ml-2" />
                            </Button>
                        </SecretModal>
                    </div>
                </div>
                <div className="py-6 pl-8">
                    <Card>
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
                    </Card></div>
            </div>
        </div>
    );
}