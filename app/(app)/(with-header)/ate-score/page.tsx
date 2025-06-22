"use client"

import { ChartRadialText } from "@/components/chart-radial-text";
import { ClientOnly } from "@/components/client-only";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader, PageHeaderHeading } from "@/components/ui/page-header";
import { achievements } from "@/config/achievements";
import { trpc } from "@/trpc/client";
import Image from "next/image";

export default function Page() {
    const { data: scoreData } = trpc.user.getScore.useQuery();
    const { data: userAchievements } = trpc.user.getAchievements.useQuery();

    return (
        <ClientOnly>

            <div className="container py-8 space-y-6">
                <PageHeader>
                    <PageHeaderHeading>ATE Score</PageHeaderHeading>
                </PageHeader>
                <div className="grid grid-cols-4 gap-6">
                    {scoreData && (
                        <ChartRadialText
                            score={scoreData.score}
                            title="ATE Score"
                            description="Total Score"
                        />
                    )}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Statistics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {[
                                {
                                    label: "Referrals",
                                    value: scoreData?.referralCount ?? 0,
                                    color: "bg-blue-500"
                                },
                                {
                                    label: "Shares",
                                    value: scoreData?.shareCount ?? 0,
                                    color: "bg-green-500"
                                },
                                {
                                    label: "Created Posts",
                                    value: scoreData?.postCount ?? 0,
                                    color: "bg-purple-500"
                                },
                                {
                                    label: "Read Posts",
                                    value: scoreData?.readCount ?? 0,
                                    color: "bg-yellow-500"
                                }
                            ].map((stat, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 ${stat.color} rounded-full`}></div>
                                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-lg font-semibold text-primary">
                                            {stat.value}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            count
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <div className="col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Achievements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4">
                                    {userAchievements && userAchievements.length > 0 ? (
                                        userAchievements.map((achievement) => {
                                            const achievementData = achievements[achievement.type as keyof typeof achievements];
                                            return (
                                                <div key={achievement.id} className="flex flex-col items-center gap-2">
                                                    <Image
                                                        src={achievementData.icon}
                                                        alt={achievementData.name}
                                                        width={64}
                                                        height={64}
                                                    />
                                                    <span className="text-sm font-medium">{achievementData.name}</span>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No achievements yet.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ClientOnly>
    )
}