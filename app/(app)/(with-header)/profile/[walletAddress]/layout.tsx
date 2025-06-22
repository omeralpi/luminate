'use client';

import { EditProfileModal } from "@/components/edit-profile-modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAvatar } from "@/components/user-avatar";
import { trpc } from "@/trpc/client";
import { Edit2Icon, MapPinIcon } from "lucide-react";
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

    console.log(user, walletAddress)
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
                                {
                                    [
                                        'https://media2.dev.to/dynamic/image/width=180,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fbadge%2Fbadge_image%2F373%2FPermit.io_Winner_Badge_2x.png',
                                        'https://media2.dev.to/dynamic/image/width=180,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fbadge%2Fbadge_image%2F349%2FHacktoberfest_Challenge-03.png',
                                        'https://media2.dev.to/dynamic/image/width=180,height=,fit=scale-down,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Fbadge%2Fbadge_image%2F161%2FCommunity_Wellness_Streak_Badge-02.png'
                                    ]
                                        .map((badge) => (
                                            <img key={badge} src={badge} alt="badge" className="size-10" />
                                        ))
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}