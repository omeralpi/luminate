'use client';

import { EditProfileModal } from "@/components/edit-profile-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAvatar } from "@/components/user-avatar";
import { achievements } from "@/config/achievements";
import { trpc } from "@/trpc/client";
import { Edit2Icon, MapPinIcon } from "lucide-react";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { walletAddress } = useParams();

    const { data: user } = trpc.user.getByWalletAddress.useQuery({ walletAddress: walletAddress as string });

    const pathname = usePathname();
    const tab = pathname.split('/').pop();
    const tabValue = tab === 'lists' ? 'lists' : 'posts';

    if (!user) {
        return <div>User not found</div>;
    }

    const isOwnProfile = user.walletAddress === walletAddress;

    return (
        <div className="container">
            <div className="flex divide-x min-h-screen">
                <div className="flex-1 py-12 pr-12 space-y-6">
                    <div className="text-3xl font-medium">
                        {user.name}
                    </div>
                    <Tabs value={tabValue}>
                        <TabsList>
                            <TabsTrigger value="posts" onClick={() => {
                                router.push(`/profile/${walletAddress}`);
                            }}>
                                Posts
                            </TabsTrigger>
                            <TabsTrigger value="lists" onClick={() => {
                                router.push(`/profile/${walletAddress}/lists`);
                            }}>
                                Lists
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {children}
                </div>
                <div className="w-[400px] border-l">
                    <div className="py-12 pl-12 space-y-6">
                        <div className="flex items-start justify-between">
                            <UserAvatar user={user} className="w-[120px] h-[120px] shadow-lg" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="space-y-2">
                                    <div className="font-semibold text-lg">
                                        {user.name}
                                    </div>
                                </div>
                                {isOwnProfile && (
                                    <EditProfileModal user={user}>
                                        <Button
                                            variant="outline"
                                            size='sm'
                                        >
                                            <Edit2Icon className="size-3" />
                                            Edit profile
                                        </Button>
                                    </EditProfileModal>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <MapPinIcon className="size-4" />
                                {user.location || 'Unknown location'}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {user.achievements?.map((achievement) => {
                                    const achievementData = achievements[achievement.type];
                                    return (
                                        <Tooltip key={achievement.id}>
                                            <TooltipTrigger>
                                                <div className="flex flex-col items-center gap-2" title={achievementData.name}>
                                                    <Image
                                                        src={achievementData.icon}
                                                        alt={achievementData.name}
                                                        width={64}
                                                        height={64}
                                                    />
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{achievementData.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(achievement.createdAt).toLocaleDateString()}
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}