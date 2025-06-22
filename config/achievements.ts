export type AchievementId = "new" | "genius" | "ten" | "degen";

export type Achievement = {
    id: AchievementId;
    name: string;
    description: string;
    icon: string;
}

export const achievements: Record<AchievementId, Achievement> = {
    new: {
        id: "new",
        name: "New",
        description: "New achievement",
        icon: "/user-badges/new.svg",
    },
    genius: {
        id: "genius",
        name: "Genius",
        description: "Secret Genius Mode",
        icon: "/user-badges/genius.png",
    },
    ten: {
        id: "ten",
        name: "Ten",
        description: "You ATE 10 times",
        icon: "/user-badges/ten.png",
    },
    degen: {
        id: "degen",
        name: "Degen",
        description: "DEGEN",
        icon: "/user-badges/degen.png",
    },
}; 