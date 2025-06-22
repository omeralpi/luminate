import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { truncateWalletAddress } from "@/lib/utils"
import { LogOut, Settings, User } from "lucide-react"
import Link from "next/link"
import { EditProfileModal } from "./edit-profile-modal"
import { UserAvatar } from "./user-avatar"

interface UserDropdownProps {
    user: {
        name?: string | null
        walletAddress: string
        avatar?: string | null
    }
    onLogout: () => void
}

export function UserDropdown({ user, onLogout }: UserDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="border relative h-9 w-9 rounded-full">
                    <UserAvatar user={user} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm font-medium leading-none">
                            {user.name}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {truncateWalletAddress(user.walletAddress)}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={`/profile/${user.walletAddress}`}>
                        <User className="mr-2 h-4 w-4" />
                        <span>View your profile</span>
                    </Link>
                </DropdownMenuItem>
                <EditProfileModal user={user}>
                    <DropdownMenuItem onSelect={(e) => {
                        e.preventDefault();
                    }}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </DropdownMenuItem>
                </EditProfileModal>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}