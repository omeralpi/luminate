import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPinIcon, UsersIcon } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="container">
            <div className="flex divide-x min-h-screen">
                <div className="flex-1 py-12 pr-12 space-y-6">
                    <div className="text-3xl font-medium">
                        Omeralpi
                    </div>
                    <Tabs defaultValue="posts">
                        <TabsList>
                            <TabsTrigger value="posts">
                                Posts
                            </TabsTrigger>
                            <TabsTrigger value="replies">
                                Lists
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    {children}
                </div>
                <div className="w-[400px]">
                    <div className="py-12 pl-12 space-y-4">
                        <Avatar className="size-[120px]">
                            <AvatarImage className="size-[120px] rounded-full" src="https://github.com/shadcn.png" />
                            <AvatarFallback>
                                O
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-3">
                            <div className="space-y-1">
                                <div className="font-semibold text-lg">
                                    omeralpi
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <MapPinIcon className="size-4" />
                                Bihar, India
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                <UsersIcon className="size-4" />
                                1 followers
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