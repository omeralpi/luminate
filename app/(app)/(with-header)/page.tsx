'use client';

import { SecretModal } from "@/components/secret-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { ArrowRightIcon } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const PostList = dynamic(() => import("@/components/post-list").then((mod) => mod.PostList), {
    ssr: false,
});

function formatPostCount(count: number) {
    if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k posts`;
    }
    return `${count} posts`;
}

export default function Page() {
    const { data: hotTopics = [] } = trpc.tag.getHotTopics.useQuery({
        limit: 5,
    });

    return (
        <div className="flex divide-x">
            <PostList />
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
                            <SecretModal>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors">
                                    Tell me the secret
                                    <ArrowRightIcon className="size-4 ml-2" />
                                </Button>
                            </SecretModal>
                        </div>
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
                            {hotTopics.map((topic) => (
                                <Link
                                    key={topic.id}
                                    href={`/?tag=${topic.name}`}
                                    className="flex items-center justify-between px-2 p-3 -m-2 rounded-lg transition-colors hover:bg-muted"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 ${topic.color || 'bg-gray-500'} rounded-full`}></div>
                                        <span className="text-sm font-medium">#{topic.name}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{formatPostCount(topic.postCount)}</span>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}